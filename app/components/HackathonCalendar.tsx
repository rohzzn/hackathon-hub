'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

async function fetchHackathons(): Promise<Hackathon[]> {
  const response = await fetch('/api/hackathons')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export default function HackathonCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const { data: hackathons, isLoading, error } = useQuery<Hackathon[], Error>({
    queryKey: ['hackathons'],
    queryFn: fetchHackathons,
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const hackathonsOnSelectedDate = hackathons?.filter(
    (hackathon) => {
      const eventStart = new Date(hackathon.eventDate.split(' - ')[0])
      return eventStart.toDateString() === date?.toDateString()
    }
  ) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hackathon Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => setDate(newDate || undefined)}
          className="rounded-md border"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">
            Hackathons on {date?.toDateString()}
          </h3>
          {hackathonsOnSelectedDate.length > 0 ? (
            <ul className="space-y-2">
              {hackathonsOnSelectedDate.map((hackathon) => (
                <li key={hackathon.id}>
                  <Badge>{hackathon.title}</Badge>
                  <span className="ml-2 text-sm text-gray-500">{hackathon.platform}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hackathons on this date.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

