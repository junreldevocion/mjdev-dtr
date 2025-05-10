'use server';

import { connectToMongoDB } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DTR from "@/model/dtr.model";
import { z } from "zod";
import { verifySession } from "@/lib/dal";
import { DTRFormSchema } from "@/lib/definations";
import { format, intervalToDuration } from "date-fns";
import { HOURS_WORKED, MINUTES_WORKED } from "@/constant";

const computedFormData = (timeInOutDate: Date, timeIn: string, timeOut: string, isDoubleTime: boolean) => {

  const formattedTimeInOutDate = timeInOutDate

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



  let doubleTimeHours = (hours ?? 0) * 2;
  let doubleTimeMinutes = (minutes ?? 0) * 2;

  if (doubleTimeMinutes > MINUTES_WORKED) {
    const calculatedHours = Math.floor(doubleTimeMinutes / 60);
    const calculatedMinutes = doubleTimeMinutes % MINUTES_WORKED
    doubleTimeHours += calculatedHours;
    doubleTimeMinutes = calculatedMinutes
  }

  let doubleTime = `0`

  let hoursWorked = `${hours}.${minutes}`;

  if (isDoubleTime) {
    doubleTime = `${doubleTimeHours}.${doubleTimeMinutes}`
    hoursWorked = doubleTime
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

export const createDTR = async (request: z.infer<typeof DTRFormSchema>) => {
  const session = await verifySession()
  await connectToMongoDB()

  const { timeInOutDate, timeIn, timeOut, isDoubleTime } = request

  const newTimeInOutDate = new Date(timeInOutDate)

  const data = computedFormData(newTimeInOutDate, timeIn as unknown as string, timeOut as unknown as string, isDoubleTime as unknown as boolean);



  // Validate the input
  if (!timeInOutDate || !timeIn || !timeOut) {
    throw new Error('Missing timeInOutDate, timeIn, or timeOut');
  }

  const newDTR = await DTR.create({ ...data, userId: session.userId });
  //  Saving the new dtr to the database
  await newDTR.save();
  // Triggering revalidation of the specified path("/")
  revalidatePath("/home");
  redirect('/home')
};

export const updateDTR = async (request: z.infer<typeof DTRFormSchema>) => {
  await connectToMongoDB();
  const { timeInOutDate, timeIn, timeOut, isDoubleTime, id } = request

  const newTimeInOutDate = new Date(timeInOutDate)

  const data = computedFormData(newTimeInOutDate, timeIn as unknown as string, timeOut as unknown as string, isDoubleTime as unknown as boolean);

  // Validate the input
  if (!timeInOutDate || !timeIn || !timeOut) {
    throw new Error('Missing timeInOutDate, timeIn, or timeOut');
  }

  await DTR.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  revalidatePath("/home");
  redirect('/home')

}

export const deleteDTR = async (formData: FormData) => {
  await connectToMongoDB();
  const id = formData.get('id')

  if (!id) {
    throw new Error('Missing id');
  }

  await DTR.deleteOne({ _id: id });

  revalidatePath("/home");

}

export const getDTR = async (id: string) => {
  await connectToMongoDB();

  const result = DTR.findById(id);

  if (!id || !result) {
    throw new Error('failed to fetch DTR');
  }

  return result
}

export const updateMany = async () => {
  const session = await verifySession()
  const result = DTR.updateMany({}, { $set: { userId: session?.userId } });

  return result
}

export const findAndModify = async () => {
  const session = await verifySession()
  const result = DTR.find({ userId: '67dfc77af807b328a9ad7dab' });
  (await result).map(async (item) => {
    await DTR.findByIdAndUpdate(item.id, { $set: { userId: session?.userId } })
  })
}