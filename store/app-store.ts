"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIMessage, Experience } from "@/lib/types";

export type AppTheme = "dark" | "light" | "aurora" | "sunset" | "ocean";

interface AppStore {
  // Theme
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (experienceId: string) => void;
  isWishlisted: (experienceId: string) => boolean;

  // AI Chat
  aiMessages: AIMessage[];
  isAIOpen: boolean;
  setAIOpen: (open: boolean) => void;
  addAIMessage: (message: Omit<AIMessage, "id" | "timestamp">) => void;
  clearAIMessages: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;

  // Booking
  selectedExperience: Experience | null;
  setSelectedExperience: (experience: Experience | null) => void;
  isBookingOpen: boolean;
  setBookingOpen: (open: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Theme
      theme: "dark" as AppTheme,
      setTheme: (theme) => set({ theme }),

      // Wishlist
      wishlist: [],
      toggleWishlist: (experienceId) => {
        const current = get().wishlist;
        const isIn = current.includes(experienceId);
        set({
          wishlist: isIn
            ? current.filter((id) => id !== experienceId)
            : [...current, experienceId],
        });
      },
      isWishlisted: (experienceId) => get().wishlist.includes(experienceId),

      // AI Chat
      aiMessages: [],
      isAIOpen: false,
      setAIOpen: (open) => set({ isAIOpen: open }),
      addAIMessage: (message) =>
        set((state) => ({
          aiMessages: [
            ...state.aiMessages,
            {
              ...message,
              id: `msg-${Date.now()}`,
              timestamp: new Date().toISOString(),
            },
          ],
        })),
      clearAIMessages: () => set({ aiMessages: [] }),

      // Search
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      activeCategory: null,
      setActiveCategory: (category) => set({ activeCategory: category }),

      // Booking
      selectedExperience: null,
      setSelectedExperience: (experience) =>
        set({ selectedExperience: experience }),
      isBookingOpen: false,
      setBookingOpen: (open) => set({ isBookingOpen: open }),
    }),
    {
      name: "rover-store",
      partialize: (state) => ({ wishlist: state.wishlist, theme: state.theme }),
    }
  )
);
