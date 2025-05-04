import { GalaxyBackground } from "@/components/galaxy-background"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ChevronRight, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { RoadmapTimeline } from "@/components/home/roadmap-timeline"
import { TeamSection } from "@/components/home/team-section"
import { TokenomicsSection } from "@/components/home/tokenomics-section"
import { FAQSection } from "@/components/home/faq-section"
import { TokenMetrics } from "@/components/home/token-metrics"
import { TestimonialsSection } from "@/components/home/testimonials"
import { CTASection } from "@/components/home/cta-section"
import { OracleCarousel } from "@/components/home/oracle-carousel"

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden text-white">
      <GalaxyBackground />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm">
                Welcome to the Cosmos
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter gradient-text">Vortex Foundation</h1>
              <p className="text-xl text-zinc-300 max-w-lg">
                Explore the cosmic unknown through our NFT collection and tokenized ecosystem. Discover the secrets of
                the universe with Vortex.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
                  asChild
                >
                  <Link
                    href="https://equalizer.exchange/swap?fromToken=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&toToken=0xf316A1cB7376021ad52705c1403DF86C7A7A18d0"
                    target="_blank"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buy $VORTEX
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  asChild
                >
                  <Link href="https://paintswap.io/sonic/collections/oracles/listings" target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buy Oracles NFT
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[400px] w-full rounded-lg overflow-hidden border border-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Vortex Foundation"
                    width={300}
                    height={300}
                    priority
                    className="object-contain h-full w-auto"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -top-6 -left-6 h-32 w-32 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Metrics Section
      <section className="relative z-10 py-10">
        <div className="container mx-auto px-4">
          <TokenMetrics />
        </div>
      </section> */}

      {/* Oracles Section */}
      <section className="relative z-10 py-20 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm mb-4">
              Cosmic Entities
            </Badge>
            <h2 className="text-4xl font-bold gradient-text mb-4">Oracles Collection</h2>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              100 AI-generated, unique black hole NFTs that grant holders special powers within the Vortex ecosystem.
            </p>
            <div className="flex justify-center mt-4">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                66/100 Released
              </Badge>
              <Badge variant="outline" className="border-zinc-700 text-zinc-400 ml-2">
                Stay tuned for more!
              </Badge>
            </div>
          </div>

          {/* Replace OracleShowcase with OracleCarousel */}
          <OracleCarousel />

          <div className="flex justify-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
              asChild
            >
              <Link href="/oracles">
                View All Oracles
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm mb-4">
              Economics
            </Badge>
            <h2 className="text-4xl font-bold gradient-text mb-4">Tokenomics</h2>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              The economic foundation of the Vortex ecosystem, designed for sustainability and value creation.
            </p>
          </div>

          <TokenomicsSection />
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Roadmap Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm mb-4">
              Vision
            </Badge>
            <h2 className="text-4xl font-bold gradient-text mb-4">Roadmap</h2>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              Our journey through the cosmos, charting the path of the Vortex Foundation's evolution.
            </p>
          </div>

          <RoadmapTimeline />
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 py-20 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm mb-4">
              Creators
            </Badge>
            <h2 className="text-4xl font-bold gradient-text mb-4">Vortex Innovators</h2>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              Meet the visionaries behind the Vortex Foundation, pushing the boundaries of what's possible.
            </p>
          </div>

          <TeamSection />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Call to Action Section */}
      <CTASection />

      {/* Network Status Indicator for Testnet */}
      {process.env.NEXT_PUBLIC_NETWORK === "testnet" && (
        <div className="fixed bottom-4 right-4 z-50 bg-yellow-500/90 text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Testnet Mode
        </div>
      )}
    </div>
  )
}
