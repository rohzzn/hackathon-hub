// app/api/hackathons/route.ts
import { NextResponse } from 'next/server';
import { parse } from 'node-html-parser';
import * as cheerio from 'cheerio';
import type { Hackathon } from '@/types/hackathon';

function getHackathonStatus(startDate: string, endDate: string): 'upcoming' | 'ongoing' | 'closed' {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'closed';
  return 'ongoing';
}

async function fetchUnstop(): Promise<Hackathon[]> {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json',
      'Referer': 'https://unstop.com/hackathons'
    };
    
    const response = await fetch('https://unstop.com/api/public/opportunity/search?opportunity_type=hackathons&page=1&per_page=20', { headers });
    const data = await response.json();
    
    const hackathons: Hackathon[] = [];
    
    if (data?.data?.data) {
      data.data.data.forEach((hackathon: any) => {
        const startDate = hackathon.start_date || 'TBA';
        const endDate = hackathon.end_date || 'TBA';
        const status = (startDate !== 'TBA' && endDate !== 'TBA') ? 
          getHackathonStatus(startDate, endDate) : 'upcoming';

        hackathons.push({
          id: `unstop-${hackathon.id}`,
          title: hackathon.title,
          platform: 'Unstop',
          startDate,
          participants: hackathon.total_registrations || 0,
          status,
          mode: hackathon.participation_mode?.toLowerCase().includes('online') ? 'Online' : 
                hackathon.participation_mode?.toLowerCase().includes('hybrid') ? 'Hybrid' : 'In-Person',
          techStack: hackathon.tags || [],
          location: hackathon.venue_city || hackathon.venue_country || 'Various',
          url: `https://unstop.com/hackathon/${hackathon.slug}/${hackathon.id}`
        });
      });
    }

    return hackathons;
  } catch (error) {
    console.error('Error fetching Unstop hackathons:', error);
    return [];
  }
}

async function fetchDevpost(): Promise<Hackathon[]> {
  try {
    const response = await fetch('https://devpost.com/api/hackathons');
    const data = await response.json();
    return data.hackathons.map((h: any, index: number) => {
      // Extract start date from submission_period_dates
      const dateMatch = h.submission_period_dates.match(/(\w+ \d+, \d{4})/);
      const startDate = dateMatch ? dateMatch[0] : 'TBA';
      const endDate = h.end_time || 'TBA';
      const status = (startDate !== 'TBA' && endDate !== 'TBA') ? 
        getHackathonStatus(startDate, endDate) : 'upcoming';

      return {
        id: `devpost-${index}`,
        title: h.title,
        platform: 'Devpost',
        startDate,
        participants: h.registrations_count || 0,
        status,
        mode: h.online_only ? 'Online' : 'Hybrid',
        techStack: h.themes || [],
        location: h.online_only ? 'Online' : h.location || 'Various',
        url: h.url
      };
    });
  } catch (error) {
    console.error('Error fetching Devpost hackathons:', error);
    return [];
  }
}

async function fetchMLH(): Promise<Hackathon[]> {
  try {
    const response = await fetch('https://mlh.io/seasons/2025/events');
    const html = await response.text();
    const $ = cheerio.load(html);
    const hackathons: Hackathon[] = [];

    $('.event-wrapper').each((_, element) => {
      const title = $(element).find('.event-name').text().trim();
      const url = $(element).find('a').attr('href') || '';
      const date = $(element).find('.event-date').text().trim();
      const location = $(element).find('.event-location').text().trim();
      const logo = $(element).find('img').attr('src');

      // Parse the date to get just the start date
      const dateMatch = date.match(/(\w+ \d+)/);
      const startDate = dateMatch ? `${dateMatch[0]}, 2024` : 'TBA';
      // Assume MLH hackathons last for 48 hours
      const endDate = startDate !== 'TBA' ? 
        new Date(new Date(startDate).getTime() + (48 * 60 * 60 * 1000)).toISOString() : 'TBA';
      
      const status = (startDate !== 'TBA' && endDate !== 'TBA') ? 
        getHackathonStatus(startDate, endDate) : 'upcoming';

      hackathons.push({
        id: `mlh-${hackathons.length}`,
        title,
        platform: 'MLH',
        startDate,
        participants: 0, // MLH doesn't provide participant count
        status,
        mode: location.toLowerCase().includes('online') ? 'Online' : 'Hybrid',
        techStack: [],
        location,
        url,
        logoUrl: logo
      });
    });

    return hackathons;
  } catch (error) {
    console.error('Error fetching MLH hackathons:', error);
    return [];
  }
}

async function fetchHackathonsFromPlatforms(): Promise<Hackathon[]> {
  try {
    const [devpost, mlh, unstop] = await Promise.allSettled([
      fetchDevpost(),
      fetchMLH(),
      fetchUnstop()
    ]);

    const results: Hackathon[] = [];
    
    if (devpost.status === 'fulfilled') results.push(...devpost.value);
    if (mlh.status === 'fulfilled') results.push(...mlh.value);
    if (unstop.status === 'fulfilled') results.push(...unstop.value);

    return results;
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const mode = searchParams.get('mode');
  const search = searchParams.get('search');
  const status = searchParams.get('status');

  let hackathons = await fetchHackathonsFromPlatforms();

  if (platform && platform !== 'all') {
    hackathons = hackathons.filter(h => h.platform.toLowerCase() === platform.toLowerCase());
  }

  if (mode && mode !== 'all') {
    hackathons = hackathons.filter(h => h.mode.toLowerCase() === mode.toLowerCase());
  }

  if (status && status !== 'all') {
    hackathons = hackathons.filter(h => h.status === status);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    hackathons = hackathons.filter(h => 
      h.title.toLowerCase().includes(searchLower) ||
      h.techStack.some(tech => tech.toLowerCase().includes(searchLower))
    );
  }

  return NextResponse.json(hackathons);
}