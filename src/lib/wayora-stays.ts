/**
 * Wayora dynamic stays model.
 * Mock data only — stays are anchored to a km position along the corridor so
 * they can be matched to whichever route/stops the traveller actually picked.
 */

import { routeSummary, type Waypoint } from "@/lib/wayora-trip";

export type StayOption = {
  id: string;
  name: string;
  /** Position along the corridor, in km from origin. */
  km: number;
  area: string;
  type: "Hotel" | "Homestay" | "Hostel" | "Resort" | "Guest house";
  /** Detour distance from the planned route. */
  distanceFromRoute: string;
  detourMin: number;
  pricePerNight: number;
  rating: number;
  safetyRating: number;
  safetyNotes: string[];
  amenities: string[];
  note: string;
};

export type StayArea = {
  id: string;
  /** Waypoint index for a stop area, or leg index for a stretch. */
  kind: "stop" | "stretch";
  index: number;
  title: string;
  subtitle: string;
  km: number;
};

export const stayPool: StayOption[] = [
  {
    id: "stay-sonipat-highway",
    name: "NH-44 Highway Rooms",
    km: 46,
    area: "Sonipat",
    type: "Hotel",
    distanceFromRoute: "0.3 km from route",
    detourMin: 2,
    pricePerNight: 1450,
    rating: 3.9,
    safetyRating: 4.0,
    safetyNotes: ["24x7 reception", "Lit parking"],
    amenities: ["Free parking", "Breakfast", "Wi-Fi"],
    note: "Basic but quick halt if you leave Delhi very late.",
  },
  {
    id: "stay-murthal-court",
    name: "Dhaba Court Inn",
    km: 52,
    area: "Murthal",
    type: "Guest house",
    distanceFromRoute: "0.6 km from route",
    detourMin: 3,
    pricePerNight: 1200,
    rating: 3.7,
    safetyRating: 3.9,
    safetyNotes: ["Busy roadside area"],
    amenities: ["Food 24x7", "Parking"],
    note: "Cheapest option on the plains stretch, right by the dhabas.",
  },
  {
    id: "stay-karnal-grand",
    name: "Highway Grand, Karnal",
    km: 125,
    area: "Karnal",
    type: "Hotel",
    distanceFromRoute: "1.1 km from route",
    detourMin: 5,
    pricePerNight: 2100,
    rating: 4.2,
    safetyRating: 4.3,
    safetyNotes: ["Well-lit area", "24x7 highway plaza"],
    amenities: ["Restaurant", "Free parking", "Wi-Fi", "Room service"],
    note: "Comfortable first-night halt with a short second-day drive.",
  },
  {
    id: "stay-karnal-lakeside",
    name: "Lakeside Retreat",
    km: 130,
    area: "Karnal",
    type: "Resort",
    distanceFromRoute: "2.4 km from route",
    detourMin: 8,
    pricePerNight: 3300,
    rating: 4.5,
    safetyRating: 4.5,
    safetyNotes: ["Gated property", "Security on site"],
    amenities: ["Pool", "Restaurant", "Garden", "Wi-Fi"],
    note: "Quiet resort by the lake if you want a slower start.",
  },
  {
    id: "stay-ambala-junction",
    name: "Junction Boutique Stay",
    km: 202,
    area: "Ambala",
    type: "Hotel",
    distanceFromRoute: "0.9 km from route",
    detourMin: 4,
    pricePerNight: 1850,
    rating: 4.0,
    safetyRating: 4.1,
    safetyNotes: ["Police assistance point nearby"],
    amenities: ["Breakfast", "Parking", "Wi-Fi"],
    note: "Handy if traffic slows you before the Chandigarh bypass.",
  },
  {
    id: "stay-chandigarh-17",
    name: "Sector 17 Boutique Stay",
    km: 250,
    area: "Chandigarh",
    type: "Hotel",
    distanceFromRoute: "On route",
    detourMin: 0,
    pricePerNight: 3400,
    rating: 4.6,
    safetyRating: 4.7,
    safetyNotes: ["Well-lit streets", "Popular with solo travellers"],
    amenities: ["Breakfast", "Gym", "Wi-Fi", "Late check-out"],
    note: "The natural halfway halt, with food options open late.",
  },
  {
    id: "stay-chandigarh-hostel",
    name: "Sukhna Backpackers",
    km: 256,
    area: "Chandigarh",
    type: "Hostel",
    distanceFromRoute: "3.0 km from route",
    detourMin: 10,
    pricePerNight: 900,
    rating: 4.3,
    safetyRating: 4.4,
    safetyNotes: ["Female dorms", "Staffed 24x7"],
    amenities: ["Common kitchen", "Lockers", "Wi-Fi"],
    note: "Social, budget-friendly and close to Sukhna Lake.",
  },
  {
    id: "stay-parwanoo-timber",
    name: "Timber Trail Hillside",
    km: 286,
    area: "Parwanoo",
    type: "Resort",
    distanceFromRoute: "1.8 km from route",
    detourMin: 7,
    pricePerNight: 4200,
    rating: 4.4,
    safetyRating: 4.2,
    safetyNotes: ["Gated property", "Daytime cable car"],
    amenities: ["Valley views", "Restaurant", "Cable car"],
    note: "First real Himalayan views, good for a scenic overnight.",
  },
  {
    id: "stay-bilaspur-lakeview",
    name: "Lakeview Rooms, Bilaspur",
    km: 360,
    area: "Bilaspur",
    type: "Guest house",
    distanceFromRoute: "0.8 km from route",
    detourMin: 3,
    pricePerNight: 1900,
    rating: 4.1,
    safetyRating: 4.2,
    safetyNotes: ["Quiet area", "Owner on site"],
    amenities: ["Lake view", "Home food", "Parking"],
    note: "Breaks the hill section before the ghats begin.",
  },
  {
    id: "stay-sundernagar-pine",
    name: "Pine Bend Homestay",
    km: 404,
    area: "Sundernagar",
    type: "Homestay",
    distanceFromRoute: "1.1 km from route",
    detourMin: 5,
    pricePerNight: 1600,
    rating: 4.4,
    safetyRating: 4.3,
    safetyNotes: ["Family run", "Visible from road"],
    amenities: ["Home cooked meals", "Garden", "Wi-Fi"],
    note: "Small family homestay beside the lake, very calm.",
  },
  {
    id: "stay-mandi-riverside",
    name: "Riverside Inn, Mandi",
    km: 430,
    area: "Mandi",
    type: "Hotel",
    distanceFromRoute: "1.4 km from route",
    detourMin: 6,
    pricePerNight: 2450,
    rating: 4.4,
    safetyRating: 4.3,
    safetyNotes: ["Medical help nearby", "Busy market area"],
    amenities: ["Restaurant", "River view", "Parking", "Wi-Fi"],
    note: "Last big service town — useful if weather slows the drive.",
  },
  {
    id: "stay-pandoh-gorge",
    name: "Gorge View Lodge",
    km: 456,
    area: "Pandoh",
    type: "Guest house",
    distanceFromRoute: "0.5 km from route",
    detourMin: 2,
    pricePerNight: 1750,
    rating: 4.0,
    safetyRating: 4.0,
    safetyNotes: ["Roadside property", "Daytime access best"],
    amenities: ["Balcony views", "Tea house", "Parking"],
    note: "Right above the Beas gorge, simple rooms with big views.",
  },
  {
    id: "stay-kullu-beas",
    name: "Beas Valley Lodge, Kullu",
    km: 500,
    area: "Kullu",
    type: "Resort",
    distanceFromRoute: "1.2 km from route",
    detourMin: 4,
    pricePerNight: 2800,
    rating: 4.3,
    safetyRating: 4.4,
    safetyNotes: ["High visitor activity", "Security on site"],
    amenities: ["River deck", "Restaurant", "Bonfire", "Wi-Fi"],
    note: "Slower final morning into Manali with a riverside evening.",
  },
  {
    id: "stay-naggar-castleview",
    name: "Castle View Homestay",
    km: 518,
    area: "Naggar",
    type: "Homestay",
    distanceFromRoute: "4.0 km from route",
    detourMin: 14,
    pricePerNight: 2200,
    rating: 4.6,
    safetyRating: 4.4,
    safetyNotes: ["Quiet village lane", "Hosts on site"],
    amenities: ["Orchard", "Home meals", "Heater"],
    note: "Heritage-village stay above the valley, worth the small detour.",
  },
  {
    id: "stay-manali-orchard",
    name: "The Orchard, Old Manali",
    km: 538,
    area: "Manali",
    type: "Resort",
    distanceFromRoute: "2.0 km from route",
    detourMin: 8,
    pricePerNight: 3200,
    rating: 4.7,
    safetyRating: 4.6,
    safetyNotes: ["Popular with solo travellers", "24x7 reception"],
    amenities: ["Orchard garden", "Café", "Heater", "Wi-Fi"],
    note: "Quiet orchard stay a short walk from the Old Manali lanes.",
  },
  {
    id: "stay-manali-mall",
    name: "Himalayan Hostel, Mall Road",
    km: 541,
    area: "Manali",
    type: "Hostel",
    distanceFromRoute: "0.4 km from route",
    detourMin: 2,
    pricePerNight: 980,
    rating: 4.5,
    safetyRating: 4.4,
    safetyNotes: ["Female dorms", "Staffed 24x7", "Well-lit area"],
    amenities: ["Common room", "Lockers", "Café", "Wi-Fi"],
    note: "Central, cheap and social — steps from Mall Road.",
  },
];

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function findStay(id: string): StayOption | undefined {
  return stayPool.find((stay) => stay.id === id);
}

/** Tappable areas along the selected route: each waypoint plus each stretch between them. */
export function stayAreasForRoute(route: Waypoint[]): StayArea[] {
  const areas: StayArea[] = [];
  route.forEach((waypoint, index) => {
    areas.push({
      id: `stop-${waypoint.id}`,
      kind: "stop",
      index,
      title: waypoint.name,
      subtitle:
        waypoint.kind === "origin"
          ? "Starting point"
          : waypoint.kind === "destination"
            ? "Final destination"
            : `${waypoint.category} · ${waypoint.km} km in`,
      km: waypoint.km,
    });
    const next = route[index + 1];
    if (next) {
      areas.push({
        id: `stretch-${waypoint.id}-${next.id}`,
        kind: "stretch",
        index,
        title: `${waypoint.name} → ${next.name}`,
        subtitle: "Along this stretch",
        km: (waypoint.km + next.km) / 2,
      });
    }
  });
  return areas;
}

/** Stays that sit close to an area of the selected route. */
export function staysForArea(area: StayArea, route: Waypoint[]): StayOption[] {
  if (area.kind === "stop") {
    return stayPool
      .filter((stay) => Math.abs(stay.km - area.km) <= 30)
      .sort((a, b) => Math.abs(a.km - area.km) - Math.abs(b.km - area.km));
  }
  const from = route[area.index]!;
  const to = route[area.index + 1]!;
  const low = Math.min(from.km, to.km);
  const high = Math.max(from.km, to.km);
  return stayPool
    .filter((stay) => stay.km >= low - 6 && stay.km <= high + 6)
    .sort((a, b) => a.km - b.km);
}

export function stayCountsByArea(areas: StayArea[], route: Waypoint[]): Record<string, number> {
  return Object.fromEntries(areas.map((area) => [area.id, staysForArea(area, route).length]));
}

/** Stays anywhere along the whole selected route. */
export function staysAlongRoute(route: Waypoint[]): StayOption[] {
  const first = route[0]!;
  const last = route[route.length - 1]!;
  const low = Math.min(first.km, last.km);
  const high = Math.max(first.km, last.km);
  return stayPool.filter((stay) => stay.km >= low - 10 && stay.km <= high + 10).sort((a, b) => a.km - b.km);
}

function stayScore(stay: StayOption): number {
  return stay.safetyRating * 2.2 + stay.rating * 1.4 - stay.detourMin * 0.06 - stay.pricePerNight / 2600;
}

export type OptimalPlan = {
  nights: number;
  stays: { stay: StayOption; nightLabel: string; reason: string }[];
  totalPrice: number;
  avgSafety: number;
};

/**
 * Wayora's suggested stay combination for the selected route: one halt per
 * planned night, spaced evenly along the corridor and scored on safety,
 * guest rating, detour and price.
 */
export function optimalPlanForRoute(route: Waypoint[]): OptimalPlan {
  const summary = routeSummary(route);
  const first = route[0]!;
  const last = route[route.length - 1]!;
  const total = Math.abs(last.km - first.km) || 1;
  const nights = Math.max(1, Math.min(4, summary.days));
  const candidates = staysAlongRoute(route);
  const picked: OptimalPlan["stays"] = [];

  for (let night = 1; night <= nights; night += 1) {
    const targetKm =
      night === nights ? last.km : Math.min(first.km, last.km) + (total * night) / nights;
    const best = candidates
      .filter((stay) => !picked.some((item) => item.stay.id === stay.id))
      .map((stay) => ({ stay, fit: stayScore(stay) - Math.abs(stay.km - targetKm) / 45 }))
      .sort((a, b) => b.fit - a.fit)[0];
    if (!best) break;
    picked.push({
      stay: best.stay,
      nightLabel: night === nights ? `Final night · ${best.stay.area}` : `Night ${night} · ${best.stay.area}`,
      reason:
        night === nights
          ? "Best rated stay at your destination."
          : `Keeps day ${night} around ${Math.round(Math.abs(best.stay.km - first.km) / Math.max(1, night))} km of driving.`,
    });
  }

  const totalPrice = picked.reduce((sum, item) => sum + item.stay.pricePerNight, 0);
  const avgSafety = picked.length
    ? picked.reduce((sum, item) => sum + item.stay.safetyRating, 0) / picked.length
    : 0;
  return { nights, stays: picked, totalPrice, avgSafety };
}
