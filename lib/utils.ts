import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ScoreOutput = {
  score: number;
  label: string;
  color: string;
};

export function checkPasswordStrength(password: string): ScoreOutput {
  let score = 0;

  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  score += checks.length ? 1 : 0;
  score += checks.lowercase ? 1 : 0;
  score += checks.uppercase ? 1 : 0;
  score += checks.number ? 1 : 0;
  score += checks.special ? 1 : 0;

  if (score <= 2) {
    return { score: 33, label: "Weak", color: "#9b2c2c" };
  } else if (score === 3 || score === 4) {
    return { score: 66, label: "Medium", color: "#f59e0b" };
  } else {
    return { score: 100, label: "Strong", color: "#22c55e" };
  }
}

/**
 * Formats a date string or Date object into a human-readable format (e.g., "Jan 01, 2024").
 */
export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/**
 * Builds a query string from the given parameters.
 */
export function buildQueryString(params?: Record<string, unknown>) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        searchParams.append(`${key}[]`, String(item));
      });

      return;
    }

    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}

export const formatChatDate = (date: Date | null) => {
  if (!date) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInSeconds < 60) {
    return "just now";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return "Today";
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  const isSameYear = date.getFullYear() === now.getFullYear();

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(isSameYear && { year: "numeric" }),
  });
};
