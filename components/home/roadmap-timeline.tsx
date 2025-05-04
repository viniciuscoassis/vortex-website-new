import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const phases = [
  {
    id: "phase-0",
    title: "Phase 0 – Oracles",
    status: "Live",
    items: [
      "Launched 65/100 unique Oracle NFTs",
      "Holders gain access to ecosystem reflections and project benefits",
      "A 5% sell tax on $VORTEX funds the revenue share distributed to Oracle holders",
    ],
  },
  {
    id: "phase-1",
    title: "Phase 1 – $VORTEX Token",
    status: "Completed",
    items: [
      "Deployment of the native utility and value token: $VORTEX",
      "5% sell tax allocated to Oracle holders and the ecosystem treasury",
      "Establishes foundational liquidity for future staking, upgrades, and missions",
      "Listed and tradable on Sonic-based DEXs (Equalizer Exchange)",
      "Whitelisted on Equalizer DEX, vaults and bribes enabled",
      "200 000 $VORTEX Aidrop to Oracles holders",
    ],
  },
  {
    id: "phase-2",
    title: "Phase 2 – Galaxy Explorers",
    status: "Upcoming",
    items: [
      "Drop of 2,222 user-customized Galaxy Explorer NFTs, generated via an AI minting agent",
      "Each NFT combines unique traits based on race, gear, and background",
      "Designed for future utility: staking, fusion, missions, and narrative progression",
      "$VORTEX token buyback",
    ],
  },
  {
    id: "phase-3",
    title: "Phase 3 – Journeys",
    status: "In development",
    items: [
      "GameFi layer introducing interactive, narrative-driven staking missions",
      "Galaxy Explorers embark on on-chain cosmic Journeys",
      "Players unlock loot, rewards and evolving storylines",
      "Oracles holders gain access to exclusive missions and rewards"
    ],
  },
]

export function RoadmapTimeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-500 to-transparent"></div>

      <div className="space-y-12 relative">
        {phases.map((phase, index) => (
          <div key={phase.id} className="relative pl-12">
            {/* Circle marker */}
            <div
              className={cn(
                "absolute left-0 top-1.5 h-8 w-8 rounded-full border-4 flex items-center justify-center",
                phase.status === "Completed"
                  ? "bg-emerald-500 border-emerald-600"
                  : phase.status === "Live"
                    ? "bg-cyan-500 border-cyan-600"
                    : "bg-zinc-800 border-zinc-700",
              )}
            >
              <span className="text-xs font-bold text-white">{index}</span>
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-zinc-800 rounded-lg p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                <Badge
                  className={cn(
                    phase.status === "Completed"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : phase.status === "Live"
                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700",
                  )}
                >
                  {phase.status}
                </Badge>
              </div>

              <ul className="space-y-3">
                {phase.items.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5",
                        phase.status === "Completed"
                          ? "bg-emerald-500/20"
                          : phase.status === "Live"
                            ? "bg-cyan-500/20"
                            : "bg-zinc-800",
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm",
                          phase.status === "Completed"
                            ? "text-emerald-400"
                            : phase.status === "Live"
                              ? "text-cyan-400"
                              : "text-zinc-400",
                        )}
                      >
                        ●
                      </span>
                    </div>
                    <span className="text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
