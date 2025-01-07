// app/api/hackathons/route.ts
import { NextResponse } from 'next/server';
import { parse } from 'node-html-parser';
import * as cheerio from 'cheerio';
import type { Hackathon } from '@/types/hackathon';

async function fetchDevfolio(): Promise<Hackathon[]> {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    };
    const response = await fetch('https://devfolio.co/hackathons', { headers });
    const html = await response.text();
    const hackathons: Hackathon[] = [];
    const $ = cheerio.load(html);

    $('[data-testid="hackathon-card"]').each((_, element) => {
      const title = $(element).find('h3').text().trim();
      const url = 'https://devfolio.co' + $(element).find('a').attr('href');
      const dates = $(element).find('[data-testid="date"]').text().trim();
      const mode = $(element).find('[data-testid="mode"]').text().trim();

      hackathons.push({
        id: `devfolio-${hackathons.length}`,
        title,
        platform: 'Devfolio',
        registrationDeadline: dates,
        eventDate: dates,
        prizePool: 'TBA',
        mode: mode.includes('Online') ? 'Online' : mode.includes('Hybrid') ? 'Hybrid' : 'In-Person',
        techStack: [],
        location: mode.includes('Online') ? 'Online' : 'Various',
        url
      });
    });

    return hackathons;
  } catch (error) {
    console.error('Error fetching Devfolio hackathons:', error);
    return [];
  }
}

async function fetchUnstop(): Promise<Hackathon[]> {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    };
    const response = await fetch('https://unstop.com/hackathons', { headers });
    const html = await response.text();
    const $ = cheerio.load(html);
    const hackathons: Hackathon[] = [];

    $('.opportunity-card').each((_, element) => {
      const title = $(element).find('.opportunity-title').text().trim();
      const url = $(element).find('a').attr('href') || '';
      const dates = $(element).find('.date-text').text().trim();
      const location = $(element).find('.location').text().trim();

      hackathons.push({
        id: `unstop-${hackathons.length}`,
        title,
        platform: 'Unstop',
        registrationDeadline: dates,
        eventDate: dates,
        prizePool: 'TBA',
        mode: location.toLowerCase().includes('online') ? 'Online' : 'Hybrid',
        techStack: [],
        location,
        url: `https://unstop.com${url}`
      });
    });

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
    return data.hackathons.map((h: any, index: number) => ({
      id: `devpost-${index}`,
      title: h.title,
      platform: 'Devpost',
      registrationDeadline: h.submission_period_dates,
      eventDate: h.submission_period_dates,
      prizePool: h.prize_amount ? `$${h.prize_amount}` : 'TBA',
      mode: h.online_only ? 'Online' : 'Hybrid',
      techStack: h.themes || [],
      location: h.online_only ? 'Online' : h.location || 'Various',
      url: h.url
    }));
  } catch (error) {
    console.error('Error fetching Devpost hackathons:', error);
    return [];
  }
}

async function fetchMLH(): Promise<Hackathon[]> {
  try {
    const response = await fetch('https://mlh.io/seasons/2024/events');
    const html = await response.text();
    const $ = cheerio.load(html);
    const hackathons: Hackathon[] = [];

    $('.event-wrapper').each((_, element) => {
      const title = $(element).find('.event-name').text().trim();
      const url = $(element).find('a').attr('href') || '';
      const date = $(element).find('.event-date').text().trim();
      const location = $(element).find('.event-location').text().trim();
      const logo = $(element).find('img').attr('src');

      hackathons.push({
        id: `mlh-${hackathons.length}`,
        title,
        platform: 'MLH',
        registrationDeadline: date,
        eventDate: date,
        prizePool: 'Various',
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
  const [devpost, mlh, devfolio, unstop] = await Promise.all([
    fetchDevpost(),
    fetchMLH(),
    fetchDevfolio(),
    fetchUnstop()
  ]);

  return [...devpost, ...mlh, ...devfolio, ...unstop];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const mode = searchParams.get('mode');
  const search = searchParams.get('search');

  let hackathons = await fetchHackathonsFromPlatforms();

  if (platform && platform !== 'all') {
    hackathons = hackathons.filter(h => h.platform.toLowerCase() === platform.toLowerCase());
  }

  if (mode && mode !== 'all') {
    hackathons = hackathons.filter(h => h.mode.toLowerCase() === mode.toLowerCase());
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