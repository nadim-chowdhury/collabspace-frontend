import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function truncate(str: string, max = 100) {
  return str.length > max ? str.substring(0, max) + "..." : str;
}
