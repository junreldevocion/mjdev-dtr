import { IDTR } from "@/model/dtrModel";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getTotalHours, getTotaMinutes } from "./utils.service";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (hours: string, minutes: string) => {
  const hoursString = hours.padStart(2, '0');
  const minutesString = minutes.padStart(2, '0');

  return `Hours ${hoursString} Minutes ${minutesString}`;
}

export const calculateTotalHours = (dtrList: IDTR[]) => {
  const totalHours = dtrList.reduce((total, { hoursWorked }) => total + parseFloat(hoursWorked), 0);

  return Math.ceil(totalHours * 100) / 100;
}

export const calculateExactTime = (dtrList: IDTR[], key: keyof IDTR) => {
  const totalHours = getTotalHours(dtrList, key);
  const totalMinutes = getTotaMinutes(dtrList, key)
  const minutesToHours = Math.floor(totalMinutes / 60);
  const hours = totalHours + minutesToHours;
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}