import { useMemo, useState } from "react";
import { ArrowRight, BedDouble, Check, ChevronRight, Plus, Sparkles, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { RouteMap, SafetyBadge } from "@/components/wayora/RouteMap";
import type { Waypoint } from "@/lib/wayora-trip";
import {
  findStay,
  formatPrice,
  optimalPlanForRoute,
  stayAreasForRoute,
  staysForArea,
  type StayArea,
  type StayOption,
} from "@/lib/wayora-stays";

type Sort = "best" | "price" | "safety" | "detour";

function StayCard({
  stay,
  added,
  onToggle,
}: {
  stay: StayOption;
  added: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-3", added && "border-primary bg-primary-soft/40")}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-bold">{stay.name}</p>
          <p className="mt-0.5 truncate text-[9px] text-muted-foreground">
            {stay.type} · {stay.area} · {stay.distanceFromRoute}
          </p>
        </div>
        <SafetyBadge rating={stay.safetyRating} />
      </div>
      <div className="mt-2 grid grid-cols-3 divide-x divide-border rounded-xl bg-muted py-2 text-center">
        <div>
          <strong className="block text-[10px]">{formatPrice(stay.pricePerNight)}</strong>
          <span className="text-[8px] text-muted-foreground">Per night</span>
        </div>
        <div>
          <strong className="block text-[10px]">{stay.rating.toFixed(1)} ★</strong>
          <span className="text-[8px] text-muted-foreground">Guest rating</span>
        </div>
        <div>
          <strong className="block text-[10px]">{stay.detourMin} min</strong>
          <span className="text-[8px] text-muted-foreground">Detour</span>
        </div>
      </div>
      <p className="mt-2 text-[10px] leading-4 text-muted-foreground">{stay.note}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {[...stay.amenities.slice(0, 3), ...stay.safetyNotes.slice(0, 1)].map((tag) => (
          <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[8px] font-semibold text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
      <Button
        variant={added ? "soft" : "outline"}
        className={cn("mt-3 h-9 w-full text-xs", added && "border-primary text-primary")}
        onClick={onToggle}
      >
        {added ? (
          <>
            <Check />
            In your itinerary
          </>
        ) : (
          <>
            <Plus />
            Add stay to trip
          </>
        )}
      </Button>
    </div>
  );
}

function AreaSheet({
  area,
  route,
  stayIds,
  toggleStay,
  onClose,
}: {
  area: StayArea | null;
  route: Waypoint[];
  stayIds: string[];
  toggleStay: (id: string) => void;
  onClose: () => void;
}) {
  const [sort, setSort] = useState<Sort>("best");
  const stays = useMemo(() => {
    if (!area) return [];
    const list = staysForArea(area, route);
    const sorted = [...list];
    if (sort === "price") sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === "safety") sorted.sort((a, b) => b.safetyRating - a.safetyRating);
    if (sort === "detour") sorted.sort((a, b) => a.detourMin - b.detourMin);
    if (sort === "best") sorted.sort((a, b) => b.safetyRating + b.rating - (a.safetyRating + a.rating));
    return sorted;
  }, [area, route, sort]);

  const sorts: { id: Sort; label: string }[] = [
    { id: "best", label: "Best match" },
    { id: "price", label: "Lowest price" },
    { id: "safety", label: "Safest" },
    { id: "detour", label: "Closest to route" },
  ];

  return (
    <Sheet open={Boolean(area)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="left-1/2 flex max-h-[78vh] w-full max-w-[390px] -translate-x-1/2 flex-col rounded-t-[28px] border-x border-t border-border bg-card p-4"
      >
        <SheetHeader className="text-left">
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary-soft px-2 py-1 text-[9px] font-bold text-primary">
            <BedDouble className="h-3 w-3" />
            {stays.length} stays near this area
          </span>
          <SheetTitle className="truncate text-base">{area?.title}</SheetTitle>
          <SheetDescription className="text-[10px]">{area?.subtitle} · sample availability for the prototype</SheetDescription>
        </SheetHeader>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {sorts.map((item) => (
            <Button
              key={item.id}
              variant={sort === item.id ? "soft" : "outline"}
              onClick={() => setSort(item.id)}
              className={cn("h-8 shrink-0 rounded-full px-3 text-[10px]", sort === item.id && "border-primary text-primary")}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <div className="mt-2 flex-1 space-y-2 overflow-y-auto pb-2">
          {stays.length === 0 && (
            <p className="py-6 text-center text-[10px] text-muted-foreground">No stays mapped to this area yet.</p>
          )}
          {stays.map((stay) => (
            <StayCard key={stay.id} stay={stay} added={stayIds.includes(stay.id)} onToggle={() => toggleStay(stay.id)} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Interactive stay discovery for the finalised itinerary: tap any stop or
 * stretch on the route to see nearby stays, or take Wayora's Optimal Plan.
 */
export function StayDiscovery({
  route,
  stayIds,
  toggleStay,
  setStayIds,
}: {
  route: Waypoint[];
  stayIds: string[];
  toggleStay: (id: string) => void;
  setStayIds: (ids: string[]) => void;
}) {
  const areas = useMemo(() => stayAreasForRoute(route), [route]);
  const plan = useMemo(() => optimalPlanForRoute(route), [route]);
  const [activeAreaId, setActiveAreaId] = useState<string | null>(null);
  const activeArea = areas.find((area) => area.id === activeAreaId) ?? null;
  const chosen = stayIds.map((id) => findStay(id)).filter(Boolean) as StayOption[];
  const planApplied = plan.stays.every((item) => stayIds.includes(item.stay.id)) && plan.stays.length > 0;

  const openStop = (index: number) => {
    const area = areas.find((item) => item.kind === "stop" && item.index === index);
    if (area) setActiveAreaId(area.id);
  };
  const openStretch = (index: number) => {
    const area = areas.find((item) => item.kind === "stretch" && item.index === index);
    if (area) setActiveAreaId(area.id);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <RouteMap
          route={route}
          className="h-48"
          showAllLabels
          interactive
          onSelectStop={openStop}
          onSelectStretch={openStretch}
          highlight={activeArea ? { kind: activeArea.kind, index: activeArea.index } : null}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {areas.map((area) => (
          <Button
            key={area.id}
            variant="outline"
            onClick={() => setActiveAreaId(area.id)}
            className="h-8 shrink-0 rounded-full bg-card px-3 text-[10px]"
          >
            <BedDouble className="h-3 w-3 text-primary" />
            {area.kind === "stop" ? area.title : `${area.title} stretch`}
          </Button>
        ))}
      </div>

      <section className="rounded-2xl border border-primary bg-primary-soft p-4">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <strong className="block text-xs">Wayora Optimal Plan</strong>
            <p className="text-[9px] text-muted-foreground">
              {plan.stays.length} stay{plan.stays.length > 1 ? "s" : ""} · {formatPrice(plan.totalPrice)} total · safety{" "}
              {plan.avgSafety.toFixed(1)}/5
            </p>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          {plan.stays.map((item) => (
            <div key={item.stay.id} className="rounded-xl bg-card p-2.5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-primary">{item.nightLabel}</p>
                  <p className="truncate text-[11px] font-bold">{item.stay.name}</p>
                  <p className="truncate text-[9px] text-muted-foreground">
                    {item.stay.distanceFromRoute} · {formatPrice(item.stay.pricePerNight)} · {item.stay.rating.toFixed(1)} ★
                  </p>
                </div>
                <Star className="h-3.5 w-3.5 shrink-0 text-primary" fill="currentColor" />
              </div>
              <p className="mt-1 text-[9px] leading-3.5 text-muted-foreground">{item.reason}</p>
            </div>
          ))}
        </div>
        <Button
          variant={planApplied ? "soft" : "wayora"}
          className={cn("mt-3 w-full", planApplied && "border border-primary text-primary")}
          onClick={() => setStayIds(planApplied ? [] : plan.stays.map((item) => item.stay.id))}
        >
          {planApplied ? (
            <>
              <Check />
              Optimal plan added
            </>
          ) : (
            <>
              Use optimal plan
              <ArrowRight />
            </>
          )}
        </Button>
        <p className="mt-2 text-center text-[9px] text-muted-foreground">
          A suggestion only — tap any point on the route to explore alternatives.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <h3 className="truncate text-[13px] font-bold">Stays in your itinerary</h3>
          <span className="text-[9px] text-muted-foreground">{chosen.length} selected</span>
        </div>
        {chosen.length === 0 ? (
          <p className="text-[10px] leading-4 text-muted-foreground">
            No stays added yet. Tap a stop or a stretch on the map to see nearby options with price, detour and safety.
          </p>
        ) : (
          <div className="space-y-2">
            {[...chosen]
              .sort((a, b) => a.km - b.km)
              .map((stay) => (
                <div key={stay.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl bg-muted p-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-card text-primary">
                    <BedDouble className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold">{stay.name}</p>
                    <p className="truncate text-[9px] text-muted-foreground">
                      {stay.area} · {formatPrice(stay.pricePerNight)} · Safety {stay.safetyRating.toFixed(1)}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Remove ${stay.name}`} onClick={() => toggleStay(stay.id)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            <div className="flex items-center justify-between rounded-xl bg-primary-soft px-3 py-2 text-[10px] text-primary">
              <span>Estimated stay cost</span>
              <strong>{formatPrice(chosen.reduce((sum, stay) => sum + stay.pricePerNight, 0))}</strong>
            </div>
          </div>
        )}
      </section>

      <AreaSheet area={activeArea} route={route} stayIds={stayIds} toggleStay={toggleStay} onClose={() => setActiveAreaId(null)} />
    </div>
  );
}

/** Compact read-only summary of chosen stays, for the trip overview. */
export function StaySummary({ stayIds }: { stayIds: string[] }) {
  const chosen = stayIds.map((id) => findStay(id)).filter(Boolean) as StayOption[];
  if (chosen.length === 0) return null;
  return (
    <div className="space-y-2">
      {[...chosen]
        .sort((a, b) => a.km - b.km)
        .map((stay) => (
          <div key={stay.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
              <BedDouble className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <strong className="block truncate text-xs">{stay.name}</strong>
              <p className="truncate text-[9px] text-muted-foreground">
                {stay.area} · {stay.distanceFromRoute} · {formatPrice(stay.pricePerNight)}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        ))}
    </div>
  );
}
