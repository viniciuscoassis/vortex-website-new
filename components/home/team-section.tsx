import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const team = [
  {
    name: "Bumble",
    role: "Full Stack & Smart Contract Developer",
    description: "Specializing in blockchain technology, AI integration, and smart contract security.",
    image: "/bumblepfp.png",
  },
  {
    name: "Tuco",
    role: "Project Manager & Community Lead",
    description: "Fostering connections and cultivating a vibrant community around our shared vision.",
    image: "/tucopfp.png",
  },
]

export function TeamSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {team.map((member) => (
        <Card key={member.name} className="bg-black/40 backdrop-blur-md border-zinc-800 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="relative h-full min-h-[200px]">
              <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
            </div>
            <div className="md:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-4">{member.role}</Badge>
                <p className="text-zinc-300">{member.description}</p>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
