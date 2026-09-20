import { cn } from "@/lib/utils";
import { positionOnRoute, type Waypoint } from "@/lib/wayora-trip";

const W = 320;
const H = 200;

function point(waypoint: Waypoint) {
  return { x: waypoint.location.x * W, y: waypoint.location.y * H };
}

function toPath(points: { x: number; y: number }[]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

export function RouteMap({
  route,
  legIndex,
  legProgress = 0,
  active = false,
  className,
  showAllLabels = false,
  interactive = false,
  onSelectStop,
  onSelectStretch,
  highlight,
}: {
  route: Waypoint[];
  legIndex?: number;
  legProgress?: number;
  active?: boolean;
  className?: string;
  showAllLabels?: boolean;
  /** Makes stops and route stretches tappable for stay discovery. */
  interactive?: boolean;
  onSelectStop?: (index: number) => void;
  onSelectStretch?: (index: number) => void;
  highlight?: { kind: "stop" | "stretch"; index: number } | null;
}) {
  const points = route.map(point);
  const currentLeg = Math.min(legIndex ?? 0, Math.max(0, route.length - 2));
  const here = active ? positionOnRoute(route, currentLeg, legProgress) : null;
  const herePoint = here ? { x: here.x * W, y: here.y * H } : null;

  const completed = active && herePoint ? [...points.slice(0, currentLeg + 1), herePoint] : [];
  const remaining = active && herePoint ? [herePoint, ...points.slice(currentLeg + 1)] : points;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-map", className ?? "h-44")}>
      <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:26px_26px]" />
      <svg viewBox={`0 0 ${W} ${H}`} className="relative h-full w-full" role="img" aria-label="Route map">
        <path d={toPath(remaining)} fill="none" stroke="var(--color-muted-foreground)" strokeWidth="3" strokeLinecap="round" strokeDasharray="7 7" opacity={active ? 0.65 : 0.35} />
        {!active && <path d={toPath(points)} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />}
        {completed.length > 1 && (
          <path d={toPath(completed)} fill="none" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" />
        )}

        {/* tappable stretches between stops */}
        {interactive &&
          onSelectStretch &&
          points.slice(0, -1).map((p, index) => {
            const next = points[index + 1]!;
            const mid = { x: (p.x + next.x) / 2, y: (p.y + next.y) / 2 };
            const on = highlight?.kind === "stretch" && highlight.index === index;
            return (
              <g
                key={`stretch-${index}`}
                onClick={() => onSelectStretch(index)}
                role="button"
                tabIndex={0}
                aria-label={`Stays along ${route[index]!.name} to ${route[index + 1]!.name}`}
                className="cursor-pointer"
              >
                <rect x={mid.x - 15} y={mid.y - 8} width="30" height="16" rx="8" fill={on ? "var(--color-primary)" : "var(--color-card)"} stroke="var(--color-primary)" strokeWidth="1.5" />
                <text x={mid.x} y={mid.y + 3} textAnchor="middle" style={{ fontSize: 7.5 }} className={on ? "fill-primary-foreground font-bold" : "fill-primary font-bold"}>
                  Stays
                </text>
              </g>
            );
          })}

        {route.map((waypoint, index) => {
          const p = points[index]!;
          const passed = active && herePoint ? index <= currentLeg : false;
          const isEnd = waypoint.kind === "destination";
          const isStart = waypoint.kind === "origin";
          const label = showAllLabels || isStart || isEnd || (active && index === currentLeg + 1);
          const on = highlight?.kind === "stop" && highlight.index === index;
          return (
            <g
              key={waypoint.id}
              className={interactive ? "cursor-pointer" : undefined}
              onClick={interactive && onSelectStop ? () => onSelectStop(index) : undefined}
              role={interactive ? "button" : undefined}
              tabIndex={interactive ? 0 : undefined}
              aria-label={interactive ? `Stays near ${waypoint.name}` : undefined}
            >
              {interactive && <circle cx={p.x} cy={p.y} r="14" fill="transparent" />}
              {on && <circle cx={p.x} cy={p.y} r="11" fill="var(--color-primary)" opacity="0.2" />}
              <circle
                cx={p.x}
                cy={p.y}
                r={isStart || isEnd ? 6 : 4.5}
                fill={isEnd ? "var(--color-peach)" : passed ? "var(--color-success)" : isStart ? "var(--color-success)" : "var(--color-primary)"}
                stroke="var(--color-card)"
                strokeWidth="2.5"
              />
              {label && (
                <text
                  x={Math.min(W - 6, Math.max(6, p.x))}
                  y={p.y - 10}
                  textAnchor={p.x > W - 70 ? "end" : p.x < 60 ? "start" : "middle"}
                  className="fill-foreground text-[9px] font-semibold"
                  style={{ fontSize: 9 }}
                >
                  {waypoint.name}
                </text>
              )}
            </g>
          );
        })}
        {herePoint && (
          <g>
            <circle cx={herePoint.x} cy={herePoint.y} r="12" fill="var(--color-primary)" opacity="0.18" />
            <circle cx={herePoint.x} cy={herePoint.y} r="6.5" fill="var(--color-primary)" stroke="var(--color-card)" strokeWidth="3" />
          </g>
        )}
      </svg>
      {active && (
        <span className="absolute bottom-2 left-2 rounded-full bg-card/90 px-2 py-1 text-[9px] font-bold text-primary">Live route</span>
      )}
      {interactive && (
        <span className="absolute bottom-2 right-2 rounded-full bg-card/90 px-2 py-1 text-[9px] font-bold text-primary">Tap a stop for stays</span>
      )}
    </div>
  );
}

export function SafetyBadge({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold text-secondary-foreground", className)}>
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
        <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" />
      </svg>
      Safety {rating.toFixed(1)}/5
    </span>
  );
}
