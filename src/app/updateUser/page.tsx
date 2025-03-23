



import UpdateUserForm from "@/components/UpdateUserForm";
import { getUser } from "@/lib/dal";
export default async function Page() {

  const result = await getUser()

  const jsonData = JSON.parse(JSON.stringify(result))

  return (
    <div className="flex w-full p-6 m-auto mt-10">
      <div className="w-full max-w-sm m-auto">
        <UpdateUserForm {...jsonData} />
      </div>
    </div>
  )
}
