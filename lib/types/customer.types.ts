// ─── Traveler Profile ─────────────────────────────────────────────────────────

export interface TravelerProfile {
  id: string;
  userId: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  travelInterests: string[];
  wishlist: string[];       // experience IDs
  visitedCountries: string[];
  upcomingTrips: string[];  // booking IDs
  documents: TravelerDocument[];
  badges: TravelerBadge[];
  travelLevel: "Rookie" | "Explorer" | "Wanderer" | "Nomad" | "Legend";
  bio: string;
  hometown: string;
  instagram?: string;
  travelStreak: number;
  totalDaysOnRoad: number;
  tripsCompleted: number;
  followers: number;
  createdAt: string;
}

// ─── Traveler Document ────────────────────────────────────────────────────────

export interface TravelerDocument {
  id: string;
  name: string;
  type: "passport" | "visa" | "insurance" | "id_proof" | "other";
  url: string;
  expiryDate?: string;
  uploadedAt: string;
}

// ─── Traveler Badge ───────────────────────────────────────────────────────────

export interface TravelerBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

// ─── Upcoming Trip ────────────────────────────────────────────────────────────

export interface UpcomingTrip {
  id: string;
  experienceId: string;
  experienceTitle: string;
  agencyName: string;
  coverImage: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: "confirmed" | "pending";
  participants: number;
  amount: number;
}
