'use server';

import { connectToMongoDB } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import DTR from "@/model/dtr.model";
import { z } from "zod";
import { computedFormData } from "./dtr.service";
import { verifySession } from "@/lib/dal";
import { DTRFormSchema } from "@/lib/definations";

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