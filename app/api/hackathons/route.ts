import { NextResponse } from 'next/server'

interface Hackathon {
  id: string;
  title: string;
  platform: string;
  registrationDeadline: string;
  eventDate: string;
  prizePool: string;
  mode: string;
  techStack: string[];
  location: string;
}

async function fetchDevpostHackathons(): Promise<Hackathon[]> {
  // Simulating API call with mock data
  return [
    {
      id: 'devpost-1',
      title: 'AI Innovation Challenge',
      platform: 'Devpost',
      registrationDeadline: '2023-12-31',
      eventDate: '2024-01-15 - 2024-01-17',
      prizePool: '$10,000',
      mode: 'Online',
      techStack: ['AI', 'Machine Learning', 'Python'],
      location: 'Online'
    },
    {
      id: 'devpost-2',
      title: 'Web3 Hackathon',
      platform: 'Devpost',
      registrationDeadline: '2023-11-30',
      eventDate: '2023-12-10 - 2023-12-12',
      prizePool: '$5,000',
      mode: 'Hybrid',
      techStack: ['Blockchain', 'Solidity', 'JavaScript'],
      location: 'New York, NY'
    }
  ]
}

async function fetchMLHHackathons(): Promise<Hackathon[]> {
  // Simulating API call with mock data
  return [
    {
      id: 'mlh-1',
      title: 'Global Hack Week',
      platform: 'MLH',
      registrationDeadline: '2024-01-15',
      eventDate: '2024-02-01 - 2024-02-07',
      prizePool: 'Varies',
      mode: 'Online',
      techStack: ['Various'],
      location: 'Online'
    }
  ]
}

async function fetchHackathonsFromPlatforms(): Promise<Hackathon[]> {
  const [devpostHackathons, mlhHackathons] = await Promise.all([
    fetchDevpostHackathons(),
    fetchMLHHackathons()
  ])

  return [...devpostHackathons, ...mlhHackathons]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform')
  const mode = searchParams.get('mode')
  const search = searchParams.get('search')

  let hackathons = await fetchHackathonsFromPlatforms()

  if (platform && platform !== 'all') {
    hackathons = hackathons.filter(h => h.platform === platform)
  }

  if (mode && mode !== 'all') {
    hackathons = hackathons.filter(h => h.mode.toLowerCase() === mode.toLowerCase())
  }

  if (search) {
    const searchLower = search.toLowerCase()
    hackathons = hackathons.filter(h => 
      h.title.toLowerCase().includes(searchLower) ||
      h.techStack.some(tech => tech.toLowerCase().includes(searchLower))
    )
  }

  return NextResponse.json(hackathons)
}

