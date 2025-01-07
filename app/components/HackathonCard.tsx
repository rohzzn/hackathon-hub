import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MapPinIcon, TrophyIcon } from 'lucide-react'

interface Hackathon {
  id: string
  title: string
  platform: string
  registrationDeadline: string
  eventDate: string
  prizePool: string
  mode: string
  techStack: string[]
  location: string
}

export default function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{hackathon.title}</CardTitle>
        <CardDescription>{hackathon.platform}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Registration: {hackathon.registrationDeadline}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Event: {hackathon.eventDate}</span>
          </div>
          <div className="flex items-center">
            <TrophyIcon className="mr-2 h-4 w-4" />
            <span>Prize Pool: {hackathon.prizePool}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="mr-2 h-4 w-4" />
            <span>{hackathon.location}</span>
          </div>
          <div>
            <Badge>{hackathon.mode}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {hackathon.techStack.map((tech, index) => (
              <Badge key={index} variant="secondary">{tech}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Apply Now</Button>
      </CardFooter>
    </Card>
  )
}

