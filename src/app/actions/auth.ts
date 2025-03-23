'use server';

import { SigninFormSchema, SignupFormSchema } from "@/lib/definations"
import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"
import USER from "@/model/user.model";
import bcryptjs from "bcryptjs";
import { z } from "zod";

export async function signup(request: z.infer<typeof SignupFormSchema>) {

  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: request.name,
    email: request.email,
    password: request.password,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcryptjs.hash(password, 10)

  // 3. Insert the user into the database or call an Auth Library's API
  const newDTR = await USER.create({
    name,
    email,
    password: hashedPassword
  });

  // Saving the new dtr to the database
  const savedDTR = await newDTR.save();

  // Get the id after inserting the data
  const userId = (savedDTR?._id as unknown as string).toString()

  if (!userId) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }


  // 4. Create user session
  await createSession(userId)
  // 5. Redirect user
  redirect('/')
}

export async function logout() {
  await deleteSession()
  redirect('/signin')
}

export async function signin(request: z.infer<typeof SigninFormSchema>) {
  const validatedFields = SigninFormSchema.safeParse({
    email: request.email,
    password: request.password,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  const result = await USER.findOne({ email: email })

  const passwordHash = result?.password as unknown as string

  const isMatch = await bcryptjs.compare(password, passwordHash)


  if (!isMatch) {
    return {
      message: 'Invalid password or email',
    }
  }

  await createSession((result?._id as string).toString())
  redirect('/')

}