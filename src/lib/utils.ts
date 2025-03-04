import { IDTR } from "@/model/dtrModel";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getTotalHours, getTotaMinutes } from "./utils.service";
import { format } from "date-fns";
import { MINUTES_WORKED } from "@/constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats the given hours and minutes into a string with leading zeros if necessary.
 *
 * @param hours - The hours to format, as a string.
 * @param minutes - The minutes to format, as a string.
 * @returns A formatted string in the format "Hours HH Minutes MM".
 */
export const formatTime = (hours: string, minutes: string) => {
  const hoursString = hours.padStart(2, '0');
  const minutesString = minutes.padStart(2, '0');

  return `Hours ${hoursString} Minutes ${minutesString}`;
}

/**
 * Calculates the total hours worked from a list of DTR (Daily Time Record) entries.
 *
 * @param {IDTR[]} dtrList - An array of DTR entries, each containing the hours worked.
 * @returns {number} The total hours worked, rounded up to two decimal places.
 */
export const calculateTotalHours = (dtrList: IDTR[]) => {
  const totalHours = dtrList.reduce((total, { hoursWorked }) => total + parseFloat(hoursWorked), 0);

  return Math.ceil(totalHours * 100) / 100;
}

/**
 * Calculates the exact time in hours and minutes from a list of DTR (Daily Time Record) entries.
 *
 * @param dtrList - An array of DTR entries.
 * @param key - The key of the DTR entry to calculate the time for.
 * @returns An object containing the total hours and minutes.
 */
export const calculateExactTime = (dtrList: IDTR[], key: keyof IDTR) => {
  const totalHours = getTotalHours(dtrList, key);
  const totalMinutes = getTotaMinutes(dtrList, key)
  const minutesToHours = Math.floor(totalMinutes / 60);
  const hours = totalHours + minutesToHours;
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

export const formatResponse = (data: IDTR) => {

  if(!data) {
    return {
      timeIn: '',
      timeOut: '',
      timeInOutDate: new Date()
    }
  }
  
  const {timeIn, timeInOutDate, timeOut} = data

  const timeInTemp = new Date(timeIn);
  const timeOutTemp = new Date(timeOut);
  const timeInOutDateTemp = new Date(timeInOutDate)

  const formatTimeIn = format(timeInTemp, 'HH:mm')
  const formatTimeOut = format(timeOutTemp, 'HH:mm')


  const formattedData = {
    timeIn: formatTimeIn,
    timeOut: formatTimeOut,
    timeInOutDate: timeInOutDateTemp
  }

  return formattedData;
}

export const totalRendredTime = (dtrList: IDTR[]) => {
  const {hours: hoursWorked, minutes: minutesWorked} = calculateExactTime(dtrList, 'hoursWorked');
  const {hours: overtimeHours, minutes: overtimeMinutes} = calculateExactTime(dtrList, 'overtime');

  let totalHoursRendered = hoursWorked + overtimeHours;
  let totalMinutesRendred = minutesWorked + overtimeMinutes;

  if(totalMinutesRendred > MINUTES_WORKED) {

    const calcutedMinutes =  totalMinutesRendred % MINUTES_WORKED;
    const calculatedHours = Math.floor(totalMinutesRendred / MINUTES_WORKED)

    totalMinutesRendred = calcutedMinutes
    totalHoursRendered += calculatedHours
  }


  return {
    hours: totalHoursRendered,
    minutes: totalMinutesRendred
  }
}