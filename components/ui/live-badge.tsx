import { Badge } from "@/components/ui/badge"

export function LiveBadge() {
  return (
    <Badge className="bg-red-500 text-white animate-pulse-slow">
      <span className="mr-1 h-2 w-2 rounded-full bg-white"></span>
      LIVE
    </Badge>
  )
}
