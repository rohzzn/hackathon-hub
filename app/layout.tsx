import { Inter, Poppins } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'] })
export const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const siteConfig = {
  name: "Hackathon Hub",
  description: "Discover and track hackathons from major platforms",
  platforms: [
    { name: "Devpost", value: "devpost" },
    { name: "MLH", value: "mlh" },
    { name: "Devfolio", value: "devfolio" },
    { name: "Unstop", value: "unstop" }
  ],
  modes: [
    { name: "All Modes", value: "all" },
    { name: "Online", value: "online" },
    { name: "In-Person", value: "in-person" },
    { name: "Hybrid", value: "hybrid" }
  ]
}