// app/components/calendar-integration.ts
import { format } from 'date-fns';
import type { Hackathon } from '@/types/hackathon';

interface CalendarEvent {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const details = [
    `text=${encodeURIComponent(event.title)}`,
    `dates=${encodeURIComponent(event.startDate)}/${encodeURIComponent(event.endDate)}`,
    event.description && `details=${encodeURIComponent(event.description)}`,
    event.location && `location=${encodeURIComponent(event.location)}`
  ].filter(Boolean).join('&');

  return `${base}&${details}`;
}

export function addToCalendar(hackathon: Hackathon): void {
  // Assume a hackathon is 48 hours long if no end date is provided
  const startDate = new Date(hackathon.startDate);
  const endDate = new Date(startDate.getTime() + (48 * 60 * 60 * 1000));

  const event: CalendarEvent = {
    title: hackathon.title,
    description: `${hackathon.title} on ${hackathon.platform}\n${hackathon.url}`,
    startDate: format(startDate, "yyyyMMdd'T'HHmmss'Z'"),
    endDate: format(endDate, "yyyyMMdd'T'HHmmss'Z'"),
    location: hackathon.location
  };

  const googleCalendarUrl = generateGoogleCalendarUrl(event);
  window.open(googleCalendarUrl, '_blank');
}