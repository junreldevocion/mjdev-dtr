// import { getUser } from "@/lib/dal"
import { connectToMongoDB } from "@/lib/mongodb";
import { decrypt } from "@/lib/session"
import USER from "@/model/user.model"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function GET() {
  await connectToMongoDB();
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/signin')
  }

  try {
    const data = await USER.findById(session?.userId);
    return Response.json({ data }, { status: 200 })
  } catch (error) {
    console.log(error, 'Failed to fetch user')
    return Response.json({ error }, { status: 500 })
  }


}