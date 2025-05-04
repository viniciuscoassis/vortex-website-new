import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "milesmuso.s",
    role: "Oracle Holder",
    avatar: "M",
    content:
      "I bought these two #Oracle NFTs two months ago for the art. They cost next to nothing. A few days ago I was surprised to see some $VORTEX in my wallet, valued at 80 dollars. I didn't even put the two together until I saw this post. BTW the floor on these is now 600 $S 😁",
    stars: 5,
  },
  {
    name: "paleozombie_crypto",
    role: "Community Member",
    avatar: "P",
    content:
      "Rev share for Oracle holders is fire.",
    stars: 5,
  },
  {
    name: "Zethes",
    role: "Community Member",
    avatar: "Z",
    content:
      "There is a guaranteed 5x play on Sonic. $VORTEX First example of Art + AI is coming. Won't take that much time to achieve great things.",
    stars: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative z-10 py-20 bg-black/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm mb-4">
            Community
          </Badge>
          <h2 className="text-4xl font-bold gradient-text mb-4">What Explorers Say</h2>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Hear from our community members about their journey through the cosmos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-black/40 backdrop-blur-md border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                    <span className="text-emerald-400 font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-zinc-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.stars ? "text-yellow-400 fill-yellow-400" : "text-zinc-600"}`}
                    />
                  ))}
                </div>
                <p className="text-zinc-300 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
