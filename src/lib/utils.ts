import { IDTR } from "@/model/dtrModel";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateTotalHours = (dtrList: IDTR[]) => {
  const totalHours = (dtrList.reduce((total, { hoursWorked }) => (total + parseFloat(hoursWorked)), 0)).toFixed(2);

  const formattedHours = `${totalHours.split('.')[0]} hours ${totalHours.split('.')[1]} minutes`;

  return formattedHours;
}
