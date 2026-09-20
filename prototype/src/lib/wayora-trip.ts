/**
 * Wayora prototype trip model.
 * Mock data only — structured so real map / GPS / recommendation APIs can replace it later.
 */

export type Coords = { x: number; y: number };

export type PlaceCategory =
  | "City"
  | "Attraction"
  | "Viewpoint"
  | "Food"
  | "Cafe"
  | "Rest stop"
  | "Stay";

export type Place = {
  id: string;
  name: string;
  region: string;
  category: PlaceCategory;
  /** Distance travelled from the origin along the corridor, in km. */
  km: number;
  location: Coords;
  distanceFromRoute: string;
  detourTime: string;
  visitDuration: string;
  safetyRating: number;
  safetyNotes: string[];
  description: string;
  cost?: string;
  openHours?: string;
};

export type WaypointKind = "origin" | "stop" | "place" | "destination";

export type Waypoint = Place & { kind: WaypointKind };

export type RouteLeg = {
  from: Waypoint;
  to: Waypoint;
  distanceKm: number;
  durationMin: number;
};

export type TripStatus = "planning" | "active" | "arrived" | "completed";

const AVG_SPEED_KMH = 52;

function coordsFor(km: number, wiggle = 0): Coords {
  const t = Math.min(1, Math.max(0, km / 540));
  return {
    x: 0.1 + t * 0.8,
    y: 0.8 - t * 0.58 + wiggle,
  };
}

function city(
  id: string,
  name: string,
  region: string,
  km: number,
  safetyRating: number,
  safetyNotes: string[],
  description: string,
  wiggle = 0,
): Place {
  return {
    id,
    name,
    region,
    category: "City",
    km,
    location: coordsFor(km, wiggle),
    distanceFromRoute: "On route",
    detourTime: "No detour",
    visitDuration: "1 hr",
    safetyRating,
    safetyNotes,
    description,
  };
}

/** Cities that can be used as origin, destination or intermediate stops. */
export const cityCatalog: Place[] = [
  city("new-delhi", "New Delhi", "Delhi", 0, 4.3, ["High visitor activity", "Well-lit area"], "Capital city and the start of the Himalayan corridor."),
  city("sonipat", "Sonipat", "Haryana", 45, 4.1, ["Highway services nearby"], "First highway town on NH-44 with fuel and food.", 0.03),
  city("karnal", "Karnal", "Haryana", 125, 4.2, ["Well-lit area", "24x7 highway plaza"], "Popular breakfast halt with large highway plazas.", -0.03),
  city("ambala", "Ambala", "Haryana", 200, 4.0, ["Police assistance point"], "Junction town before the Chandigarh bypass.", 0.02),
  city("chandigarh", "Chandigarh", "Punjab", 250, 4.6, ["Well-lit area", "Popular with solo travellers", "High visitor activity"], "Planned city and the natural mid-point of the journey.", -0.02),
  city("bilaspur", "Bilaspur", "Himachal Pradesh", 360, 4.2, ["Open during daytime"], "Lake-side town where the hill section begins.", 0.03),
  city("mandi", "Mandi", "Himachal Pradesh", 430, 4.3, ["Busy market area", "Medical help nearby"], "Temple town and last major service centre before Kullu.", -0.02),
  city("kullu", "Kullu", "Himachal Pradesh", 500, 4.4, ["High visitor activity"], "Riverside valley town known for its markets.", 0.02),
  city("manali", "Manali", "Himachal Pradesh", 540, 4.5, ["Popular with solo travellers", "Well-lit area"], "Mountain destination surrounded by Himalayan trails."),
  city("shimla", "Shimla", "Himachal Pradesh", 330, 4.4, ["High visitor activity"], "Hill station reachable via an alternate hill route.", 0.06),
];

/** Places Wayora recommends along the planned corridor. */
export const recommendedPlaces: Place[] = [
  {
    id: "murthal",
    name: "Murthal Dhabas",
    region: "Haryana",
    category: "Food",
    km: 50,
    location: coordsFor(50, 0.05),
    distanceFromRoute: "0.4 km from route",
    detourTime: "4 min detour",
    visitDuration: "40 min",
    safetyRating: 4.5,
    safetyNotes: ["Open 24 hours", "High visitor activity"],
    description: "Legendary parathas and chai at the classic first stop out of Delhi.",
    cost: "₹250 approx",
    openHours: "Open 24 hours",
  },
  {
    id: "karnal-lake",
    name: "Karnal Lake Resort",
    region: "Haryana",
    category: "Rest stop",
    km: 128,
    location: coordsFor(128, -0.06),
    distanceFromRoute: "1.2 km from route",
    detourTime: "6 min detour",
    visitDuration: "30 min",
    safetyRating: 4.3,
    safetyNotes: ["Well-lit area", "Staffed rest area"],
    description: "Quiet lakeside rest stop with clean facilities and parking.",
    cost: "₹120 entry",
    openHours: "7:00 AM – 9:00 PM",
  },
  {
    id: "pinjore",
    name: "Pinjore Gardens",
    region: "Haryana",
    category: "Attraction",
    km: 245,
    location: coordsFor(245, 0.06),
    distanceFromRoute: "2.4 km from route",
    detourTime: "8 min detour",
    visitDuration: "45 min",
    safetyRating: 4.6,
    safetyNotes: ["Popular with solo travellers", "Open during daytime"],
    description: "Terraced Mughal garden with fountains, a calm mid-journey break.",
    cost: "₹80 entry",
    openHours: "7:00 AM – 8:00 PM",
  },
  {
    id: "sukhna",
    name: "Sukhna Lake",
    region: "Chandigarh",
    category: "Viewpoint",
    km: 258,
    location: coordsFor(258, -0.07),
    distanceFromRoute: "3.1 km from route",
    detourTime: "11 min detour",
    visitDuration: "35 min",
    safetyRating: 4.7,
    safetyNotes: ["Well-lit promenade", "High visitor activity"],
    description: "Lakeside promenade that works well for an early-evening walk.",
    cost: "Free",
    openHours: "5:00 AM – 9:00 PM",
  },
  {
    id: "timber-trail",
    name: "Timber Trail Viewpoint",
    region: "Parwanoo",
    category: "Viewpoint",
    km: 285,
    location: coordsFor(285, 0.055),
    distanceFromRoute: "1.8 km from route",
    detourTime: "7 min detour",
    visitDuration: "30 min",
    safetyRating: 4.2,
    safetyNotes: ["Open during daytime", "Staffed viewpoint"],
    description: "First real Himalayan view of the drive, with a cable-car lookout.",
    cost: "₹350 cable car",
    openHours: "9:00 AM – 6:00 PM",
  },
  {
    id: "sundernagar",
    name: "Sundernagar Lake",
    region: "Himachal Pradesh",
    category: "Viewpoint",
    km: 405,
    location: coordsFor(405, -0.055),
    distanceFromRoute: "1.1 km from route",
    detourTime: "5 min detour",
    visitDuration: "25 min",
    safetyRating: 4.4,
    safetyNotes: ["Open during daytime", "Quiet but visible from road"],
    description: "Still green water ringed by pine, a short stretch-your-legs stop.",
    cost: "Free",
    openHours: "6:00 AM – 7:00 PM",
  },
  {
    id: "pandoh",
    name: "Pandoh Dam Viewpoint",
    region: "Mandi",
    category: "Viewpoint",
    km: 455,
    location: coordsFor(455, 0.05),
    distanceFromRoute: "0.6 km from route",
    detourTime: "3 min detour",
    visitDuration: "20 min",
    safetyRating: 4.1,
    safetyNotes: ["Open during daytime", "Guarded viewpoint"],
    description: "Beas river gorge view right beside the highway.",
    cost: "Free",
    openHours: "8:00 AM – 6:00 PM",
  },
  {
    id: "kullu-cafe",
    name: "Riverside Café, Kullu",
    region: "Kullu",
    category: "Cafe",
    km: 498,
    location: coordsFor(498, -0.05),
    distanceFromRoute: "1.5 km from route",
    detourTime: "6 min detour",
    visitDuration: "45 min",
    safetyRating: 4.5,
    safetyNotes: ["Popular with solo travellers", "Well-lit area"],
    description: "Warm café on the Beas with local trout and filter coffee.",
    cost: "₹450 approx",
    openHours: "8:00 AM – 10:00 PM",
  },
  {
    id: "naggar",
    name: "Naggar Castle",
    region: "Kullu Valley",
    category: "Attraction",
    km: 518,
    location: coordsFor(518, 0.045),
    distanceFromRoute: "4.2 km from route",
    detourTime: "14 min detour",
    visitDuration: "1 hr",
    safetyRating: 4.4,
    safetyNotes: ["High visitor activity", "Open during daytime"],
    description: "Wood-and-stone heritage castle looking over the valley.",
    cost: "₹150 entry",
    openHours: "9:00 AM – 6:00 PM",
  },
  {
    id: "old-manali-stay",
    name: "The Orchard, Old Manali",
    region: "Manali",
    category: "Stay",
    km: 538,
    location: coordsFor(538, -0.045),
    distanceFromRoute: "2.0 km from route",
    detourTime: "8 min detour",
    visitDuration: "Overnight",
    safetyRating: 4.6,
    safetyNotes: ["Popular with solo travellers", "24x7 reception"],
    description: "Quiet orchard stay a short walk from the Old Manali lanes.",
    cost: "from ₹3,200 / night",
    openHours: "Check-in 1:00 PM",
  },
];

export function findPlace(id: string): Place | undefined {
  return [...cityCatalog, ...recommendedPlaces].find((place) => place.id === id);
}

export function buildRoute(
  originId: string,
  destinationId: string,
  stopIds: string[],
  placeIds: string[],
): Waypoint[] {
  const origin = findPlace(originId) ?? cityCatalog[0]!;
  const destination = findPlace(destinationId) ?? cityCatalog[cityCatalog.length - 1]!;
  const middle: Waypoint[] = [
    ...stopIds.map((id) => findPlace(id)).filter(Boolean).map((place) => ({ ...(place as Place), kind: "stop" as const })),
    ...placeIds.map((id) => findPlace(id)).filter(Boolean).map((place) => ({ ...(place as Place), kind: "place" as const })),
  ].sort((a, b) => a.km - b.km);

  return [
    { ...origin, kind: "origin" as const },
    ...middle,
    { ...destination, kind: "destination" as const },
  ];
}

export function routeLegs(route: Waypoint[]): RouteLeg[] {
  return route.slice(1).map((to, index) => {
    const from = route[index]!;
    const distanceKm = Math.max(5, Math.round(Math.abs(to.km - from.km)));
    return {
      from,
      to,
      distanceKm,
      durationMin: Math.round((distanceKm / AVG_SPEED_KMH) * 60),
    };
  });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) return `${mins} min`;
  return `${hours} hr ${mins.toString().padStart(2, "0")} min`;
}

export function routeSummary(route: Waypoint[]) {
  const legs = routeLegs(route);
  const totalDistance = legs.reduce((sum, leg) => sum + leg.distanceKm, 0);
  const travelMinutes = legs.reduce((sum, leg) => sum + leg.durationMin, 0);
  const stopCount = route.length - 2;
  const selectedPlaces = route.filter((point) => point.kind === "place").length;
  return {
    legs,
    totalDistance,
    travelMinutes,
    travelTime: formatDuration(travelMinutes),
    stopCount,
    selectedPlaces,
    days: Math.max(1, Math.ceil((travelMinutes + stopCount * 45) / (9 * 60))),
  };
}

/** Interpolated map position for the simulated traveller. */
export function positionOnRoute(route: Waypoint[], legIndex: number, legProgress: number): Coords {
  const from = route[Math.min(legIndex, route.length - 1)]!;
  const to = route[Math.min(legIndex + 1, route.length - 1)]!;
  return {
    x: from.location.x + (to.location.x - from.location.x) * legProgress,
    y: from.location.y + (to.location.y - from.location.y) * legProgress,
  };
}

export function etaLabel(minutesFromNow: number): string {
  const base = new Date();
  base.setHours(9, 0, 0, 0);
  base.setMinutes(base.getMinutes() + minutesFromNow);
  return base.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
