'use server';

import { SigninFormSchema, SignupFormSchema, UpdateUserFormSchema } from "@/lib/definations"
import { createSession, deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"
import USER from "@/model/user.model";
import bcryptjs from "bcryptjs";
import { z } from "zod";
import { getUser, verifySession } from "@/lib/dal";
import { connectToMongoDB } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

export async function signup(request: z.infer<typeof SignupFormSchema>) {
  await connectToMongoDB();

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

  const isExist = await USER.findOne({ email })

  if (isExist) {
    return {
      message: 'Email already exist!',
    }
  }

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
  redirect('/home')
}

export async function logout() {
  await connectToMongoDB();
  await deleteSession()
  revalidatePath('/home')
  redirect('/signin')
}

export async function signin(request: z.infer<typeof SigninFormSchema>) {
  await connectToMongoDB();
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



  if (!passwordHash) {
    return {
      message: 'Email or password not match in database!',
    }
  }

  const isMatch = bcryptjs.compare(password, passwordHash)

  console.log(isMatch, 'isMatch')


  if (!isMatch) {
    return {
      message: 'Invalid password or email',
    }
  }

  await createSession((result?._id as string).toString())
  revalidatePath('/home')
  redirect('/home')

}

export async function updateUser(formData: FormData) {
  await connectToMongoDB();

  const session = await verifySession()

  // Extract data from FormData
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const oldPassword = formData.get('oldPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const imageFile = formData.get('image') as File | null;

  // 1. Validate form fields
  const validatedFields = UpdateUserFormSchema.safeParse({
    name,
    email,
    newPassword,
    oldPassword,
    image: imageFile
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 2. Prepare data for insertion into database
  const { name: validatedName, email: validatedEmail, newPassword: validatedNewPassword, oldPassword: validatedOldPassword } = validatedFields.data

  const result = await getUser()

  const isMatch = bcryptjs.compare(validatedOldPassword, result?.password as string)

  if (!result || !isMatch) {
    return {
      message: 'Email or password is not exist!',
    }
  }

  const hashedPassword = await bcryptjs.hash(validatedNewPassword, 10)

  // Handle image upload if provided
  let imageUrl = result.image;
  if (imageFile) {
    // In a real application, you would upload the image to a storage service
    // and get back a URL. For this example, we'll use a data URL
    // You would replace this with actual image upload logic
    try {
      // Convert the file to a base64 string
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mimeType = imageFile.type;
      imageUrl = `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error('Error processing image:', error);
      // Keep the existing image if there's an error
    }
  }

  await USER.findByIdAndUpdate(session?.userId, {
    name: validatedName,
    email: validatedEmail,
    password: hashedPassword,
    image: imageUrl
  }, {
    new: true,
    runValidators: true,
  });

  await deleteSession()
  redirect('/signin')
}
