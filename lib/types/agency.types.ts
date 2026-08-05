import type { AuthUser } from "./auth.types";

// ─── Agency Profile ───────────────────────────────────────────────────────────

export interface AgencyProfile {
  id: string;
  userId: string;
  agencyName: string;
  logo: string;
  banner: string;
  description: string;
  gstNumber: string;
  country: string;
  city: string;
  address: string;
  verificationStatus: "pending" | "verified" | "rejected";
  socialLinks: {
    website?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  supportContact: string;
  businessHours: string;
  yearsOfExperience: number;
  languages: string[];
  rating: number;
  totalTrips: number;
  followers: number;
  createdAt: string;
}

// ─── Experience (Agency-owned) ────────────────────────────────────────────────

export interface AgencyExperience {
  id: string;
  agencyId: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  duration: string;
  destination: string;
  category: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  maxParticipants: number;
  currentBookings: number;
  status: "draft" | "active" | "paused" | "completed";
  rating: number;
  totalReviews: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  agencyId: string;
  travelerId: string;
  travelerName: string;
  travelerAvatar: string;
  travelerEmail: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  amount: number;
  paidAt: string | null;
  startDate: string;
  participants: number;
  notes: string;
  createdAt: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  bookingId: string;
  agencyId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "refunded" | "failed";
  method: "upi" | "card" | "net_banking" | "wallet";
  transactionId: string;
  createdAt: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: "text" | "image" | "document";
  readAt: string | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  agencyId: string;
  travelerId: string;
  travelerName: string;
  travelerAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

// ─── Document ─────────────────────────────────────────────────────────────────

export interface AgencyDocument {
  id: string;
  agencyId: string;
  bookingId?: string;
  name: string;
  type: "itinerary" | "invoice" | "insurance" | "visa" | "other";
  url: string;
  size: number;
  uploadedAt: string;
}

// ─── Agency Stats ─────────────────────────────────────────────────────────────

export interface AgencyStats {
  totalRevenue: number;
  revenueThisMonth: number;
  totalBookings: number;
  bookingsThisMonth: number;
  totalTravelers: number;
  activeExperiences: number;
  avgRating: number;
  pendingPayouts: number;
}
