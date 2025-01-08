// app/components/HackathonCard.tsx
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { HackathonCardProps } from '@/types/hackathon';
import { addToCalendar } from './calendar-integration';

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  const getPlatformVariant = (platform: string) => {
    switch(platform) {
      case 'Devpost': return 'default';
      case 'MLH': return 'destructive';
      case 'Unstop': return 'secondary';
      default: return 'secondary';
    }
  };

  const getModeVariant = (mode: string) => {
    switch(mode) {
      case 'Online': return 'outline';
      case 'In-Person': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'ongoing': return 'default';
      case 'upcoming': return 'secondary';
      case 'closed': return 'destructive';
      default: return 'secondary';
    }
  };

  // Format status for display
  const getStatusDisplay = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge variant={getPlatformVariant(hackathon.platform)}>
            {hackathon.platform}
          </Badge>
          <Badge variant={getModeVariant(hackathon.mode)}>
            {hackathon.mode}
          </Badge>
        </div>
        <CardTitle className="font-poppins line-clamp-2 min-h-[3rem]">
          {hackathon.title}
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{hackathon.location}</span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Starts: {hackathon.startDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Participants: {hackathon.participants.toLocaleString()}</span>
          </div>
          <div>
            <Badge variant={getStatusVariant(hackathon.status)} className="mt-2">
              {getStatusDisplay(hackathon.status)}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {hackathon.techStack.map((tech, index) => (
            <Badge key={index} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          className="flex-1" 
          onClick={() => hackathon.url && window.open(hackathon.url, '_blank')}
        >
          Apply Now
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          variant="outline"
          onClick={() => addToCalendar(hackathon)}
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}