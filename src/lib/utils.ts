import { IDTR } from "@/model/dtrModel";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

const getTotalHours = (dtrList: IDTR[], key: keyof IDTR) => {
  const totalHours = dtrList.reduce((total, item) => {
    const hours = item[key];
    const parseHours = parseFloat(item[key]);
    const hasDecimal = hours % 1 !== 0;
    if (hasDecimal) {
      const [whole] = hours.split('.');
      return total + parseFloat(whole);
    }
    return total + parseHours;
  }, 0);

  return totalHours
}

const getTotaMinutes = (dtrList: IDTR[], key: keyof IDTR) => {
  const totalMinutes = dtrList.reduce((total, item) => {
    const minutes = item[key];
    const hasDecimal = minutes % 1 !== 0;
    if (hasDecimal) {
      const [, decimal] = minutes.split('.');
      return total + parseFloat(decimal);
    }
    return total;
  }, 0);

  return totalMinutes
}

export const calculateExactTime = (dtrList: IDTR[], key: keyof IDTR) => {
  const totalHours = getTotalHours(dtrList, key);
  const totalMinutes = getTotaMinutes(dtrList, key)
  const minutesToHours = Math.floor(totalMinutes / 60);
  const hours = totalHours + minutesToHours;
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}