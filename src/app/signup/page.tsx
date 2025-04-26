import RegisterForm from "@/components/RegisterForm";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-4 px-4 sm:px-6">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}
