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
