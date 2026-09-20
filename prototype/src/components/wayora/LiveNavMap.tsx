import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { positionOnRoute, type Waypoint } from "@/lib/wayora-trip";

/**
 * Simulated live navigation map.
 * Purely visual mock — it looks like a turn-by-turn GPS view (Google/Apple style)
 * but the position comes from the prototype trip simulation, not real GPS.
 */

const W = 1000;
const H = 620;

type Pt = { x: number; y: number };

function toWorld(waypoint: Waypoint): Pt {
  return { x: waypoint.location.x * W, y: waypoint.location.y * H };
}

/** Deterministic pseudo-random so the "city" never flickers between renders. */
function rand(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function densify(points: Pt[]): Pt[] {
  const out: Pt[] = [];
  points.forEach((point, index) => {
    const next = points[index + 1];
    out.push(point);
    if (!next) return;
    for (let step = 1; step < 5; step += 1) {
      const t = step / 5;
      const bend = Math.sin(t * Math.PI) * (rand(index + 1) - 0.5) * 46;
      out.push({
        x: point.x + (next.x - point.x) * t + bend * 0.35,
        y: point.y + (next.y - point.y) * t + bend,
      });
    }
  });
  return out;
}

function toPath(points: Pt[]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

export function LiveNavMap({
  route,
  legIndex,
  legProgress,
  paused = false,
  arrived = false,
  className,
}: {
  route: Waypoint[];
  legIndex: number;
  legProgress: number;
  paused?: boolean;
  arrived?: boolean;
  className?: string;
}) {
  const base = route.map(toWorld);
  const currentLeg = Math.min(legIndex, Math.max(0, route.length - 2));
  const here = positionOnRoute(route, currentLeg, legProgress);
  const car: Pt = { x: here.x * W, y: here.y * H };

  const from = base[currentLeg]!;
  const to = base[Math.min(currentLeg + 1, base.length - 1)]!;
  const heading = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;

  const path = useMemo(() => densify(base), [route.map((w) => w.id).join("|")]);
  const travelled = useMemo(() => {
    const covered = path.filter((point, index) => {
      const t = index / (path.length - 1);
      const legT = (currentLeg + legProgress) / Math.max(1, route.length - 1);
      return t <= legT;
    });
    return [...covered, car];
  }, [path, currentLeg, legProgress, car.x, car.y, route.length]);

  const blocks = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        x: rand(i * 3 + 1) * W,
        y: rand(i * 5 + 2) * H,
        w: 26 + rand(i * 7 + 3) * 74,
        h: 20 + rand(i * 11 + 4) * 58,
        r: rand(i * 13 + 5) > 0.75,
      })),
    [],
  );
  const streets = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        vertical: i % 2 === 0,
        pos: rand(i * 17 + 9),
        wide: rand(i * 19 + 11) > 0.68,
      })),
    [],
  );

  // Camera keeps the vehicle centred low on screen, like a real nav view.
  const zoom = 2.35;
  const camX = W / 2 - car.x * zoom + (W / 2) * (1 - zoom) * 0;
  const camY = H * 0.68 - car.y * zoom;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-map", className ?? "h-72")}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        role="img"
        aria-label="Simulated live navigation map"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="nav-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-map)" />
            <stop offset="100%" stopColor="var(--color-muted)" />
          </linearGradient>
          <filter id="nav-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.25" />
          </filter>
        </defs>

        <rect x="0" y="0" width={W} height={H} fill="url(#nav-sky)" />

        <g style={{ transform: `translate(${camX}px, ${camY}px) scale(${zoom})` }}>
          {/* parks + water for map realism */}
          <ellipse cx={W * 0.22} cy={H * 0.28} rx="120" ry="64" fill="var(--color-secondary)" opacity="0.55" />
          <ellipse cx={W * 0.74} cy={H * 0.72} rx="150" ry="70" fill="var(--color-secondary)" opacity="0.4" />
          <path
            d={`M0,${H * 0.52} C${W * 0.25},${H * 0.44} ${W * 0.5},${H * 0.66} ${W},${H * 0.5}`}
            stroke="var(--color-primary-light, var(--color-primary))"
            strokeWidth="16"
            fill="none"
            opacity="0.22"
          />

          {/* city blocks */}
          {blocks.map((block, index) => (
            <rect
              key={index}
              x={block.x}
              y={block.y}
              width={block.w}
              height={block.h}
              rx={block.r ? 8 : 2}
              fill="var(--color-card)"
              stroke="var(--color-border)"
              strokeWidth="1"
              opacity="0.85"
            />
          ))}

          {/* street grid */}
          {streets.map((street, index) =>
            street.vertical ? (
              <line
                key={index}
                x1={street.pos * W}
                y1="0"
                x2={street.pos * W + 40}
                y2={H}
                stroke="var(--color-border)"
                strokeWidth={street.wide ? 9 : 4}
                opacity="0.75"
              />
            ) : (
              <line
                key={index}
                x1="0"
                y1={street.pos * H}
                x2={W}
                y2={street.pos * H - 30}
                stroke="var(--color-border)"
                strokeWidth={street.wide ? 9 : 4}
                opacity="0.75"
              />
            ),
          )}

          {/* remaining route: casing + fill */}
          <path d={toPath(path)} stroke="var(--color-card)" strokeWidth="20" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={toPath(path)} stroke="var(--color-muted-foreground)" strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
          {/* travelled portion */}
          <path d={toPath(travelled)} stroke="var(--color-primary)" strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* waypoint pins */}
          {base.map((point, index) => {
            const waypoint = route[index]!;
            const isEnd = waypoint.kind === "destination";
            return (
              <g key={waypoint.id}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isEnd ? 11 : 8}
                  fill={isEnd ? "var(--color-peach)" : index <= currentLeg ? "var(--color-success)" : "var(--color-primary)"}
                  stroke="var(--color-card)"
                  strokeWidth="4"
                />
                <text
                  x={point.x}
                  y={point.y - 18}
                  textAnchor="middle"
                  className="fill-foreground font-semibold"
                  style={{ fontSize: 15 }}
                >
                  {waypoint.name}
                </text>
              </g>
            );
          })}

          {/* vehicle puck */}
          <g style={{ transform: `translate(${car.x}px, ${car.y}px)` }}>
            <circle r="34" fill="var(--color-primary)" opacity="0.14" className={cn(!paused && !arrived && "animate-pulse")} />
            <g style={{ transform: `rotate(${heading + 90}deg)` }} filter="url(#nav-shadow)">
              <circle r="15" fill="var(--color-card)" />
              <path d="M0,-11 L9,10 L0,5 L-9,10 Z" fill="var(--color-primary)" />
            </g>
          </g>
        </g>
      </svg>

      {/* map chrome */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-background/80 to-transparent" />
      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-card/95 px-2 py-1 text-[9px] font-bold text-primary shadow-card">
        <span className={cn("h-1.5 w-1.5 rounded-full bg-success", !paused && !arrived && "animate-pulse")} />
        {arrived ? "Arrived" : paused ? "Paused" : "GPS live"}
      </div>
      <div className="absolute right-2 top-2 rounded-full bg-card/95 px-2 py-1 text-[9px] font-bold text-muted-foreground shadow-card">
        Simulated
      </div>
    </div>
  );
}
