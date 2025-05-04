import { Card, CardContent } from "@/components/ui/card"

export function MintInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium text-zinc-400">Mint Price</h3>
          <p className="text-3xl font-bold text-emerald-400">50 $S</p>
        </CardContent>
      </Card>

      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium text-zinc-400">Total Supply</h3>
          <p className="text-3xl font-bold text-emerald-400">2,222</p>
        </CardContent>
      </Card>

      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium text-zinc-400">Minted</h3>
          <p className="text-3xl font-bold text-emerald-400">0</p>
          <div className="w-full bg-zinc-800 h-2 rounded-full mt-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
              style={{ width: "1.89%" }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
