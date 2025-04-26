import { createDTR } from "@/app/actions/dtr";
import { DtrForm } from "@/components/DtrForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

export default async function AddDTR() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto pt-8 pb-12 px-4">
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold">Add Daily Time Record</h1>
          </div>

          <p className="text-gray-500 dark:text-gray-400">
            Record your daily time entry by filling out the form below
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <DtrForm action={createDTR} />
        </div>
      </div>
    </div>
  );
}
