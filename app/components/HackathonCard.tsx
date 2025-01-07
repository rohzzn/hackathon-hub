// app/components/HackathonCard.tsx
import { Calendar, MapPin, Trophy, ExternalLink } from 'lucide-react';
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

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant={getPlatformVariant(hackathon.platform)}>
            {typeof hackathon.platform === 'string' ? hackathon.platform : 'Unknown'}
          </Badge>
          <Badge variant={getModeVariant(hackathon.mode)}>
            {typeof hackathon.mode === 'string' ? hackathon.mode : 'Unknown'}
          </Badge>
        </div>
        <CardTitle className="font-poppins">
          {typeof hackathon.title === 'string' ? hackathon.title : 'Untitled Hackathon'}
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{typeof hackathon.location === 'string' ? hackathon.location : 'Location TBA'}</span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Registration: {hackathon.registrationDeadline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Event: {hackathon.eventDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>Prize Pool: {hackathon.prizePool}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {Array.isArray(hackathon.techStack) ? 
            hackathon.techStack.map((tech, index) => (
              <Badge key={index} variant="secondary">
                {typeof tech === 'string' ? tech : ''}
              </Badge>
            )) : null}
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