import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatShortDate(dateStr);
}

export function getSeatsLabel(seatsLeft: number): string {
  if (seatsLeft === 0) return "Sold out";
  if (seatsLeft === 1) return "1 seat left";
  if (seatsLeft <= 3) return `${seatsLeft} seats left`;
  return `${seatsLeft} seats`;
}

export function getRatingStars(rating: number): string {
  return "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const CATEGORY_COLORS: Record<string, string> = {
  Backpacking: "bg-amber-500/20 text-amber-400 border-amber-500/20",
  Solo: "bg-violet-500/20 text-violet-400 border-violet-500/20",
  Trekking: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  Camping: "bg-orange-500/20 text-orange-400 border-orange-500/20",
  "Road Trips": "bg-sky-500/20 text-sky-400 border-sky-500/20",
  Surfing: "bg-cyan-500/20 text-cyan-400 border-cyan-500/20",
  Festivals: "bg-pink-500/20 text-pink-400 border-pink-500/20",
  Photography: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  "Food & Culture": "bg-rose-500/20 text-rose-400 border-rose-500/20",
  Wellness: "bg-teal-500/20 text-teal-400 border-teal-500/20",
  "Digital Nomad": "bg-indigo-500/20 text-indigo-400 border-indigo-500/20",
  "Anime & Pop Culture": "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/20",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "text-emerald-400",
  Moderate: "text-amber-400",
  Challenging: "text-red-400",
};
