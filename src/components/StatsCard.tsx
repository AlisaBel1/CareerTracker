import { useState } from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  variant?: "default" | "accent" | "success" | "warning" | "danger"
  delay?: number
  color?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  delay = 0,
}: StatsCardProps) {
  const [active, setActive] = useState(false)

  const variantStyles = {
    default:
      "bg-card border-border hover:shadow-lg",
    accent:
      "bg-status-applied/10 border-status-applied/30 hover:shadow-[0_0_25px_hsl(var(--status-applied)/0.35)]",
    success:
      "bg-status-offer/10 border-status-offer/30 hover:shadow-[0_0_25px_hsl(var(--status-offer)/0.35)]",
    warning:
      "bg-status-no-response/10 border-status-no-response/30 hover:shadow-[0_0_25px_hsl(var(--status-no-response)/0.35)]",
    danger:
      "bg-status-rejected/10 border-status-rejected/30 hover:shadow-[0_0_25px_hsl(var(--status-rejected)/0.35)]",
  }

  const iconStyles = {
    default: "text-muted-foreground",
    accent: "text-status-applied",
    success: "text-status-offer",
    warning: "text-status-no-response",
    danger: "text-status-rejected",
  }

  return (
    <div
      onClick={() => setActive(!active)}
      className={cn(
        "group relative cursor-pointer rounded-xl border p-5",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:scale-[1.02]",
        "animate-slide-up",
        active && "scale-[1.03]",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* subtle glow overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-white/10 to-transparent" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "rounded-lg p-3 bg-background/50 transition-transform duration-300",
            "group-hover:scale-110",
            iconStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
