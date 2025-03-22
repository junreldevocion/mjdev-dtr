


import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {  formatTime, totalRenderedTime } from "@/lib/utils";
import DTRTable from "@/components/DTRTable";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OJT_HOURS } from "@/constant";
import DTR, { IDTR } from "@/model/dtr.model";


export default async function Home() {

  const dtrList = await DTR.find().sort({ timeInOutDate: -1 }) as unknown as IDTR[];
 

  const { hours, minutes } = totalRenderedTime(dtrList)

  const calculatedRemainingHours = OJT_HOURS - hours;

  const remainingDays = Math.floor(calculatedRemainingHours / 8)

  const formattedTime = formatTime(hours.toString(), minutes.toString());

  return (
    <>
      <div className="max-w-screen-xl m-auto pt-20 p-4 pb-8">
        <Dialog>
          <div className="flex justify-between pb-4 flex-col md:flex-row gap-4">
            <h1 className="text-2xl font-semibold">Daily Time Record</h1>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total hours need to render: <span className="font-medium text-gray-700">{OJT_HOURS}</span></h4>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total hours rendered: <span className="font-medium text-gray-700">{formattedTime}</span></h4>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining hours: <span className="font-medium text-gray-700">{`${calculatedRemainingHours}:${minutes}`}</span></h4>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining days: <span className="font-medium text-gray-700">{remainingDays}</span></h4>
          </div>
          <Link href="/dtr/add" className=""><Button variant="outline">Add DTR<Plus /></Button></Link>
        </Dialog>
        <DTRTable dtrList={dtrList} />
        <Toaster position="top-right" />
      </div>
    </>
  );
}
