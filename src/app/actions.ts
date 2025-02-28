'use server';



import { connectToMongoDB } from "@/lib/mongodb";
import dtrModel from "@/model/dtrModel";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const computedFormData = (timeInOutDate: string, timeIn: string, timeOut: string) => {

  const formattedTimeInOutDate = new Date(timeInOutDate)

  const formatDateTimeIn = format(formattedTimeInOutDate, 'yyyy/MM/dd');
  const formatDateTimeOut = format(formattedTimeInOutDate, 'yyyy/MM/dd');

  const timeInDate = new Date(`${formatDateTimeIn} ${timeIn}`)
  const timeOutDate = new Date(`${formatDateTimeOut} ${timeOut}`)

  const totalHours = timeOutDate.getHours() - timeInDate.getHours();
  const totalMinutes = timeOutDate.getMinutes() - timeInDate.getMinutes();

  const totalHoursAndMinutes = totalHours + totalMinutes / 60

  const hoursWorked = (totalHoursAndMinutes).toFixed(2);

  const totalOvertime = totalHoursAndMinutes - 8;
  const overtime = (totalOvertime > 0 ? totalOvertime : 0).toFixed(2);
  const undertime = (Math.abs(totalOvertime < 0 ? totalOvertime : 0)).toFixed(2);

  return {
    timeInOutDate: formattedTimeInOutDate,
    timeIn: timeInDate,
    timeOut: timeOutDate,
    hoursWorked,
    overtime,
    undertime
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