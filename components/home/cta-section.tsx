import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="relative z-10 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 backdrop-blur-md border border-emerald-500/20 rounded-xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Explore the Cosmos?</h2>
          <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
            Join the Vortex Foundation community today and become part of our cosmic journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
              asChild
            >
              <Link href="/mint">Mint an Explorer</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              asChild
            >
              <Link href="https://t.me/oraclefantom" target="_blank">
                Join Telegram
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
