'use client'

import { useQuery } from '@tanstack/react-query'
import HackathonCard from './HackathonCard'
import { Skeleton } from "@/components/ui/skeleton"

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

async function fetchHackathons(platform: string, mode: string, search: string): Promise<Hackathon[]> {
  const params = new URLSearchParams({ platform, mode, search }).toString()
  const response = await fetch(`/api/hackathons?${params}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export default function HackathonList({ platform, mode, search }: { platform: string, mode: string, search: string }) {
  const { data: hackathons, isLoading, error } = useQuery<Hackathon[], Error>({
    queryKey: ['hackathons', platform, mode, search],
    queryFn: () => fetchHackathons(platform, mode, search),
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!hackathons || hackathons.length === 0) {
    return <div>No hackathons found.</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {hackathons.map((hackathon) => (
        <HackathonCard key={hackathon.id} hackathon={hackathon} />
      ))}
    </div>
  )
}

