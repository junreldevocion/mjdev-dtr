'use server';



import { HOURS_WORKED } from "@/constant";
import { connectToMongoDB } from "@/lib/mongodb";
import dtrModel from "@/model/dtrModel";
import { format, intervalToDuration } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const computedFormData = (timeInOutDate: string, timeIn: string, timeOut: string) => {

  const formattedTimeInOutDate = new Date(timeInOutDate)

  const formatDateTimeIn = format(formattedTimeInOutDate, 'yyyy/MM/dd');
  const formatDateTimeOut = format(formattedTimeInOutDate, 'yyyy/MM/dd');

  const timeInDate = new Date(`${formatDateTimeIn} ${timeIn}`)
  const timeOutDate = new Date(`${formatDateTimeOut} ${timeOut}`)

  const { hours, minutes } = intervalToDuration({ start: timeInDate, end: timeOutDate })

  console.log(intervalToDuration({ start: timeInDate, end: timeOutDate }), 'intervalToDuration')

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

  return {
    timeInOutDate: formattedTimeInOutDate,
    timeIn: timeInDate,
    timeOut: timeOutDate,
    hoursWorked: parseFloat(hoursWorked),
    overtime: parseFloat(overtime),
    undertime: parseFloat(undertime),
  };
}

export const createDTR = async (formData: FormData) => {
  connectToMongoDB()

  const timeInOutDate = formData.get("timeInOutDate");
  const timeIn = formData.get("timeIn");
  const timeOut = formData.get("timeOut");

  const data = computedFormData(timeInOutDate as unknown as string, timeIn as unknown as string, timeOut as unknown as string);

  // Validate the input
  if (!timeInOutDate || !timeIn || !timeOut) {
    throw new Error('Missing timeInOutDate, timeIn, or timeOut');
  }

  const newDTR = await dtrModel.create(data);
  // // Saving the new dtr to the database
  await newDTR.save();
  // Triggering revalidation of the specified path ("/")
  revalidatePath("/");
  redirect('/')
};

export const deleteDTR = async (formData: FormData) => {
  connectToMongoDB();
  const id = formData.get('id')

  if (!id) {
    throw new Error('Missing id');
  }

  await dtrModel.deleteOne({ _id: id });

  revalidatePath("/");


}