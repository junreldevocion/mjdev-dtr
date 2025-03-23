import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { decrypt } from './session'
import USER from '@/model/user.model'
import { connectToMongoDB } from './mongodb'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/signin')
  }

  return { isAuth: true, userId: session.userId }
})

export const getUser = cache(async () => {
  await connectToMongoDB();
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await USER.findById(session?.userId);
    return data
  } catch (error) {
    console.log(error, 'Failed to fetch user')
    return null
  }
})