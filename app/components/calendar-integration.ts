// app/components/calendar-integration.ts
import { format } from 'date-fns';
import type { CalendarEvent, Hackathon } from '@/types/hackathon';

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

export function generateICSFile(event: CalendarEvent): string {
  const formatDate = (date: string) => format(new Date(date), "yyyyMMdd'T'HHmmss'Z'");
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${event.title}`,
    event.description && `DESCRIPTION:${event.description}`,
    event.location && `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');

  return 'data:text/calendar;charset=utf8,' + encodeURIComponent(icsContent);
}

export function addToCalendar(hackathon: Hackathon): void {
  const event: CalendarEvent = {
    title: hackathon.title,
    description: `${hackathon.title} on ${hackathon.platform}\n${hackathon.url}`,
    startDate: hackathon.eventDate.split('-')[0].trim(),
    endDate: hackathon.eventDate.split('-')[1]?.trim() || hackathon.eventDate,
    location: hackathon.location
  };

  const googleCalendarUrl = generateGoogleCalendarUrl(event);
  window.open(googleCalendarUrl, '_blank');
}