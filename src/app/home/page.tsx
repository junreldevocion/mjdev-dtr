import { Dialog } from "@/components/ui/dialog";
import { Plus, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { formatTime, totalRenderedTime } from "@/lib/utils";
import DTRTable from "@/components/DTRTable";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { MINUTES_WORKED } from "@/constant";
import DTR, { IDTR } from "@/model/dtr.model";
import { verifySession } from "@/lib/dal";
import { addDays, format } from "date-fns";
import { ojtHours } from "@/utils/ojtHours";

export default async function Home() {
  const OJT_HOURS = ojtHours()
  const session = await verifySession()
  const dtrList = await DTR.find({ userId: { $in: [session.userId] } }).sort({ timeInOutDate: -1 }) as unknown as IDTR[];
  const { hours, minutes } = totalRenderedTime(dtrList)
  const calculatedRemainingHours = Math.floor((((OJT_HOURS - hours) * MINUTES_WORKED) - minutes) / MINUTES_WORKED);
  const calculatedRemainingMinutes = MINUTES_WORKED - minutes
  const remainingDays = Math.ceil(calculatedRemainingHours / 8)
  const formattedTime = formatTime(hours.toString(), minutes.toString());
  const isOJTCompleted = hours >= OJT_HOURS;
  const remainingHours = !isOJTCompleted ? `${calculatedRemainingHours}:${calculatedRemainingMinutes}` : "0:0";
  const remainingDaysText = !isOJTCompleted ? `${remainingDays}` : "0";
  const href = isOJTCompleted ? "#" : "/dtr/add";

  // Calculate expected end date
  const today = new Date();
  const expectedEndDate = !isOJTCompleted ? addDays(today, remainingDays) : today;
  const formattedEndDate = format(expectedEndDate, 'MMMM dd, yyyy');

  return (
    <>
      <div className="max-w-screen-xl m-auto pt-8 p-4 pb-8">
        <Dialog>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Daily Time Record</h1>
              {isOJTCompleted && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-lg font-semibold">OJT Completed!</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Hours Rendered</p>
                    <p className="text-xl font-semibold">{formattedTime}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Days</p>
                    <p className="text-xl font-semibold">{remainingDaysText} days</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Hours</p>
                    <p className="text-xl font-semibold">{remainingHours}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Required Hours</p>
                    <p className="text-xl font-semibold">{OJT_HOURS} hrs</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Expected End Date</p>
                    <p className="text-xl font-semibold">{formattedEndDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href={href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${isOJTCompleted
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  } transition-colors`}
              >
                Add DTR
                <Plus className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Dialog>
        <div className="mt-8">
          <DTRTable dtrList={dtrList} />
        </div>
        <Toaster position="top-right" />
      </div>
    </>
  );
}
