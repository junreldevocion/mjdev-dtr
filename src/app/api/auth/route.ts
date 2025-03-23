import { getUser } from "@/lib/dal"

export async function GET() {
  const result = await getUser()

  if (!result) {
    return new Response(null, { status: 401 })
  }
  return Response.json(result)

}