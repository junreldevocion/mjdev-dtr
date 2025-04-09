


import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { formatTime, totalRenderedTime } from "@/lib/utils";
import DTRTable from "@/components/DTRTable";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { MINUTES_WORKED, OJT_HOURS } from "@/constant";
import DTR, { IDTR } from "@/model/dtr.model";
import { verifySession } from "@/lib/dal";


export default async function Home() {

  const session = await verifySession()

  const dtrList = await DTR.find({ userId: session?.userId }).sort({ timeInOutDate: -1 }) as unknown as IDTR[];


  const { hours, minutes } = totalRenderedTime(dtrList)

  const calculatedRemainingHours = Math.floor((((OJT_HOURS - hours) * MINUTES_WORKED) - minutes) / MINUTES_WORKED);

  const calculatedRemainingMinutes = MINUTES_WORKED - minutes

  const remainingDays = Math.ceil(calculatedRemainingHours / 8)

  const formattedTime = formatTime(hours.toString(), minutes.toString());

  const isOJTCompleted = hours >= OJT_HOURS;

  const remainingHours = !isOJTCompleted ? `${calculatedRemainingHours}:${calculatedRemainingMinutes}` : "0:0";
  const remainingDaysText = !isOJTCompleted ? `${remainingDays}` : "0";
  const href = isOJTCompleted ? "#" : "/dtr/add";
  const buttonTextColor = isOJTCompleted ? "text-gray-600" : "text-black";

  return (
    <>
      <div className="max-w-screen-xl m-auto pt-20 p-4 pb-8">
        <Dialog>
          <div className="flex justify-between pb-4 flex-col gap-4">
            <h1 className="text-2xl font-semibold">Daily Time Record</h1>
            {isOJTCompleted && (
              <h1 className="text-2xl font-semibold text-green-600">Congratulations! You have completed your OJT hours!</h1>
            )}
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total hours need to render: <span className="font-medium text-gray-700">{OJT_HOURS}</span></h2>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total hours rendered: <span className="font-medium text-gray-700">{formattedTime}</span></h2>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining hours: <span className="font-medium text-gray-700">{`${remainingHours}`}</span></h2>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining days: <span className="font-medium text-gray-700">{remainingDaysText}</span></h2>
          </div>
          <Link href={href} className={`flex flex-row ${buttonTextColor}`}>Add DTR<Plus /></Link>
        </Dialog>
        <DTRTable dtrList={dtrList} />
        <Toaster position="top-right" />
      </div>
    </>
  );
}
