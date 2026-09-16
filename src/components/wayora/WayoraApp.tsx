import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Bell,
  Bike,
  Gauge,
  Pause,
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  CloudRain,
  Compass,
  Eye,
  EyeOff,
  Flag,
  FileText,
  Home,
  Info,
  LocateFixed,
  LockKeyhole,
  Luggage,
  Map,
  MapPin,
  MoreHorizontal,
  Navigation,
  PackageCheck,
  Play,
  Plus,
  Route as RouteIcon,
  Search,
  ShieldCheck,
  SignalZero,
  Sun,
  Ticket,
  Trash2,
  Umbrella,
  UserRound,
  Utensils,
  WifiOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  bookingSections,
  exploreItems,
  initialPacking,
  routeOptions,
  
  travelModes,
  type PackingGroup,
  type RouteOption,
} from "@/lib/wayora-data";
import {
  buildRoute,
  cityCatalog,
  findPlace,
  formatDuration,
  recommendedPlaces,
  routeSummary,
  type Place,
  type Waypoint,
} from "@/lib/wayora-trip";
import { RouteMap, SafetyBadge } from "@/components/wayora/RouteMap";
import { LiveNavMap } from "@/components/wayora/LiveNavMap";
import { StayDiscovery, StaySummary } from "@/components/wayora/StayDiscovery";
import { findStayByName } from "@/lib/wayora-stays";

type Screen =
  | "intro"
  | "setup"
  | "routes"
  | "recommend"
  | "plan"
  | "stays"
  | "overview"
  | "navigate"
  | "packing"
  | "bookings"
  | "auth"
  | "dashboard"
  | "offline"
  | "trips"
  | "explore"
  | "profile";

type PromptKind = "save" | "packing" | "booking" | "offline" | null;

type TripState = {
  originId: string;
  destinationId: string;
  stopIds: string[];
  selectedPlaceIds: string[];
  stayIds: string[];
  travelMode: string;
  startDate: string;
  endDate: string;
  status: "planning" | "active" | "completed";
  legIndex: number;
  legProgress: number;
  arrived: boolean;
};

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2" aria-label="WAYORA">
      <span className={cn("grid place-items-center rounded-xl bg-primary text-primary-foreground", compact ? "h-8 w-8" : "h-11 w-11")}>
        <Navigation className={compact ? "h-4 w-4" : "h-5 w-5"} fill="currentColor" />
      </span>
      <span className={cn("font-bold text-foreground", compact ? "text-base" : "text-xl")}>WAYORA</span>
    </div>
  );
}

function StatusBar({ offline = false }: { offline?: boolean }) {
  return (
    <div className="grid h-8 grid-cols-[1fr_auto] items-center px-5 text-[11px] font-semibold text-foreground" aria-hidden="true">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {offline ? <SignalZero className="h-3.5 w-3.5" /> : <span className="text-[10px]">●●●</span>}
        <span className="h-2.5 w-4 rounded-sm border border-foreground p-px"><span className="block h-full w-2.5 rounded-[1px] bg-foreground" /></span>
      </div>
    </div>
  );
}

function TopBar({ title, onBack, action, offline = false }: { title: string; onBack?: () => void; action?: React.ReactNode; offline?: boolean }) {
  return (
    <>
      <StatusBar offline={offline} />
      <header className="grid h-12 grid-cols-[44px_minmax(0,1fr)_44px] items-center px-2">
        {onBack ? (
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back" className="rounded-full">
            <ArrowLeft />
          </Button>
        ) : <span />}
        <h1 className="truncate text-center text-[15px] font-bold text-foreground">{title}</h1>
        <div className="flex justify-end">{action}</div>
      </header>
    </>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-border bg-card shadow-card", className)}>{children}</section>;
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <h2 className="min-w-0 truncate text-[13px] font-bold text-foreground">{children}</h2>
      {action}
    </div>
  );
}

function Pill({ children, tone = "purple" }: { children: React.ReactNode; tone?: "purple" | "aqua" | "peach" | "neutral" }) {
  return <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-[9px] font-bold", tone === "purple" && "bg-primary-soft text-primary", tone === "aqua" && "bg-secondary text-secondary-foreground", tone === "peach" && "bg-peach-soft text-peach", tone === "neutral" && "bg-muted text-muted-foreground")}>{children}</span>;
}

function IntroScreen({ onStart, onSignIn }: { onStart: () => void; onSignIn: () => void }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { icon: RouteIcon, title: "Plan trips easily", body: "Compare routes and shape every part of your journey in one calm space." },
    { icon: CloudRain, title: "Know what’s ahead", body: "See useful weather, safety and road insights along your route before you leave." },
    { icon: PackageCheck, title: "Pack smart", body: "Get a practical packing list tailored to your destination and weather." },
  ];
  const SlideIcon = slides[slide]!.icon;
  return (
    <div className="flex min-h-[844px] flex-col overflow-hidden bg-background">
      <StatusBar />
      <div className="flex items-center justify-between px-6 pt-4">
        <BrandMark />
        <Button variant="ghost" className="px-2 text-primary" onClick={onSignIn}>Sign In</Button>
      </div>
      <main className="flex flex-1 flex-col justify-center px-7 pb-6">
        <div className="relative mx-auto mb-10 grid h-64 w-full max-w-[320px] place-items-center overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-primary-soft" />
          <div className="absolute bottom-10 left-5 h-14 w-20 rounded-t-full bg-secondary" />
          <div className="absolute bottom-10 right-3 h-20 w-28 rounded-t-full bg-accent" />
          <div className="relative grid h-24 w-24 place-items-center rounded-[1.75rem] bg-primary-soft text-primary">
            <SlideIcon className="h-11 w-11" strokeWidth={1.7} />
          </div>
          <div className="absolute bottom-7 left-10 right-10 border-t-2 border-dashed border-primary-light" />
          <MapPin className="absolute bottom-5 right-8 h-6 w-6 text-primary" fill="currentColor" />
        </div>
        <div className="min-h-28 text-center">
          <p className="mb-2 text-xs font-semibold text-primary">Your journey, thoughtfully planned</p>
          <h1 className="text-[28px] font-bold leading-tight text-foreground">{slides[slide]!.title}</h1>
          <p className="mx-auto mt-3 max-w-[310px] text-sm leading-6 text-muted-foreground">{slides[slide]!.body}</p>
        </div>
        <div className="my-7 flex justify-center gap-2" aria-label={`Slide ${slide + 1} of 3`}>
          {slides.map((item, index) => (
            <Button key={item.title} variant="ghost" size="icon" aria-label={`Show ${item.title}`} onClick={() => setSlide(index)} className="h-5 w-5 rounded-full p-0">
              <span className={cn("block h-1.5 rounded-full transition-all", index === slide ? "w-5 bg-primary" : "w-1.5 bg-border")} />
            </Button>
          ))}
        </div>
        <Button variant="wayora" size="lg" className="w-full" onClick={slide < 2 ? () => setSlide(slide + 1) : onStart}>
          {slide < 2 ? "Next" : "Get Started"}<ArrowRight />
        </Button>
        {slide < 2 && <Button variant="ghost" className="mt-2 w-full" onClick={onStart}>Skip</Button>}
      </main>
    </div>
  );
}

function TripSetupScreen({
  trip,
  setTrip,
  onBack,
  onFind,
}: {
  trip: TripState;
  setTrip: (update: Partial<TripState>) => void;
  onBack: () => void;
  onFind: () => void;
}) {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [budget, setBudget] = useState([50]);
  const origin = findPlace(trip.originId)!;
  const destination = findPlace(trip.destinationId)!;

  const suggestions = cityCatalog
    .filter((place) => place.name.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, 5);

  const blockedReason = (place: Place) => {
    if (place.id === trip.originId) return "Already your starting point";
    if (place.id === trip.destinationId) return "Already your destination";
    if (trip.stopIds.includes(place.id)) return "Already added as a stop";
    return null;
  };

  const addStop = (place: Place) => {
    const reason = blockedReason(place);
    if (reason) {
      setNotice(`${place.name} can’t be added — ${reason.toLowerCase()}.`);
      return;
    }
    setTrip({ stopIds: [...trip.stopIds, place.id] });
    setNotice("");
    setQuery("");
  };

  return (
    <div className="min-h-[844px] bg-background">
      <TopBar title="Trip Setup" onBack={onBack} />
      <main className="space-y-4 px-4 pb-8">
        <div className="py-1">
          <p className="text-xs font-semibold text-primary">Plan your route · Solo trip</p>
          <h2 className="mt-1 text-[22px] font-bold text-foreground">Where are you going?</h2>
        </div>
        <Card className="p-4">
          <button type="button" onClick={() => setTrip({ originId: "new-delhi" })} className="mb-3 flex min-h-11 w-full items-center gap-3 rounded-xl bg-primary-soft px-3 text-left text-primary transition-colors hover:bg-accent">
            <LocateFixed className="h-4 w-4 shrink-0" /><span className="flex-1 text-xs font-semibold">Use Current Location</span><ChevronRight className="h-4 w-4" />
          </button>
          <label className="mb-1 block text-[10px] font-semibold text-muted-foreground" htmlFor="origin-select">FROM</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
            <select
              id="origin-select"
              value={trip.originId}
              onChange={(event) => setTrip({ originId: event.target.value, stopIds: trip.stopIds.filter((id) => id !== event.target.value) })}
              className="h-11 w-full appearance-none rounded-xl border border-input bg-surface-raised pl-10 pr-9 text-sm text-foreground"
            >
              {cityCatalog.filter((place) => place.id !== trip.destinationId).map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="ml-5 h-4 border-l border-dashed border-primary-light" />
          <label className="mb-1 block text-[10px] font-semibold text-muted-foreground" htmlFor="destination-select">TO</label>
          <div className="relative">
            <Navigation className="absolute left-3 top-3.5 h-4 w-4 text-primary" />
            <select
              id="destination-select"
              value={trip.destinationId}
              onChange={(event) => setTrip({ destinationId: event.target.value, stopIds: trip.stopIds.filter((id) => id !== event.target.value), selectedPlaceIds: [] })}
              className="h-11 w-full appearance-none rounded-xl border border-input bg-surface-raised pl-10 pr-9 text-sm text-foreground"
            >
              {cityCatalog.filter((place) => place.id !== trip.originId).map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-4 text-[10px] font-semibold text-muted-foreground">INTERMEDIATE STOPS</p>
          {trip.stopIds.length > 0 && (
            <div className="mt-2 space-y-2">
              {trip.stopIds.map((id, index) => {
                const stop = findPlace(id)!;
                return (
                  <div key={id} className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-2 rounded-xl bg-muted pl-3">
                    <div className="min-w-0 py-2">
                      <p className="truncate text-xs font-semibold">Stop {index + 1} · {stop.name}</p>
                      <SafetyBadge rating={stop.safetyRating} className="mt-1" />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setTrip({ stopIds: trip.stopIds.filter((item) => item !== id) })} aria-label={`Remove ${stop.name}`}><X /></Button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="relative mt-2">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(event) => { setQuery(event.target.value); setNotice(""); }} placeholder="Search a place to add as a stop" className="h-11 rounded-xl pl-10 shadow-none" aria-label="Search intermediate stop" />
          </div>
          {query.trim() !== "" && (
            <div className="mt-2 overflow-hidden rounded-xl border border-border">
              {suggestions.length === 0 && <p className="p-3 text-[10px] text-muted-foreground">No matching places.</p>}
              {suggestions.map((place) => {
                const reason = blockedReason(place);
                return (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => addStop(place)}
                    disabled={Boolean(reason)}
                    className={cn("grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-3 py-2.5 text-left last:border-0", reason ? "cursor-not-allowed bg-muted/60 opacity-70" : "hover:bg-primary-soft")}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold">{place.name}</span>
                      <span className="block truncate text-[9px] text-muted-foreground">{reason ?? `${place.region} · Safety ${place.safetyRating.toFixed(1)}/5`}</span>
                    </span>
                    {reason ? <Pill tone="neutral">Unavailable</Pill> : <Plus className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          )}
          {notice && <p className="mt-2 text-[10px] font-semibold text-peach">{notice}</p>}
        </Card>
        <Card className="p-4">
          <p className="mb-3 text-[10px] font-semibold text-muted-foreground">DATES / DURATION</p>
          <div className="grid grid-cols-2 gap-2">
            <label className="rounded-xl bg-muted p-3 text-[10px] text-muted-foreground">Start date<Input type="date" value={trip.startDate} onChange={(event) => setTrip({ startDate: event.target.value })} className="mt-1 h-7 border-0 p-0 text-xs text-foreground shadow-none" /></label>
            <label className="rounded-xl bg-muted p-3 text-[10px] text-muted-foreground">End date<Input type="date" value={trip.endDate} onChange={(event) => setTrip({ endDate: event.target.value })} className="mt-1 h-7 border-0 p-0 text-xs text-foreground shadow-none" /></label>
          </div>
          <div className="mt-2 flex h-11 items-center gap-3 rounded-xl bg-muted px-3 text-xs"><CalendarDays className="h-4 w-4 text-primary" /><span className="flex-1">4 nights · 5 days · Solo trip</span></div>
        </Card>
        <div>
          <p className="mb-2 text-[10px] font-semibold text-muted-foreground">MODE OF TRAVEL</p>
          <div className="grid grid-cols-4 gap-2">
            {travelModes.map((item) => {
              const ModeIcon = item.icon;
              const active = trip.travelMode === item.label;
              return <Button key={item.label} variant={active ? "soft" : "outline"} onClick={() => setTrip({ travelMode: item.label })} className={cn("h-[66px] min-w-0 flex-col gap-1 px-1 text-[9px]", active && "border-primary text-primary")}><ModeIcon className="h-5 w-5" />{item.label}</Button>;
            })}
          </div>
        </div>
        <Card className="p-4">
          <div className="mb-2 flex justify-between text-[10px]"><span className="text-muted-foreground">TRIP BUDGET</span><strong>₹{budget[0]}K</strong></div>
          <Slider value={budget} onValueChange={setBudget} min={10} max={100} step={5} aria-label="Trip budget" />
          <div className="mt-1 flex justify-between text-[9px] text-muted-foreground"><span>₹10K</span><span>₹100K</span></div>
        </Card>
        <Card className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 bg-primary-soft p-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><UserRound className="h-4 w-4" /></span>
          <p className="text-[10px] leading-4 text-muted-foreground">Wayora plans solo journeys. Your route will run {origin.name} → {trip.stopIds.length > 0 ? `${trip.stopIds.map((id) => findPlace(id)!.name).join(" → ")} → ` : ""}{destination.name}.</p>
        </Card>
        <Button variant="wayora" size="lg" className="w-full" onClick={onFind}>Find Routes<ArrowRight /></Button>
      </main>
    </div>
  );
}

function RouteCard({ route, selected, onSelect }: { route: RouteOption; selected: boolean; onSelect: () => void }) {
  return (
    <Card className={cn("overflow-hidden p-4 transition-colors", selected && "border-primary")}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
        <div className="min-w-0"><Pill tone={route.badge === "Cheapest" ? "aqua" : route.badge === "Fastest" ? "peach" : "purple"}>{route.badge}</Pill><h3 className="mt-2 truncate text-sm font-bold">{route.name}</h3><p className="mt-1 text-[10px] text-muted-foreground">{route.mode} · {route.departure} — {route.arrival}</p></div>
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", selected ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary")}><RouteIcon className="h-5 w-5" /></div>
      </div>
      <div className="my-4 grid grid-cols-3 divide-x divide-border rounded-xl bg-muted py-3 text-center">
        <div><strong className="block text-xs">{route.duration}</strong><span className="text-[9px] text-muted-foreground">Duration</span></div>
        <div><strong className="block text-xs">{route.distance}</strong><span className="text-[9px] text-muted-foreground">Distance</span></div>
        <div><strong className="block text-xs">{route.price}</strong><span className="text-[9px] text-muted-foreground">Estimated</span></div>
      </div>
      <div className="space-y-2 text-[10px] text-muted-foreground"><p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{route.stops}</p><p className="flex items-center gap-2"><CloudRain className="h-3.5 w-3.5 text-primary" />{route.note}</p></div>
      <Button variant={selected ? "wayora" : "outline"} className="mt-4 w-full" onClick={onSelect}>{selected ? <><Check />Selected</> : <>Select Route<ArrowRight /></>}</Button>
    </Card>
  );
}


function RouteOptionsScreen({ waypoints, onBack, selected, setSelected, onContinue }: { waypoints: Waypoint[]; onBack: () => void; selected: string; setSelected: (id: string) => void; onContinue: () => void }) {
  return (
    <div className="min-h-[844px] bg-background">
      <TopBar title="Route Options" onBack={onBack} />
      <main className="px-4 pb-8">
        <div className="mb-4">
          <p className="text-xs text-muted-foreground">{waypoints.map((point) => point.name).join(" → ")}</p>
          <h2 className="mt-1 text-xl font-bold">Choose your journey</h2>
          <p className="mt-1 text-xs text-muted-foreground">3 routes compared for weather, roads, time and cost — all passing your stops.</p>
        </div>
        <RouteMap route={waypoints} className="mb-4 h-40" showAllLabels />
        <div className="space-y-3">{routeOptions.map((route) => <RouteCard key={route.id} route={route} selected={selected === route.id} onSelect={() => setSelected(route.id)} />)}</div>
        
        <Button variant="wayora" size="lg" className="mt-4 w-full" onClick={onContinue}>See Places Along Route<ArrowRight /></Button>
      </main>
    </div>
  );
}

function categoryTone(category: Place["category"]) {
  if (category === "Food" || category === "Cafe") return "peach" as const;
  if (category === "Stay" || category === "Rest stop") return "aqua" as const;
  return "purple" as const;
}

function RecommendationsScreen({
  places,
  selectedIds,
  toggle,
  onBack,
  onContinue,
}: {
  places: Place[];
  selectedIds: string[];
  toggle: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Attraction", "Viewpoint", "Food", "Rest stop", "Stay"];
  const visible = filter === "All" ? places : places.filter((place) => place.category === filter || (filter === "Food" && place.category === "Cafe"));
  return (
    <div className="min-h-[844px] bg-background">
      <TopBar title="Along Your Route" onBack={onBack} />
      <main className="space-y-4 px-4 pb-8">
        <div>
          <p className="text-xs font-semibold text-primary">Wayora recommends · you choose</p>
          <h2 className="mt-1 text-xl font-bold">Places along your journey</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Add the spots you want to visit. Only what you select becomes part of the route.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {filters.map((item) => (
            <Button key={item} variant={filter === item ? "soft" : "outline"} onClick={() => setFilter(item)} className={cn("h-8 shrink-0 rounded-full px-3 text-[10px]", filter === item && "border-primary text-primary")}>{item}</Button>
          ))}
        </div>
        <div className="space-y-3">
          {visible.map((place) => {
            const added = selectedIds.includes(place.id);
            return (
              <Card key={place.id} className={cn("p-4", added && "border-primary")}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                  <div className="min-w-0">
                    <Pill tone={categoryTone(place.category)}>{place.category}</Pill>
                    <h3 className="mt-2 truncate text-sm font-bold">{place.name}</h3>
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{place.region}</p>
                  </div>
                  <SafetyBadge rating={place.safetyRating} />
                </div>
                <p className="mt-2 text-[10px] leading-4 text-muted-foreground">{place.description}</p>
                <div className="mt-3 grid grid-cols-3 divide-x divide-border rounded-xl bg-muted py-2.5 text-center">
                  <div><strong className="block text-[10px]">{place.distanceFromRoute}</strong><span className="text-[8px] text-muted-foreground">From route</span></div>
                  <div><strong className="block text-[10px]">{place.detourTime}</strong><span className="text-[8px] text-muted-foreground">Detour</span></div>
                  <div><strong className="block text-[10px]">{place.visitDuration}</strong><span className="text-[8px] text-muted-foreground">Visit</span></div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {place.safetyNotes.map((note) => <Pill key={note} tone="neutral">{note}</Pill>)}
                </div>
                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <span className="min-w-0 truncate text-[10px] text-muted-foreground">{place.cost} · {place.openHours}</span>
                  <Button variant={added ? "soft" : "outline"} className={cn("h-9 text-xs", added && "border-primary text-primary")} onClick={() => toggle(place.id)}>
                    {added ? <><Check />Added to Route</> : <><Plus />Add Stop</>}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        <Card className="flex gap-3 bg-peach-soft p-3"><Info className="h-4 w-4 shrink-0 text-peach" /><p className="text-[10px] leading-4 text-muted-foreground">Safety ratings are prototype estimates for demonstration, not verified real-world data.</p></Card>
        <Button variant="wayora" size="lg" className="w-full" onClick={onContinue}>Build My Route ({selectedIds.length} selected)<ArrowRight /></Button>
      </main>
    </div>
  );
}

function RouteFlow({ route, activeIndex, onRemove }: { route: Waypoint[]; activeIndex?: number; onRemove?: (id: string) => void }) {
  const { legs } = routeSummary(route);
  return (
    <Card className="p-4">
      {route.map((waypoint, index) => {
        const leg = legs[index];
        const passed = activeIndex !== undefined && index <= activeIndex;
        return (
          <div key={waypoint.id}>
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
              <span className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold", waypoint.kind === "destination" ? "bg-peach-soft text-peach" : passed ? "bg-success text-primary-foreground" : waypoint.kind === "origin" ? "bg-success text-primary-foreground" : "bg-primary-soft text-primary")}>
                {waypoint.kind === "destination" ? <Flag className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">{waypoint.name}</p>
                <p className="truncate text-[9px] text-muted-foreground">
                  {waypoint.kind === "origin" ? "Starting point" : waypoint.kind === "destination" ? "Final destination" : waypoint.kind === "stop" ? "Intermediate destination" : `${waypoint.category} · ${waypoint.visitDuration} stop`}
                </p>
                <SafetyBadge rating={waypoint.safetyRating} className="mt-1.5" />
              </div>
              {onRemove && waypoint.kind !== "origin" && waypoint.kind !== "destination" ? (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRemove(waypoint.id)} aria-label={`Remove ${waypoint.name}`}><Trash2 className="h-3.5 w-3.5" /></Button>
              ) : <span />}
            </div>
            {leg && (
              <div className="my-1 ml-3 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-l border-dashed border-primary-light pl-[19px]">
                <span className="text-[9px] font-semibold text-primary">{leg.distanceKm} km</span>
                <span className="text-[9px] text-muted-foreground">{formatDuration(leg.durationMin)} drive</span>
              </div>
            )}
          </div>
        );
      })}
    </Card>
  );
}

function RoutePlanScreen({ route, stayIds, onBack, onRemove, onStart, onOverview, onStays }: { route: Waypoint[]; stayIds: string[]; onBack: () => void; onRemove: (id: string) => void; onStart: () => void; onOverview: () => void; onStays: () => void }) {
  const summary = routeSummary(route);
  return (
    <div className="min-h-[844px] bg-background">
      <TopBar title="Your Route" onBack={onBack} />
      <main className="space-y-4 px-4 pb-8">
        <div>
          <p className="text-xs font-semibold text-primary">Route planned</p>
          <h2 className="mt-1 text-xl font-bold">{route[0]!.name} → {route[route.length - 1]!.name}</h2>
        </div>
        <RouteMap route={route} className="h-48" showAllLabels />
        <div><SectionTitle>Journey Flow</SectionTitle><RouteFlow route={route} onRemove={onRemove} /></div>
        <Card className="p-4">
          <SectionTitle>Route Summary</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Total distance", value: `${summary.totalDistance} km` },
              { label: "Total travel time", value: summary.travelTime },
              { label: "Stops", value: `${summary.stopCount}` },
              { label: "Trip duration", value: `${summary.days} day${summary.days > 1 ? "s" : ""}` },
              { label: "Selected places", value: `${summary.selectedPlaces}` },
              { label: "Travellers", value: "Solo" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-muted p-3">
                <strong className="block text-xs">{item.value}</strong>
                <span className="text-[9px] text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
        <Button variant="wayora" size="lg" className="w-full" onClick={onStays}><BedDouble />{stayIds.length > 0 ? `Stays (${stayIds.length} selected)` : "Find Stays Along Route"}</Button>
        <Button variant="outline" className="w-full" onClick={onOverview}>View trip overview<ChevronRight /></Button>
        <Button variant="ghost" className="w-full text-primary" onClick={onStart}><Play />Start Trip</Button>
      </main>
    </div>
  );
}

function StaysScreen({
  route,
  stayIds,
  toggleStay,
  setStayIds,
  onBack,
  onContinue,
}: {
  route: Waypoint[];
  stayIds: string[];
  toggleStay: (id: string) => void;
  setStayIds: (ids: string[]) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="min-h-[844px] bg-background">
      <TopBar title="Recommended Stays" onBack={onBack} />
      <main className="space-y-4 px-4 pb-8">
        <div>
          <p className="text-xs font-semibold text-primary">Itinerary finalised · stays next</p>
          <h2 className="mt-1 text-xl font-bold">Where will you stay?</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Tap any stop or stretch on your route to see nearby stays, or take Wayora’s optimal plan.
          </p>
        </div>
        <StayDiscovery route={route} stayIds={stayIds} toggleStay={toggleStay} setStayIds={setStayIds} />
        <Button variant="wayora" size="lg" className="w-full" onClick={onContinue}>
          Continue to Trip Overview<ArrowRight />
        </Button>
      </main>
    </div>
  );
}

function ActiveNavigationScreen({
  route,
  legIndex,
  legProgress,
  arrived,
  paused,
  onTogglePause,
  onSimulate,
  onContinue,
  onBack,
  onFinish,
}: {
  route: Waypoint[];
  legIndex: number;
  legProgress: number;
  arrived: boolean;
  paused: boolean;
  onTogglePause: () => void;
  onSimulate: () => void;
  onContinue: () => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  const speed = 38 + Math.round(Math.abs(Math.sin(legProgress * 9 + legIndex)) * 22);
  const summary = routeSummary(route);
  const legs = summary.legs;
  const current = legs[Math.min(legIndex, legs.length - 1)]!;
  const nextStop = current.to;
  const completedKm = Math.round(legs.slice(0, legIndex).reduce((sum, leg) => sum + leg.distanceKm, 0) + current.distanceKm * legProgress);
  const remainingMin = Math.round(
    current.durationMin * (1 - legProgress) + legs.slice(legIndex + 1).reduce((sum, leg) => sum + leg.durationMin, 0),
  );
  const percent = Math.round((completedKm / summary.totalDistance) * 100);
  const eta = (() => {
    const base = new Date();
    base.setMinutes(base.getMinutes() + Math.round(current.durationMin * (1 - legProgress)));
    return base.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  })();
  const finished = arrived && nextStop.kind === "destination";

  return (
    <div className="flex min-h-[844px] flex-col bg-background">
      <TopBar title="Active Trip" onBack={onBack} action={<Pill tone="aqua">Live</Pill>} />
      <main className="flex-1 space-y-4 px-4 pb-8">
        <Card className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-primary p-4 text-primary-foreground">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-foreground/15"><Navigation className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-wide opacity-80">Next stop</p>
            <strong className="block truncate text-base">{nextStop.name}</strong>
          </div>
          <div className="text-right">
            <strong className="block text-xs">{formatDuration(Math.round(current.durationMin * (1 - legProgress)))}</strong>
            <span className="text-[9px] opacity-80">{Math.max(1, Math.round(current.distanceKm * (1 - legProgress)))} km</span>
          </div>
        </Card>

        <div className="relative">
          <LiveNavMap route={route} legIndex={legIndex} legProgress={legProgress} paused={paused} arrived={arrived} className="h-72" />
          <div className="absolute bottom-2 right-2 grid gap-2">
            <Button variant="soft" size="icon" className="h-9 w-9 rounded-full bg-card shadow-card" aria-label="Recenter map"><LocateFixed className="h-4 w-4 text-primary" /></Button>
            {!arrived && (
              <Button variant="soft" size="icon" className="h-9 w-9 rounded-full bg-card shadow-card" onClick={onTogglePause} aria-label={paused ? "Resume navigation" : "Pause navigation"}>
                {paused ? <Play className="h-4 w-4 text-primary" /> : <Pause className="h-4 w-4 text-primary" />}
              </Button>
            )}
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[9px] font-bold text-foreground">
            <Gauge className="h-3 w-3 text-primary" />{arrived || paused ? "0" : speed} km/h
          </div>
        </div>

        {arrived && (
          <Card className="p-4">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground"><CheckCircle2 className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">You’ve arrived</p>
                <strong className="block truncate text-sm">{nextStop.name}</strong>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1">
              <SafetyBadge rating={nextStop.safetyRating} />
              {nextStop.safetyNotes.slice(0, 2).map((note) => <Pill key={note} tone="neutral">{note}</Pill>)}
            </div>
            <Button variant="wayora" className="mt-4 w-full" onClick={finished ? onFinish : onContinue}>
              {finished ? <>Finish Trip<Check /></> : <>Continue Trip<ArrowRight /></>}
            </Button>
          </Card>
        )}

        <Card className="p-4">
          <div className="flex justify-between text-[10px]"><strong>Trip progress</strong><span className="text-muted-foreground">{completedKm} / {summary.totalDistance} km</span></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary-soft"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} /></div>
          <div className="mt-3 grid grid-cols-3 divide-x divide-border text-center">
            <div><strong className="block text-xs">{percent}%</strong><span className="text-[8px] text-muted-foreground">Completed</span></div>
            <div><strong className="block text-xs">{eta}</strong><span className="text-[8px] text-muted-foreground">ETA next stop</span></div>
            <div><strong className="block text-xs">{formatDuration(remainingMin)}</strong><span className="text-[8px] text-muted-foreground">To destination</span></div>
          </div>
        </Card>

        <div><SectionTitle>Journey Flow</SectionTitle><RouteFlow route={route} activeIndex={arrived ? legIndex + 1 : legIndex} /></div>

        {!arrived && (
          <Button variant="wayora" size="lg" className="w-full" onClick={onSimulate} disabled={paused}><Play />Simulate Progress</Button>
        )}
        <p className="text-center text-[9px] text-muted-foreground">Prototype navigation — position is simulated, no live GPS is used.</p>
      </main>
    </div>
  );
}

function WeatherStrip({ route }: { route: Waypoint[] }) {
  const items = [route[0]!, route[Math.floor(route.length / 2)]!, route[route.length - 1]!];
  const temps = ["31°", "27°", "16°"];
  const notes = ["Clear", "Partly cloudy", "Light rain"];
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item, index) => {
        const Icon = index === 2 ? CloudRain : Sun;
        return (
          <div key={`${item.id}-${index}`} className="rounded-xl border border-border bg-card p-2.5">
            <p className="truncate text-[9px] font-semibold">{item.name}</p>
            <div className="mt-1 flex items-center gap-1"><Icon className={cn("h-4 w-4", index === 2 ? "text-primary" : "text-warning")} /><strong className="text-sm">{temps[index]}</strong></div>
            <p className="mt-1 truncate text-[8px] text-muted-foreground">{notes[index]}</p>
          </div>
        );
      })}
    </div>
  );
}

function TripOverviewScreen({ route, waypoints, stayIds, onBack, onPacking, onSave, onStart, onStays }: { route: RouteOption; waypoints: Waypoint[]; stayIds: string[]; onBack: () => void; onPacking: () => void; onSave: () => void; onStart: () => void; onStays: () => void }) {
  const summary = routeSummary(waypoints);
  return (
    <div className="min-h-[844px] bg-background">
      <TopBar title="Trip Overview" onBack={onBack} action={<Button variant="ghost" size="icon" aria-label="More options"><MoreHorizontal /></Button>} />
      <main className="space-y-4 px-4 pb-8">
        <Card className="p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <p className="text-[9px] text-muted-foreground">Journey</p>
              <strong className="block truncate text-sm">{waypoints[0]!.name} → {waypoints[waypoints.length - 1]!.name}</strong>
              <p className="mt-1 text-[9px] text-muted-foreground">Solo trip · {summary.stopCount} stops</p>
            </div>
            <Pill>{route.badge}</Pill>
          </div>
          <div className="mt-4 grid grid-cols-4 divide-x divide-border text-center">
            <div><strong className="block text-[11px]">{summary.totalDistance} km</strong><span className="text-[8px] text-muted-foreground">Distance</span></div>
            <div><strong className="block text-[11px]">{summary.travelTime}</strong><span className="text-[8px] text-muted-foreground">Time</span></div>
            <div><strong className="block text-[11px]">{route.price}</strong><span className="text-[8px] text-muted-foreground">Cost</span></div>
            <div><Car className="mx-auto h-4 w-4" /><span className="text-[8px] text-muted-foreground">Car</span></div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-primary-soft px-3 py-2 text-[10px] text-primary"><span className="truncate">{route.name}</span><ChevronRight className="h-3.5 w-3.5 shrink-0" /></div>
        </Card>
        <div><SectionTitle>Weather Along Your Route</SectionTitle><WeatherStrip route={waypoints} /></div>
        <div><SectionTitle>Your Route</SectionTitle><RouteMap route={waypoints} className="h-44" showAllLabels /></div>
        <div><SectionTitle>Journey Flow</SectionTitle><RouteFlow route={waypoints} /></div>
        <div>
          <SectionTitle action={<Button variant="ghost" className="h-7 px-1 text-[10px] text-primary" onClick={onStays}>{stayIds.length > 0 ? "Edit stays" : "Add stays"}<ChevronRight /></Button>}>Your Stays</SectionTitle>
          {stayIds.length > 0 ? (
            <StaySummary stayIds={stayIds} />
          ) : (
            <Card className="flex gap-3 p-3"><BedDouble className="h-4 w-4 shrink-0 text-primary" /><p className="text-[10px] leading-4 text-muted-foreground">No stays selected yet. Explore stays along your route to complete the plan.</p></Card>
          )}
        </div>
        <Card className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-primary-soft p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><ShieldCheck className="h-4 w-4" /></span><div className="min-w-0"><strong className="block text-[10px]">Route safety looks good</strong><p className="text-[8px] text-muted-foreground">Well-lit highways and medical stops near most waypoints.</p></div><Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Safety information"><Info /></Button></Card>
        <Button variant="wayora" size="lg" className="w-full" onClick={onStart}><Play />Start Trip</Button>
        <Button variant="outline" className="w-full" onClick={onPacking}>Continue to Packing<ChevronRight /></Button>
        <Button variant="ghost" className="w-full text-primary" onClick={onSave}><LockKeyhole />Save this trip</Button>
      </main>
    </div>
  );
}

function PackingScreen({ groups, setGroups, onBack, onBookings, onGate }: { groups: PackingGroup[]; setGroups: (groups: PackingGroup[]) => void; onBack: () => void; onBookings: () => void; onGate: () => void }) {
  const [expanded, setExpanded] = useState<string[]>(["Clothing", "Essentials"]);
  const [newItem, setNewItem] = useState("");
  const all = groups.flatMap((group) => group.items);
  const packed = all.filter((item) => item.packed).length;
  const toggle = (groupName: string, itemId: string) => setGroups(groups.map((group) => group.name === groupName ? { ...group, items: group.items.map((item) => item.id === itemId ? { ...item, packed: !item.packed } : item) } : group));
  const remove = (groupName: string, itemId: string) => setGroups(groups.map((group) => group.name === groupName ? { ...group, items: group.items.filter((item) => item.id !== itemId) } : group));
  const add = () => { const value = newItem.trim(); if (!value) return; setGroups(groups.map((group) => group.name === "Essentials" ? { ...group, items: [...group.items, { id: `${Date.now()}`, label: value, packed: false }] } : group)); setNewItem(""); };
  return (
    <div className="min-h-[844px] bg-background">
      <TopBar title="Packing List" onBack={onBack} action={<Button variant="ghost" className="px-2 text-xs text-primary" onClick={onGate}>Edit</Button>} />
      <main className="space-y-4 px-4 pb-8">
        <div><h2 className="text-xl font-bold">Pack smart for Manali</h2><p className="mt-1 text-xs text-muted-foreground">Based on your trip, weather & duration</p></div>
        <Card className="flex items-center gap-3 bg-primary-soft p-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-card text-primary"><CloudRain /></span><div><strong className="block text-xs">Cool & rainy</strong><span className="text-[9px] text-muted-foreground">16–22°C · Light rain expected</span></div></Card>
        <Card className="p-4"><div className="flex justify-between text-[10px]"><strong>{packed} of {all.length} items packed</strong><span className="text-muted-foreground">{Math.round(packed / all.length * 100)}% packed</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary-soft"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${packed / all.length * 100}%` }} /></div></Card>
        <div><SectionTitle>Weather-based suggestions</SectionTitle><div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">{[{ icon: Umbrella, text: "Rain jacket" }, { icon: Luggage, text: "Compact umbrella" }, { icon: Bike, text: "Waterproof shoes" }].map((item) => <Pill key={item.text} tone="neutral"><item.icon className="mr-1 h-3 w-3 text-primary" />{item.text}</Pill>)}</div></div>
        <Card className="overflow-hidden">
          {groups.map((group) => { const isOpen = expanded.includes(group.name); const count = group.items.filter((item) => item.packed).length; return <div key={group.name} className="border-b border-border last:border-0"><Button variant="ghost" onClick={() => setExpanded(isOpen ? expanded.filter((name) => name !== group.name) : [...expanded, group.name])} className="grid h-12 w-full grid-cols-[auto_minmax(0,1fr)_auto_auto] justify-start rounded-none px-3 text-left"><span>{group.icon}</span><span className="min-w-0 truncate text-xs font-semibold">{group.name}</span><span className="text-[9px] text-muted-foreground">{count} / {group.items.length}</span><ChevronDown className={cn("transition-transform", isOpen && "rotate-180")} /></Button>{isOpen && <div className="bg-surface-raised px-3 pb-2">{group.items.map((item) => <div key={item.id} className="grid min-h-10 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-t border-border"><Checkbox checked={item.packed} onCheckedChange={() => toggle(group.name, item.id)} aria-label={`Mark ${item.label} packed`} /><span className={cn("text-[11px]", item.packed && "text-muted-foreground line-through")}>{item.label}</span><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(group.name, item.id)} aria-label={`Remove ${item.label}`}><Trash2 className="h-3.5 w-3.5" /></Button></div>)}</div>}</div>; })}
        </Card>
        <div className="grid grid-cols-[minmax(0,1fr)_44px] gap-2"><Input value={newItem} onChange={(event) => setNewItem(event.target.value)} onKeyDown={(event) => event.key === "Enter" && add()} placeholder="Add a packing item" className="h-11 rounded-xl bg-card" /><Button variant="soft" size="icon" onClick={add} aria-label="Add packing item"><Plus /></Button></div>
        <Button variant="wayora" size="lg" className="w-full" onClick={onBookings}>Explore Booking Options<ArrowRight /></Button>
      </main>
    </div>
  );
}

function BookingsScreen({ onBack, onContinue, onOpenOption }: { onBack: () => void; onContinue: () => void; onOpenOption: (title: string) => void }) {
  const [category, setCategory] = useState("Transport");
  const section = bookingSections.find((item) => item.category === category) ?? bookingSections[0]!;
  const safety: Record<string, number> = { "Volvo AC Sleeper": 4.3, "Private cab": 4.5, "The Orchard Manali": 4.6, "Himalayan Hostel": 4.2, "Solang Valley day trip": 4.4, "Old Manali food walk": 4.5 };
  return (
    <div className="min-h-[844px] bg-background">
      <TopBar title="Booking Options" onBack={onBack} />
      <main className="px-4 pb-8">
        <div className="mb-4"><p className="text-xs font-semibold text-primary">Plan the details</p><h2 className="mt-1 text-xl font-bold">Complete your Manali trip</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Browse sample options that fit your route and dates.</p></div>
        <div className="mb-4 grid grid-cols-3 gap-2">{bookingSections.map((item) => { const Icon = item.icon; return <Button key={item.category} variant={category === item.category ? "soft" : "outline"} onClick={() => setCategory(item.category)} className={cn("h-16 flex-col gap-1 px-1 text-[10px]", category === item.category && "border-primary text-primary")}><Icon className="h-5 w-5" />{item.category}</Button>; })}</div>
        <div className="space-y-3">{section.options.map((item) => <Card key={item.title} className="p-4"><div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"><div className="min-w-0"><Pill tone={item.tag.includes("Free") ? "aqua" : "purple"}>{item.tag}</Pill><h3 className="mt-2 truncate text-sm font-bold">{item.title}</h3><p className="mt-1 text-[10px] text-muted-foreground">{item.meta}</p><SafetyBadge rating={safety[item.title] ?? 4.3} className="mt-2" /></div><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><section.icon className="h-5 w-5" /></span></div><div className="mt-4 flex items-center justify-between"><strong className="text-sm">{item.price}</strong><Button variant="outline" className="h-9 text-xs" onClick={() => onOpenOption(item.title)}>View option<ChevronRight /></Button></div></Card>)}</div>
        <Card className="mt-4 flex gap-3 bg-peach-soft p-3"><Info className="h-4 w-4 shrink-0 text-peach" /><p className="text-[10px] leading-4 text-muted-foreground">Demo prices are estimates. Wayora helps you discover options and does not complete a reservation.</p></Card>
        <Button variant="wayora" size="lg" className="mt-5 w-full" onClick={onContinue}>Go to Dashboard<ArrowRight /></Button>
      </main>
    </div>
  );
}

function BottomNav({ screen, navigate }: { screen: Screen; navigate: (screen: Screen) => void }) {
  const items = [{ id: "dashboard" as Screen, label: "Home", icon: Home }, { id: "trips" as Screen, label: "Trips", icon: Luggage }, { id: "explore" as Screen, label: "Explore", icon: Compass }, { id: "profile" as Screen, label: "Profile", icon: CircleUserRound }];
  return <nav className="safe-bottom sticky bottom-0 z-20 grid grid-cols-4 border-t border-border bg-card px-2 pt-2">{items.map((item) => { const Icon = item.icon; const active = item.id === screen || (screen === "offline" && item.id === "dashboard"); return <Button key={item.id} variant="ghost" onClick={() => navigate(item.id)} className={cn("h-12 flex-col gap-0.5 rounded-xl px-1 text-[9px]", active ? "bg-primary-soft text-primary" : "text-muted-foreground")}><Icon className="h-[18px] w-[18px]" fill={active ? "currentColor" : "none"} />{item.label}</Button>; })}</nav>;
}

function DashboardScreen({ navigate, openOffline, signedIn, waypoints, tripActive, onResume }: { navigate: (screen: Screen) => void; openOffline: () => void; signedIn: boolean; waypoints: Waypoint[]; tripActive: boolean; onResume: () => void }) {
  const summary = routeSummary(waypoints);
  return (
    <div className="min-h-[844px] bg-background">
      <StatusBar />
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <div className="min-w-0"><p className="text-[10px] text-muted-foreground">Good morning, {signedIn ? "Aarav" : "traveler"}</p><h1 className="truncate text-lg font-bold">{tripActive ? "Your trip is underway" : "Ready for your trip?"}</h1></div>
        <Button variant="outline" size="icon" className="rounded-full bg-card" aria-label="Notifications"><Bell /></Button>
      </header>
      <main className="space-y-4 px-4 pb-4">
        <Card className="overflow-hidden">
          <div className="bg-primary-soft p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0"><Pill tone="aqua">{tripActive ? "Active Trip" : "Current Trip"}</Pill><h2 className="mt-2 truncate text-lg font-bold">{waypoints[0]!.name} → {waypoints[waypoints.length - 1]!.name}</h2><p className="mt-1 text-[10px] text-muted-foreground">18–22 Oct · Car · Solo trip</p></div>
              <span className="text-2xl">🌦️</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-9 bg-card text-[10px]" onClick={() => navigate("plan")}><Map />Route</Button>
              <Button variant="wayora" className="h-9 text-[10px]" onClick={tripActive ? onResume : () => navigate("packing")}>{tripActive ? <><Navigation />Resume</> : <><PackageCheck />Packing</>}</Button>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-border p-3 text-center">
            <div><strong className="block text-xs">{summary.stopCount}</strong><span className="text-[8px] text-muted-foreground">Stops</span></div>
            <div><strong className="block text-xs">{summary.travelTime}</strong><span className="text-[8px] text-muted-foreground">Drive</span></div>
            <div><strong className="block text-xs">{summary.totalDistance} km</strong><span className="text-[8px] text-muted-foreground">Distance</span></div>
          </div>
        </Card>
        <div><SectionTitle>For Your Trip</SectionTitle><div className="grid grid-cols-4 gap-2">{[{ label: "Plan route", icon: RouteIcon, screen: "setup" as Screen }, { label: "Places", icon: Compass, screen: "recommend" as Screen }, { label: "Bookings", icon: Ticket, screen: "bookings" as Screen }, { label: "Offline", icon: WifiOff, screen: "offline" as Screen }].map((item) => <Button key={item.label} variant="outline" onClick={() => item.screen === "offline" ? openOffline() : navigate(item.screen)} className="h-[68px] min-w-0 flex-col gap-1 bg-card px-1 text-[8px]"><item.icon className="h-5 w-5 text-primary" />{item.label}</Button>)}</div></div>
        <div><SectionTitle action={<Button variant="ghost" className="h-7 px-1 text-[10px] text-primary" onClick={() => navigate("plan")}>View route<ChevronRight /></Button>}>Journey snapshot</SectionTitle><RouteMap route={waypoints} className="h-36" /></div>
        <div><SectionTitle>Recommended for Manali</SectionTitle><div className="grid grid-cols-2 gap-2"><Card className="p-3"><span className="text-xl">🏔️</span><strong className="mt-2 block text-xs">Solang Valley</strong><p className="text-[9px] text-muted-foreground">Adventure · 14 km</p><SafetyBadge rating={4.4} className="mt-2" /></Card><Card className="p-3"><span className="text-xl">🍜</span><strong className="mt-2 block text-xs">Local food spots</strong><p className="text-[9px] text-muted-foreground">8 places nearby</p><SafetyBadge rating={4.5} className="mt-2" /></Card></div></div>
      </main>
      <BottomNav screen="dashboard" navigate={navigate} />
    </div>
  );
}

function OfflineScreen({ navigate, waypoints }: { navigate: (screen: Screen) => void; waypoints: Waypoint[] }) {
  const summary = routeSummary(waypoints);
  return (
    <div className="min-h-[844px] bg-background">
      <StatusBar offline />
      <div className="mx-4 mt-2 flex items-center gap-3 rounded-xl bg-peach-soft p-3 text-peach"><WifiOff className="h-4 w-4 shrink-0" /><div className="flex-1"><strong className="block text-[11px]">You’re offline</strong><p className="text-[9px] opacity-80">Showing your saved Manali trip</p></div></div>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4"><div className="min-w-0"><p className="text-[10px] text-muted-foreground">Saved for offline</p><h1 className="truncate text-lg font-bold">{waypoints[0]!.name} → {waypoints[waypoints.length - 1]!.name}</h1></div><Pill tone="aqua">Available</Pill></header>
      <main className="space-y-4 px-4 pb-4">
        <RouteMap route={waypoints} className="h-40" showAllLabels />
        <div className="grid grid-cols-2 gap-2"><Card className="p-3"><RouteIcon className="h-5 w-5 text-primary" /><strong className="mt-3 block text-xs">Route details</strong><p className="mt-1 text-[9px] text-muted-foreground">{summary.totalDistance} km · {summary.travelTime}</p></Card><Card className="p-3"><PackageCheck className="h-5 w-5 text-primary" /><strong className="mt-3 block text-xs">Packing list</strong><p className="mt-1 text-[9px] text-muted-foreground">Saved for offline</p></Card></div>
        <div><SectionTitle>Essential Trip Information</SectionTitle><Card className="divide-y divide-border">{[{ icon: MapPin, title: "Important stops", detail: waypoints.slice(1, -1).map((point) => point.name).join(" · ") || "No stops added" }, { icon: FileText, title: "Booking references", detail: "2 saved confirmations" }, { icon: ShieldCheck, title: "Emergency contacts", detail: "Police 112 · Ambulance 108" }].map((item) => <div key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary"><item.icon className="h-4 w-4" /></span><div className="min-w-0"><strong className="block truncate text-xs">{item.title}</strong><p className="truncate text-[9px] text-muted-foreground">{item.detail}</p></div><ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" /></div>)}</Card></div>
        <Card className="bg-secondary p-3"><div className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-secondary-foreground" /><p className="text-[10px] leading-4 text-secondary-foreground"><strong>Last synced today at 8:42 AM.</strong><br />Saved essentials remain available without a connection.</p></div></Card>
      </main>
      <BottomNav screen="offline" navigate={navigate} />
    </div>
  );
}

function TabPage({ title, screen, navigate, children }: { title: string; screen: Screen; navigate: (screen: Screen) => void; children: React.ReactNode }) {
  return <div className="min-h-[844px] bg-background"><StatusBar /><header className="px-4 py-3"><BrandMark compact /><h1 className="mt-4 text-xl font-bold">{title}</h1></header><main className="min-h-[680px] space-y-4 px-4 pb-4">{children}</main><BottomNav screen={screen} navigate={navigate} /></div>;
}

function TripsScreen({ navigate, waypoints }: { navigate: (screen: Screen) => void; waypoints: Waypoint[] }) {
  const summary = routeSummary(waypoints);
  return (
    <TabPage title="My Trips" screen="trips" navigate={navigate}>
      <Button variant="wayora" className="mb-4 w-full" onClick={() => navigate("setup")}><Plus />Plan a new trip</Button>
      <SectionTitle>Upcoming</SectionTitle>
      <Card className="p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3"><div className="min-w-0"><Pill>In 4 days</Pill><h2 className="mt-2 truncate text-base font-bold">{waypoints[0]!.name} → {waypoints[waypoints.length - 1]!.name}</h2><p className="mt-1 text-[10px] text-muted-foreground">18–22 Oct · Solo trip · {summary.stopCount} stops</p></div><span className="text-2xl">🏔️</span></div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => navigate("plan")}>Open trip<ChevronRight /></Button>
      </Card>
      <SectionTitle>Past trips</SectionTitle>
      <Card className="p-3"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">🌊</span><div><strong className="block text-xs">Jaipur → Udaipur</strong><span className="text-[9px] text-muted-foreground">March 2026 · Completed</span></div></div></Card>
    </TabPage>
  );
}

function ExploreScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  const [query, setQuery] = useState("");
  const items = exploreItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  const safety = [4.4, 4.6, 4.5, 4.1];
  return (
    <TabPage title="Explore Manali" screen="explore" navigate={navigate}>
      <div className="relative mb-4"><Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places, food, activities" className="h-11 rounded-xl bg-card pl-10" /></div>
      <div className="grid grid-cols-2 gap-3">{items.map((item, index) => <Card key={item.title} className="p-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><item.icon className="h-5 w-5" /></span><strong className="mt-3 block text-xs">{item.title}</strong><Pill tone="aqua">{item.type}</Pill><p className="mt-2 text-[9px] text-muted-foreground">{item.detail}</p><SafetyBadge rating={safety[index % safety.length]!} className="mt-2" /></Card>)}</div>
    </TabPage>
  );
}

function ProfileScreen({ navigate, signedIn, onAuth, onOffline }: { navigate: (screen: Screen) => void; signedIn: boolean; onAuth: () => void; onOffline: () => void }) {
  return <TabPage title="Profile" screen="profile" navigate={navigate}><div className="mb-5 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-primary"><UserRound className="h-7 w-7" /></span><h2 className="mt-3 text-base font-bold">{signedIn ? "Aarav Sharma" : "Travel as a guest"}</h2><p className="mt-1 text-[10px] text-muted-foreground">{signedIn ? "aarav@example.com" : "Sign in to sync and save your plans"}</p>{!signedIn && <Button variant="wayora" className="mt-3" onClick={onAuth}>Sign In</Button>}</div><Card className="divide-y divide-border">{[{ icon: Luggage, title: "Saved trips", action: () => navigate("trips") }, { icon: WifiOff, title: "Offline access", action: onOffline }, { icon: Bell, title: "Trip notifications", action: () => undefined }, { icon: ShieldCheck, title: "Safety & help", action: () => undefined }].map((item) => <Button key={item.title} variant="ghost" onClick={item.action} className="grid h-14 w-full grid-cols-[auto_minmax(0,1fr)_auto] justify-start rounded-none px-3 text-left first:rounded-t-2xl last:rounded-b-2xl"><item.icon className="text-primary" /><span className="min-w-0 truncate text-xs">{item.title}</span><ChevronRight className="text-muted-foreground" /></Button>)}</Card></TabPage>;
}

function AuthScreen({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [visible, setVisible] = useState(false);
  const [forgot, setForgot] = useState(false);
  return <div className="min-h-[844px] bg-background"><TopBar title="Welcome to Wayora" onBack={onBack} /><main className="px-5 pb-8"><div className="py-6 text-center"><BrandMark /><h1 className="mt-7 text-2xl font-bold">{forgot ? "Reset your password" : mode === "signin" ? "Welcome back" : "Create your account"}</h1><p className="mt-2 text-xs leading-5 text-muted-foreground">{forgot ? "We’ll send a reset link to your email." : "Save trips, sync packing lists and travel with offline access."}</p></div>{forgot ? <Card className="p-4"><label className="text-[10px] font-semibold text-muted-foreground">EMAIL</label><Input type="email" placeholder="you@example.com" className="mt-2 h-11 rounded-xl" /><Button variant="wayora" className="mt-4 w-full" onClick={() => setForgot(false)}>Send reset link</Button></Card> : <><div className="mb-4 grid grid-cols-2 rounded-xl bg-muted p-1"><Button variant={mode === "signin" ? "outline" : "ghost"} onClick={() => setMode("signin")} className={cn("h-9", mode === "signin" && "bg-card text-primary")}>Sign In</Button><Button variant={mode === "signup" ? "outline" : "ghost"} onClick={() => setMode("signup")} className={cn("h-9", mode === "signup" && "bg-card text-primary")}>Sign Up</Button></div><Card className="space-y-3 p-4">{mode === "signup" && <><FieldLabel label="NAME"><Input placeholder="Your full name" className="h-11 rounded-xl" /></FieldLabel><FieldLabel label="PHONE NUMBER"><Input type="tel" placeholder="+91 98765 43210" className="h-11 rounded-xl" /></FieldLabel></>}<FieldLabel label="EMAIL"><Input type="email" placeholder="you@example.com" className="h-11 rounded-xl" /></FieldLabel><FieldLabel label="PASSWORD"><div className="relative"><Input type={visible ? "text" : "password"} placeholder="At least 8 characters" className="h-11 rounded-xl pr-11" /><Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff /> : <Eye />}</Button></div></FieldLabel>{mode === "signup" && <FieldLabel label="CONFIRM PASSWORD"><Input type={visible ? "text" : "password"} placeholder="Repeat your password" className="h-11 rounded-xl" /></FieldLabel>}{mode === "signin" && <Button variant="ghost" className="ml-auto h-8 px-0 text-[10px] text-primary" onClick={() => setForgot(true)}>Forgot password?</Button>}<Button variant="wayora" size="lg" className="w-full" onClick={onSuccess}>{mode === "signin" ? "Sign In" : "Create Account"}<ArrowRight /></Button></Card><p className="mt-4 text-center text-[9px] leading-4 text-muted-foreground">Prototype only. No account or identity information will be created.</p></>}</main></div>;
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-[10px] font-semibold text-muted-foreground">{label}</span>{children}</label>; }

function SignInPrompt({ kind, open, onOpenChange, onSignIn, onGuest }: { kind: PromptKind; open: boolean; onOpenChange: (open: boolean) => void; onSignIn: () => void; onGuest: () => void }) {
  const copy = kind === "offline" ? { title: "Take your trip offline", body: "Sign in to save your route, itinerary, bookings and emergency details for access without a connection." } : kind === "booking" ? { title: "Keep options with your trip", body: "Sign in to save booking discoveries, sync trip details and access them later." } : kind === "packing" ? { title: "Make your packing list yours", body: "Sign in to save edits, add custom items and keep your list synced." } : { title: "Save this journey", body: "Sign in to save your route, get personalized recommendations and access your trip across sessions." };
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent side="bottom" className="left-1/2 w-full max-w-[390px] -translate-x-1/2 rounded-t-[28px] border-x border-t border-border bg-card p-5"><SheetHeader className="text-left"><span className="mb-1 grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary"><LockKeyhole /></span><SheetTitle className="text-lg">{copy.title}</SheetTitle><SheetDescription className="text-xs leading-5">{copy.body}</SheetDescription></SheetHeader><div className="mt-4 space-y-2"><div className="grid grid-cols-2 gap-2 text-[9px] text-muted-foreground"><span className="rounded-lg bg-muted p-2">✓ Save & sync plans</span><span className="rounded-lg bg-muted p-2">✓ Offline essentials</span></div><Button variant="wayora" className="w-full" onClick={onSignIn}>Sign In<ArrowRight /></Button><Button variant="ghost" className="w-full" onClick={onGuest}>Continue as Guest</Button></div></SheetContent></Sheet>;
}

function BookingDetail({ title, open, onOpenChange, onSave }: { title: string; open: boolean; onOpenChange: (open: boolean) => void; onSave: () => void }) {
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent side="bottom" className="left-1/2 w-full max-w-[390px] -translate-x-1/2 rounded-t-[28px] border-x border-t border-border bg-card p-5"><SheetHeader className="text-left"><Pill>Sample option</Pill><SheetTitle>{title}</SheetTitle><SheetDescription>Availability and pricing are simulated for this Wayora prototype.</SheetDescription></SheetHeader><Card className="mt-4 p-3"><div className="flex justify-between text-xs"><span className="text-muted-foreground">Trip dates</span><strong>18–22 Oct</strong></div><div className="mt-2 flex justify-between text-xs"><span className="text-muted-foreground">Traveller</span><strong>Solo</strong></div></Card><Button variant="wayora" className="mt-4 w-full" onClick={onSave}>Save option to trip</Button><Button variant="ghost" className="mt-2 w-full" onClick={() => onOpenChange(false)}>Close</Button></SheetContent></Sheet>;
}

export function WayoraApp() {
  const [screen, setScreen] = useState<Screen>("intro");
  const viewportRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<Screen[]>([]);
  const [selectedRoute, setSelectedRoute] = useState("scenic");
  const [packing, setPacking] = useState(initialPacking);
  const [prompt, setPrompt] = useState<PromptKind>(null);
  const [authReturn, setAuthReturn] = useState<Screen>("dashboard");
  const [signedIn, setSignedIn] = useState(false);
  const [bookingDetail, setBookingDetail] = useState("");
  const [paused, setPaused] = useState(false);
  const [trip, setTripState] = useState<TripState>({
    originId: "new-delhi",
    destinationId: "manali",
    stopIds: ["chandigarh"],
    selectedPlaceIds: [],
    stayIds: [],
    travelMode: "Car / Bike",
    startDate: "2026-10-18",
    endDate: "2026-10-22",
    status: "planning",
    legIndex: 0,
    legProgress: 0,
    arrived: false,
  });
  const setTrip = (update: Partial<TripState>) => setTripState((current) => ({ ...current, ...update }));

  const route = useMemo(() => routeOptions.find((item) => item.id === selectedRoute) ?? routeOptions[0]!, [selectedRoute]);
  const waypoints = useMemo(
    () => buildRoute(trip.originId, trip.destinationId, trip.stopIds, trip.selectedPlaceIds),
    [trip.originId, trip.destinationId, trip.stopIds, trip.selectedPlaceIds],
  );
  const corridorPlaces = useMemo(() => {
    const origin = findPlace(trip.originId)!;
    const destination = findPlace(trip.destinationId)!;
    const low = Math.min(origin.km, destination.km);
    const high = Math.max(origin.km, destination.km);
    return recommendedPlaces.filter((place) => place.km > low && place.km < high);
  }, [trip.originId, trip.destinationId]);

  useEffect(() => {
    if (viewportRef.current) viewportRef.current.scrollTop = 0;
  }, [screen]);

  const go = (next: Screen) => { setHistory((items) => [...items, screen]); setScreen(next); };
  const back = () => { const previous = history[history.length - 1] ?? "dashboard"; setHistory((items) => items.slice(0, -1)); setScreen(previous); };
  const tabNavigate = (next: Screen) => { setHistory([]); setScreen(next); };
  const requireSignIn = (kind: PromptKind, returnTo: Screen = screen) => { if (signedIn) { if (kind === "offline") go("offline"); return; } setAuthReturn(returnTo); setPrompt(kind); };
  const openAuth = () => { setPrompt(null); go("auth"); };
  const authSuccess = () => { setSignedIn(true); setScreen(authReturn === "offline" ? "offline" : "dashboard"); setHistory([]); };

  const togglePlace = (id: string) => {
    const selected = trip.selectedPlaceIds.includes(id);
    const place = findPlace(id);
    const stayId = place?.category === "Stay" ? findStayByName(place.name)?.id : undefined;
    setTrip({
      selectedPlaceIds: selected ? trip.selectedPlaceIds.filter((item) => item !== id) : [...trip.selectedPlaceIds, id],
      ...(stayId
        ? { stayIds: selected ? trip.stayIds.filter((item) => item !== stayId) : [...trip.stayIds, stayId] }
        : {}),
    });
  };
  const removeWaypoint = (id: string) =>
    setTrip({ stopIds: trip.stopIds.filter((item) => item !== id), selectedPlaceIds: trip.selectedPlaceIds.filter((item) => item !== id) });
  const toggleStay = (id: string) =>
    setTrip({ stayIds: trip.stayIds.includes(id) ? trip.stayIds.filter((item) => item !== id) : [...trip.stayIds, id] });
  const setStayIds = (ids: string[]) => setTrip({ stayIds: ids });

  const startTrip = () => { setPaused(false); setTrip({ status: "active", legIndex: 0, legProgress: 0, arrived: false }); go("navigate"); };
  const simulate = () => {
    const next = Math.min(1, trip.legProgress + 0.34);
    if (next >= 1) setTrip({ legProgress: 1, arrived: true });
    else setTrip({ legProgress: next });
  };
  const continueTrip = () => {
    const legCount = waypoints.length - 1;
    if (trip.legIndex + 1 < legCount) setTrip({ legIndex: trip.legIndex + 1, legProgress: 0, arrived: false });
    else setTrip({ status: "completed", arrived: true });
  };
  const finishTrip = () => { setTrip({ status: "completed" }); tabNavigate("dashboard"); };

  let content: React.ReactNode;
  switch (screen) {
    case "intro": content = <IntroScreen onStart={() => go("setup")} onSignIn={() => { setAuthReturn("dashboard"); go("auth"); }} />; break;
    case "setup": content = <TripSetupScreen trip={trip} setTrip={setTrip} onBack={back} onFind={() => go("routes")} />; break;
    case "routes": content = <RouteOptionsScreen waypoints={waypoints} onBack={back} selected={selectedRoute} setSelected={setSelectedRoute} onContinue={() => go("recommend")} />; break;
    case "recommend": content = <RecommendationsScreen places={corridorPlaces} selectedIds={trip.selectedPlaceIds} toggle={togglePlace} onBack={back} onContinue={() => go("plan")} />; break;
    case "plan": content = <RoutePlanScreen route={waypoints} stayIds={trip.stayIds} onBack={back} onRemove={removeWaypoint} onStart={startTrip} onOverview={() => go("overview")} onStays={() => go("stays")} />; break;
    case "stays": content = <StaysScreen route={waypoints} stayIds={trip.stayIds} toggleStay={toggleStay} setStayIds={setStayIds} onBack={back} onContinue={() => go("overview")} />; break;
    case "overview": content = <TripOverviewScreen route={route} waypoints={waypoints} stayIds={trip.stayIds} onBack={back} onPacking={() => go("packing")} onSave={() => requireSignIn("save")} onStart={startTrip} onStays={() => go("stays")} />; break;
    case "navigate": content = <ActiveNavigationScreen route={waypoints} legIndex={trip.legIndex} legProgress={trip.legProgress} arrived={trip.arrived} paused={paused} onTogglePause={() => setPaused((value) => !value)} onSimulate={simulate} onContinue={continueTrip} onBack={back} onFinish={finishTrip} />; break;
    case "packing": content = <PackingScreen groups={packing} setGroups={setPacking} onBack={back} onBookings={() => go("bookings")} onGate={() => requireSignIn("packing")} />; break;
    case "bookings": content = <BookingsScreen onBack={back} onContinue={() => go("dashboard")} onOpenOption={setBookingDetail} />; break;
    case "auth": content = <AuthScreen onBack={back} onSuccess={authSuccess} />; break;
    case "dashboard": content = <DashboardScreen navigate={go} signedIn={signedIn} waypoints={waypoints} tripActive={trip.status === "active"} onResume={() => go("navigate")} openOffline={() => requireSignIn("offline", "offline")} />; break;
    case "offline": content = <OfflineScreen navigate={tabNavigate} waypoints={waypoints} />; break;
    case "trips": content = <TripsScreen navigate={tabNavigate} waypoints={waypoints} />; break;
    case "explore": content = <ExploreScreen navigate={tabNavigate} />; break;
    case "profile": content = <ProfileScreen navigate={tabNavigate} signedIn={signedIn} onAuth={() => { setAuthReturn("profile"); go("auth"); }} onOffline={() => requireSignIn("offline", "offline")} />; break;
  }
  return (
    <div className="app-stage bg-muted">
      <div ref={viewportRef} className="phone-shell app-viewport relative mx-auto overflow-x-hidden bg-background sm:rounded-[34px] sm:border sm:border-border">
        {content}
        <SignInPrompt kind={prompt} open={prompt !== null} onOpenChange={(open) => !open && setPrompt(null)} onSignIn={openAuth} onGuest={() => setPrompt(null)} />
        <BookingDetail title={bookingDetail} open={Boolean(bookingDetail)} onOpenChange={(open) => !open && setBookingDetail("")} onSave={() => { setBookingDetail(""); requireSignIn("booking"); }} />
        {screen !== "intro" && <div className="pointer-events-none sticky bottom-1 z-40 mx-auto h-1 w-28 rounded-full bg-foreground/80 sm:hidden" />}
      </div>
      <div className="fixed bottom-4 right-4 hidden rounded-full bg-card px-3 py-2 text-[10px] text-muted-foreground shadow-card lg:block">WAYORA · Mobile prototype</div>
    </div>
  );
}
