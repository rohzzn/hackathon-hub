// types/hackathon.d.ts
export interface Hackathon {
  id: string;
  title: string;
  platform: 'Devpost' | 'MLH' | 'Unstop';
  startDate: string;
  participants: number;
  status: 'upcoming' | 'ongoing' | 'closed';
  mode: 'Online' | 'In-Person' | 'Hybrid';
  techStack: string[];
  location: string;
  url: string;
  logoUrl?: string;
}

export interface HackathonCardProps {
  hackathon: Hackathon;
}