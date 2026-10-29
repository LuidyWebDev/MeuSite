import * as React from "react"
import { cn } from "@/lib/utils"

const AURORA_LAYERS = [
  { left: "-15%", top: "-30%", pace: 1, start: 0 },
  { left: "40%", top: "-15%", pace: 1.35, start: -0.3 },
  { left: "10%", top: "35%", pace: 1.7, start: -0.65 },
]

export interface AuroraProps extends React.HTMLAttributes<HTMLDivElement> {
  colors?: [string, string, string] | string[]
  duration?: number
  intensity?: number
}

export const Aurora = React.forwardRef<HTMLDivElement, AuroraProps>(
  (
    {
      colors = ["var(--primary)", "var(--muted-foreground)", "var(--accent-foreground)"],
      duration = 20,
      intensity = 0.3,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const [inView, setInView] = React.useState(true)

    React.useEffect(() => {
      const node = containerRef.current
      if (!node || typeof IntersectionObserver === "undefined") return
      const observer = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { rootMargin: "200px" }
      )
      observer.observe(node)
      return () => observer.disconnect()
    }, [])

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      },
      [ref]
    )

    return (
      <div
        ref={setRefs}
        data-slot="aurora"
        className={cn("relative isolate overflow-x-clip", className)}
        {...props}
      >
        <div
          aria-hidden="true"
          data-slot="aurora-lights"
          className="pointer-events-none sticky top-0 left-0 h-screen w-full -mb-[100vh] -z-10 overflow-hidden"
        >
          {AURORA_LAYERS.map((layer, idx) => (
            <span
              key={idx}
              className="animate-aurora absolute size-[75%] rounded-full motion-reduce:animate-none blur-[90px] mix-blend-screen dark:mix-blend-screen"
              style={{
                left: layer.left,
                top: layer.top,
                background: `radial-gradient(closest-side, ${colors[idx] ?? colors[0]}, transparent)`,
                opacity: intensity,
                animationDuration: `${duration * layer.pace}s`,
                animationDelay: `${duration * layer.start}s`,
                animationPlayState: inView ? "running" : "paused",
              }}
            />
          ))}
        </div>
        {children}
      </div>
    )
  }
)

Aurora.displayName = "Aurora"

export default Aurora
