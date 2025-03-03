'use server';

import { connectToMongoDB } from "@/lib/mongodb";
import dtrModel from "@/model/dtrModel";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { computedFormData } from "./actions.service";


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

export const updateDTR = async (formData: FormData) => {
  const timeInOutDate = formData.get("timeInOutDate");
  console.log(timeInOutDate, 'timeInOutDate')
}

export const deleteDTR = async (formData: FormData) => {
  connectToMongoDB();
  const id = formData.get('id')

  if (!id) {
    throw new Error('Missing id');
  }

  await dtrModel.deleteOne({ _id: id });

  revalidatePath("/");

}