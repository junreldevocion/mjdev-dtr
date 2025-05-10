import UpdateUserForm from "@/components/UpdateUserForm";
import { getUser } from "@/lib/dal";

export default async function Page() {
  const result = await getUser()
  const jsonData = JSON.parse(JSON.stringify(result))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-4 px-4 sm:px-6">
      <div className="w-full">
        <UpdateUserForm {...jsonData} />
      </div>
    </div>
  )
}
