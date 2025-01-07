import { Calendar, MapPin, Trophy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { HackathonCardProps } from '@/types/hackathon'
import { addToCalendar } from './calendar-integration'


export default function HackathonCard({ hackathon }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant={
            hackathon.platform === 'Devpost' ? 'default' :
            hackathon.platform === 'MLH' ? 'destructive' :
            'secondary'
          }>{hackathon.platform}</Badge>
          <Badge variant={
            hackathon.mode === 'Online' ? 'outline' :
            hackathon.mode === 'In-Person' ? 'default' :
            'secondary'
          }>{hackathon.mode}</Badge>
        </div>
        <CardTitle className="font-poppins">{hackathon.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{hackathon.location}</span>
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
          {hackathon.techStack.map((tech, index) => (
            <Badge key={index} variant="secondary">{tech}</Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          className="flex-1" 
          onClick={() => window.open(hackathon.url, '_blank')}
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
  )
}