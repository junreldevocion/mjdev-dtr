'use server';


import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { computedFormData } from "./actions.service";
import DTR from "@/model/dtr.model";


export const createDTR = async (formData: FormData) => {
  const timeInOutDate = formData.get("timeInOutDate");
  const timeIn = formData.get("timeIn");
  const timeOut = formData.get("timeOut");
  const isDoubleTime = formData.get("isDoubleTime");

  const data = computedFormData(timeInOutDate as unknown as string, timeIn as unknown as string, timeOut as unknown as string, isDoubleTime as unknown as boolean);

  // Validate the input
  if (!timeInOutDate || !timeIn || !timeOut) {
    throw new Error('Missing timeInOutDate, timeIn, or timeOut');
  }

  const newDTR = await DTR.create(data);
  //  Saving the new dtr to the database
  await newDTR.save();
  // Triggering revalidation of the specified path("/")
  revalidatePath("/");
  redirect('/')
};

export const updateDTR = async (formData: FormData) => {
  const timeInOutDate = formData.get("timeInOutDate");
  const timeIn = formData.get("timeIn");
  const timeOut = formData.get("timeOut");
  const id = formData.get('id');
  const isDoubleTime = formData.get("isDoubleTime");

  const data = computedFormData(timeInOutDate as unknown as string, timeIn as unknown as string, timeOut as unknown as string, isDoubleTime as unknown as boolean);

  // Validate the input
  if (!timeInOutDate || !timeIn || !timeOut) {
    throw new Error('Missing timeInOutDate, timeIn, or timeOut');
  }

  await DTR.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  revalidatePath("/");
  redirect('/')

}

export const deleteDTR = async (formData: FormData) => {
  const id = formData.get('id')

  if (!id) {
    throw new Error('Missing id');
  }
  await DTR.deleteOne({ _id: id });
  revalidatePath("/");  

}