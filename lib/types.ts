// ─── ROVER Type System ──────────────────────────────────────────────────────

export type Category =
  | "Backpacking"
  | "Solo"
  | "Trekking"
  | "Camping"
  | "Road Trips"
  | "Surfing"
  | "Festivals"
  | "Photography"
  | "Food & Culture"
  | "Wellness"
  | "Digital Nomad"
  | "Anime & Pop Culture";

export type Difficulty = "Easy" | "Moderate" | "Challenging";

export type Currency = "INR" | "USD" | "EUR" | "JPY" | "THB";

// ─── Destination ─────────────────────────────────────────────────────────────

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  tagline: string;
  image: string;
  coverImage: string;
  lat: number;
  lng: number;
  countryCode: string;
  trending: boolean;
}

// ─── Agency ──────────────────────────────────────────────────────────────────

export interface Agency {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  tripsCompleted: number;
  yearsActive: number;
  bio: string;
  specialties: Category[];
  location: string;
  website?: string;
  instagram?: string;
}

// ─── Traveler / User ─────────────────────────────────────────────────────────

export interface Traveler {
  id: string;
  name: string;
  avatar: string;
  hometown: string;
  tripsCount: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  earned: boolean;
  earnedDate?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  hometown: string;
  bio: string;
  countriesVisited: string[];
  tripsCompleted: number;
  totalDaysOnRoad: number;
  wishlist: string[];
  badges: Badge[];
  travelStreak: number;
  memberSince: string;
  instagram?: string;
  followers: number;
  following: number;
}

// ─── Itinerary ───────────────────────────────────────────────────────────────

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
  image?: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  author: Traveler;
  rating: number;
  text: string;
  date: string;
  images?: string[];
  tripDate: string;
  verified: boolean;
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FAQ {
  question: string;
  answer: string;
}

// ─── Experience ──────────────────────────────────────────────────────────────

export interface ExperienceDate {
  id: string;
  startDate: string;
  endDate: string;
  seatsTotal: number;
  seatsLeft: number;
  priceOverride?: number;
}

export interface Experience {
  id: string;
  title: string;
  tagline: string;
  description: string;
  agency: Agency;
  destination: Destination;
  heroImage: string;
  gallery: string[];
  price: number;
  currency: Currency;
  duration: string;
  durationDays: number;
  dates: ExperienceDate[];
  seatsTotal: number;
  seatsLeft: number;
  travelers: Traveler[];
  rating: number;
  reviewCount: number;
  category: Category;
  tags: string[];
  difficulty: Difficulty;
  included: string[];
  excluded: string[];
  itinerary: ItineraryDay[];
  highlights: string[];
  faqs: FAQ[];
  reviews: Review[];
  lat: number;
  lng: number;
  address: string;
  trending: boolean;
  aiPick: boolean;
  isWeekendEscape: boolean;
  isFeatured: boolean;
  badge?: string;
}

// ─── Trip (Booked) ───────────────────────────────────────────────────────────

export type TripStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "partial" | "pending";

export interface TripDocument {
  id: string;
  name: string;
  type: "ticket" | "voucher" | "visa" | "insurance" | "itinerary";
  url: string;
  uploadedAt: string;
}

export interface Trip {
  id: string;
  experience: Experience;
  status: TripStatus;
  bookingDate: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  totalPaid: number;
  bookingRef: string;
  documents: TripDocument[];
  paymentStatus: PaymentStatus;
  journalEntries?: JournalEntry[];
}

export interface JournalEntry {
  id: string;
  tripId: string;
  date: string;
  text: string;
  images?: string[];
  mood: "amazing" | "good" | "okay" | "tough";
  location: string;
}

// ─── Community ───────────────────────────────────────────────────────────────

export interface CommunityPost {
  id: string;
  author: Traveler;
  destination?: Destination;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
  isLiked: boolean;
}

export interface TravelBuddy {
  traveler: Traveler;
  sharedTrips: number;
  nextTrip?: string;
  mutualFriends: number;
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ─── Booking Form ─────────────────────────────────────────────────────────────

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  dietaryRequirements: string;
  medicalConditions: string;
  roomPreference: "single" | "shared" | "no-preference";
  selectedDateId: string;
  travelerCount: number;
}
