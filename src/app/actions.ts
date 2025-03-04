'use server';

import { connectToMongoDB } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { computedFormData } from "./actions.service";
import DTRModel from "@/model/dtrModel";


export const createDTR = async (formData: FormData) => {
  await connectToMongoDB()

  const timeInOutDate = formData.get("timeInOutDate");
  const timeIn = formData.get("timeIn");
  const timeOut = formData.get("timeOut");

  const data = computedFormData(timeInOutDate as unknown as string, timeIn as unknown as string, timeOut as unknown as string);

  // Validate the input
  if (!timeInOutDate || !timeIn || !timeOut) {
    throw new Error('Missing timeInOutDate, timeIn, or timeOut');
  }

  const newDTR = await DTRModel.create(data);
  //  Saving the new dtr to the database
  await newDTR.save();
  // Triggering revalidation of the specified path ("/")
  revalidatePath("/");
  redirect('/')
};

export const updateDTR = async (formData: FormData) => {
  await connectToMongoDB();
  const timeInOutDate = formData.get("timeInOutDate");
  const timeIn = formData.get("timeIn");
  const timeOut = formData.get("timeOut");
  const id = formData.get('id');

  const data = computedFormData(timeInOutDate as unknown as string, timeIn as unknown as string, timeOut as unknown as string);

  // Validate the input
  if (!timeInOutDate || !timeIn || !timeOut) {
    throw new Error('Missing timeInOutDate, timeIn, or timeOut');
  }

   await DTRModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  revalidatePath("/");
  redirect('/')

}

export const deleteDTR = async (formData: FormData) => {
  await connectToMongoDB();
  const id = formData.get('id')

  if (!id) {
    throw new Error('Missing id');
  }

  await DTRModel.deleteOne({ _id: id });

  revalidatePath("/");

}