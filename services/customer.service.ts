import type { TravelerProfile } from "@/lib/types/customer.types";

class CustomerServiceClass {
  async getProfile(userId: string): Promise<TravelerProfile | null> {
    // Mock traveler profile
    await delay(300);
    return {
      id: `tp_${userId}`,
      userId,
      passportNumber: "P9876543",
      passportExpiry: "2029-06-01",
      nationality: "Indian",
      emergencyContact: {
        name: "Rajesh Mehta",
        relation: "Father",
        phone: "+91 98765 11111",
      },
      travelInterests: ["Trekking", "Road Trips", "Backpacking", "Photography"],
      wishlist: [],
      visitedCountries: ["IN", "NP", "LK", "TH", "JP"],
      upcomingTrips: [],
      documents: [],
      badges: [
        { id: "b1", name: "First Trip", description: "Completed first trip", icon: "🎒", earned: true, earnedAt: "2024-02-01T00:00:00Z" },
        { id: "b2", name: "Solo Warrior", description: "Solo traveler", icon: "🦅", earned: true, earnedAt: "2024-04-01T00:00:00Z" },
        { id: "b3", name: "Mountain Goat", description: "Trekked 3+ peaks", icon: "🏔️", earned: false },
      ],
      travelLevel: "Explorer",
      bio: "Restless soul. Mountains > meetings. Collecting passport stamps since 2018.",
      hometown: "Bangalore, India",
      instagram: "@arjun.ontheroad",
      travelStreak: 3,
      totalDaysOnRoad: 187,
      tripsCompleted: 14,
      followers: 1200,
      createdAt: "2024-01-15T10:00:00Z",
    };
  }

  async updateProfile(userId: string, updates: Partial<TravelerProfile>): Promise<TravelerProfile> {
    const profile = await this.getProfile(userId);
    if (!profile) throw new Error("Traveler profile not found");
    return { ...profile, ...updates };
  }
}

export const CustomerService = new CustomerServiceClass();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
