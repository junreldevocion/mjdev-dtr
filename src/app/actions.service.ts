import { HOURS_WORKED, MINUTES_WORKED } from "@/constant";
import { intervalToDuration } from "date-fns";
import { format } from "date-fns";

export const computedFormData = (timeInOutDate: string, timeIn: string, timeOut: string, isDoubleTime: boolean) => {

  const formattedTimeInOutDate = new Date(timeInOutDate)

  const formatDateTimeIn = format(formattedTimeInOutDate, 'yyyy/MM/dd');
  const formatDateTimeOut = format(formattedTimeInOutDate, 'yyyy/MM/dd');

  const timeInDate = new Date(`${formatDateTimeIn} ${timeIn}`)
  const timeOutDate = new Date(`${formatDateTimeOut} ${timeOut}`)

  const { hours, minutes } = intervalToDuration({ start: timeInDate, end: timeOutDate })

  const nullishHours = hours ?? 0;
  const nullishMinutes = minutes ?? 0;

  const overtimeInHour = nullishHours > HOURS_WORKED ? nullishHours - HOURS_WORKED : 0;
  const overtimeInMinutes = (nullishHours === HOURS_WORKED || nullishHours > HOURS_WORKED) ? nullishMinutes : 0;

  let undertimeInHour = (nullishHours) < HOURS_WORKED ? HOURS_WORKED - (nullishHours) : 0;
  if (nullishMinutes > 0) {
    undertimeInHour = (nullishHours + 1) < HOURS_WORKED ? HOURS_WORKED - (nullishHours + 1) : 0;
  }
  const undertimeInMinutes = (nullishHours) < HOURS_WORKED ? 60 - nullishMinutes : 0;

  const overtime = `${overtimeInHour}.${overtimeInMinutes}`
  const undertime = `${undertimeInHour}.${undertimeInMinutes}`

  const hoursWorked = `${hours}.${minutes}`;

  let doubleTimeHours = ((hours ?? 0) + overtimeInHour) * 2;
  let doubleTimeMinutes = ((minutes ?? 0) + overtimeInMinutes) * 2;

  if (doubleTimeMinutes > MINUTES_WORKED) {
    const calculatedHours = Math.floor(doubleTimeMinutes / 60);
    const calculatedMinutes = doubleTimeMinutes % MINUTES_WORKED
    doubleTimeHours += calculatedHours;
    doubleTimeMinutes = calculatedMinutes
  }

  let doubleTime = `${doubleTimeHours}.${doubleTimeMinutes}`

  if (!isDoubleTime) {
    doubleTime = `0`
  }

  return {
    timeInOutDate: formattedTimeInOutDate,
    timeIn: timeInDate,
    timeOut: timeOutDate,
    hoursWorked: parseFloat(hoursWorked),
    overtime: parseFloat(overtime),
    undertime: parseFloat(undertime),
    doubleTime
  };
}