// types/hackathon.d.ts
export interface Hackathon {
    id: string;
    title: string;
    platform: 'Devpost' | 'MLH' | 'Devfolio' | 'Unstop';
    registrationDeadline: string;
    eventDate: string;
    prizePool: string;
    mode: 'Online' | 'In-Person' | 'Hybrid';
    techStack: string[];
    location: string;
    url: string;
    logoUrl?: string;
  }
  
  export interface CalendarEvent {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location?: string;
  }
  
  export interface HackathonCardProps {
    hackathon: Hackathon;
  }
  
  export interface CalendarExportOptions {
    type: 'google' | 'ics';
    event: CalendarEvent;
  }