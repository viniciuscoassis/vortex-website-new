"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const faqItems = [
  {
    question: "What is Vortex Foundation?",
    answer:
      "Vortex Foundation is a cosmic-themed NFT and token ecosystem built on the Sonic blockchain, featuring unique Oracle NFTs, the $VORTEX token, and an upcoming GameFi layer with Galaxy Explorers and narrative-driven Journeys. Also, we have a current development of AI Agents with onchain functionality.",
  },
  {
    question: "What are Oracle NFTs?",
    answer:
      "Oracles are a collection of 100 AI-generated, unique black hole NFTs. Oracle holders receive 5% of all $VORTEX sell taxes, gain early access to new features, and its the main target for airdrops from partners. Oracles holders will get a free explorer NFT.",
  },
  {
    question: "How can I buy $VORTEX tokens?",
    answer:
      "$VORTEX tokens can be purchased on Equalizer Exchange. You'll need to connect your wallet, swap SONIC for $VORTEX, and set an appropriate slippage tolerance (usually 6-7%).",
  },
  {
    question: "What is the total supply of $VORTEX?",
    answer:
      "The total supply of $VORTEX is 10,000,000 tokens. The distribution includes 70% for liquidity and 30% for treasury.",
  },
  {
    question: "What are Galaxy Explorers?",
    answer:
      "Galaxy Explorers are the upcoming 2,222 user-customized NFTs generated via an AI minting agent. Each Explorer will have unique traits based on race, gear, and background, designed for future utility in staking, fusion, missions, and narrative progression. Each explorer will have changes to getting jackpot rewards through travels.",
  },
  {
    question: "What blockchain does Vortex Foundation use?",
    answer:
      "Vortex Foundation is built on the Sonic blockchain, a high-performance EVM-compatible chain designed for fast transactions and low fees.",
  },
]

export function FAQSection() {
  return (
    <section className="relative z-10 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm mb-4">
            Support
          </Badge>
          <h2 className="text-4xl font-bold gradient-text mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Everything you need to know about the Vortex Foundation ecosystem.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-black/40 backdrop-blur-md border-zinc-800 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 text-white hover:text-emerald-400">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-zinc-300">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
