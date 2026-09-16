import {
  BedDouble,
  Bus,
  Camera,
  Car,
  Footprints,
  Mountain,
  Plane,
  TrainFront,
  Utensils,
} from "lucide-react";

export type RouteOption = {
  id: string;
  name: string;
  badge: string;
  mode: string;
  duration: string;
  distance: string;
  price: string;
  stops: string;
  departure: string;
  arrival: string;
  note: string;
};

export const routeOptions: RouteOption[] = [
  {
    id: "scenic",
    name: "Himalayan Scenic Route",
    badge: "Recommended",
    mode: "Car",
    duration: "10 hr 30 min",
    distance: "540 km",
    price: "₹4,200",
    stops: "2 suggested stops",
    departure: "6:00 AM",
    arrival: "4:30 PM",
    note: "Clear roads · Best weather window",
  },
  {
    id: "fast",
    name: "Express Route",
    badge: "Fastest",
    mode: "Car",
    duration: "9 hr 45 min",
    distance: "528 km",
    price: "₹4,650",
    stops: "1 suggested stop",
    departure: "6:00 AM",
    arrival: "3:45 PM",
    note: "Moderate traffic near Chandigarh",
  },
  {
    id: "value",
    name: "Overnight Volvo",
    badge: "Cheapest",
    mode: "Bus",
    duration: "12 hr 20 min",
    distance: "552 km",
    price: "₹1,450",
    stops: "3 rest stops",
    departure: "7:30 PM",
    arrival: "7:50 AM",
    note: "Sleeper seats · One transfer",
  },
];

export type PackingItem = { id: string; label: string; packed: boolean; locked?: boolean };
export type PackingGroup = { name: string; icon: string; items: PackingItem[] };

export const initialPacking: PackingGroup[] = [
  {
    name: "Clothing",
    icon: "👕",
    items: [
      { id: "jacket", label: "Rain jacket", packed: true },
      { id: "layers", label: "Warm layers", packed: true },
      { id: "shoes", label: "Waterproof shoes", packed: false },
    ],
  },
  {
    name: "Essentials",
    icon: "🧴",
    items: [
      { id: "brush", label: "Toothbrush", packed: false },
      { id: "paste", label: "Toothpaste", packed: false },
      { id: "toiletries", label: "Toiletries", packed: true },
      { id: "medicine", label: "Medicines", packed: false },
      { id: "bottle", label: "Water bottle", packed: false },
    ],
  },
  {
    name: "Documents",
    icon: "📄",
    items: [
      { id: "id", label: "Photo ID", packed: true },
      { id: "tickets", label: "Travel confirmations", packed: false },
    ],
  },
  {
    name: "Electronics",
    icon: "🔌",
    items: [
      { id: "phone", label: "Phone charger", packed: true },
      { id: "power", label: "Power bank", packed: false },
    ],
  },
];

export const bookingSections = [
  {
    category: "Transport",
    icon: TrainFront,
    options: [
      { title: "Volvo AC Sleeper", meta: "Delhi ISBT · 7:30 PM", price: "from ₹1,450", tag: "Best value" },
      { title: "Private cab", meta: "Door-to-door · 4 seats", price: "from ₹8,900", tag: "Flexible" },
    ],
  },
  {
    category: "Stay",
    icon: BedDouble,
    options: [
      { title: "The Orchard Manali", meta: "Old Manali · 4.7 ★", price: "from ₹3,200", tag: "Free cancellation" },
      { title: "Himalayan Hostel", meta: "Mall Road · 4.5 ★", price: "from ₹980", tag: "Popular" },
    ],
  },
  {
    category: "Activities",
    icon: Mountain,
    options: [
      { title: "Solang Valley day trip", meta: "6 hours · Hotel pickup", price: "from ₹1,800", tag: "Small group" },
      { title: "Old Manali food walk", meta: "2.5 hours · 6 tastings", price: "from ₹900", tag: "Local favorite" },
    ],
  },
];

export const exploreItems = [
  { title: "Solang Valley", type: "Adventure", icon: Mountain, detail: "14 km from Manali" },
  { title: "Old Manali", type: "Culture", icon: Camera, detail: "Cafés and local lanes" },
  { title: "River-side cafés", type: "Food", icon: Utensils, detail: "8 places saved" },
  { title: "Jogini Falls", type: "Nature", icon: Footprints, detail: "Easy 3 km walk" },
];

export const travelModes = [
  { label: "Car / Bike", icon: Car },
  { label: "Train", icon: TrainFront },
  { label: "Bus", icon: Bus },
  { label: "Flight", icon: Plane },
];

export type StaySuggestion = {
  id: string;
  name: string;
  near: string;
  nightLabel: string;
  price: string;
  rating: number;
  safetyRating: number;
  detour: string;
  note: string;
  tag: string;
};

/** Accommodation options near the corridor, offered as optional swaps. */
export const staySuggestions: StaySuggestion[] = [
  {
    id: "stay-karnal",
    name: "Highway Grand, Karnal",
    near: "Karnal · 125 km in",
    nightLabel: "Night 1",
    price: "₹2,100 / night",
    rating: 4.2,
    safetyRating: 4.3,
    detour: "5 min off route",
    note: "Good if you leave Delhi late and want a short first day.",
    tag: "Short first day",
  },
  {
    id: "stay-chandigarh",
    name: "Sector 17 Boutique Stay",
    near: "Chandigarh · 250 km in",
    nightLabel: "Night 1",
    price: "₹3,400 / night",
    rating: 4.6,
    safetyRating: 4.7,
    detour: "On route",
    note: "Natural halfway halt with well-lit streets and late food options.",
    tag: "Recommended halt",
  },
  {
    id: "stay-bilaspur",
    name: "Lakeview Rooms, Bilaspur",
    near: "Bilaspur · 360 km in",
    nightLabel: "Night 2",
    price: "₹1,900 / night",
    rating: 4.1,
    safetyRating: 4.2,
    detour: "3 min off route",
    note: "Break the hill section before the ghats begin.",
    tag: "Quiet",
  },
  {
    id: "stay-mandi",
    name: "Riverside Inn, Mandi",
    near: "Mandi · 430 km in",
    nightLabel: "Night 2",
    price: "₹2,450 / night",
    rating: 4.4,
    safetyRating: 4.3,
    detour: "6 min off route",
    note: "Last big service town — handy if weather slows the drive.",
    tag: "Backup halt",
  },
  {
    id: "stay-kullu",
    name: "Beas Valley Lodge, Kullu",
    near: "Kullu · 500 km in",
    nightLabel: "Night 3",
    price: "₹2,800 / night",
    rating: 4.3,
    safetyRating: 4.4,
    detour: "4 min off route",
    note: "Swap here if you want a slower final morning into Manali.",
    tag: "Scenic",
  },
  {
    id: "stay-manali",
    name: "The Orchard, Old Manali",
    near: "Manali · 540 km in",
    nightLabel: "Final nights",
    price: "₹3,200 / night",
    rating: 4.7,
    safetyRating: 4.6,
    detour: "2 km from centre",
    note: "Your destination stay — keep it unless you shift plans.",
    tag: "Destination",
  },
];
