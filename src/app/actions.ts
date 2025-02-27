'use server';



import dtrModel from "@/model/dtrModel";
import { format, parseISO } from "date-fns";
import { revalidatePath } from "next/cache";

const computedFormData = (formData: FormData) => {
  const timeInOutDate = formData.get("timeInOutDate");
  const timeIn = formData.get("timeIn");
  const timeOut = formData.get("timeOut");

  const formatDateTimeIn = format(parseISO(timeInOutDate as unknown as string), 'yyyy/MM/dd');
  const formatDateTimeOut = format(parseISO(timeInOutDate as unknown as string), 'yyyy/MM/dd');

  const timeInDate = new Date(`${formatDateTimeIn} ${timeIn}`)
  const timeOutDate = new Date(`${formatDateTimeOut} ${timeOut}`)

  const totalHours = timeOutDate.getHours() - timeInDate.getHours();
  const totalMinutes = timeOutDate.getMinutes() - timeInDate.getMinutes();

  const totalHoursAndMinutes = totalHours + totalMinutes / 60

  const hoursWorked = (totalHoursAndMinutes).toFixed(2);

  const totalOvertime = totalHoursAndMinutes - 8;
  const overtime = (totalOvertime > 0 ? totalOvertime : 0).toFixed(2);
  const undertime = (totalOvertime < 0 ? totalOvertime : 0).toFixed(2);

  return {
    timeInOutDate,
    timeIn: timeInDate,
    timeOut: timeOutDate,
    hoursWorked,
    overtime,
    undertime
  };
}

export const createDTR = async (formData: FormData) => {
  const data = computedFormData(formData)

  try {

    const newDTR = await dtrModel.create(data);
    // Saving the new dtr to the database
    newDTR.save();
    // Triggering revalidation of the specified path ("/")
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
};