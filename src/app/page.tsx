


import { Dialog } from "@/components/ui/dialog";
import DialogForm from "@/components/DialogForm";
import { Plus } from "lucide-react";
import DTR, { IDTR } from "@/model/dtrModel";
import { calculateTotalHours } from "@/lib/utils";
import DTRTable from "@/components/DTRTable";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default async function Home() {

  const dtrList: IDTR[] = await DTR.find();

  const totalHours = calculateTotalHours(dtrList)

  return (
    <>
      <div className="max-w-screen-xl m-auto pt-20 p-4 pb-8">
        <Dialog>
          <div className="flex justify-between items-center pb-4 flex-wrap gap-4">
            <h1 className="text-2xl font-semibold">Daily Time Record</h1>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total hours rendered: {totalHours}</h4>
          </div>
          <Link href="/add" className=""><Button variant="outline">Add DTR<Plus /></Button></Link>
          <DialogForm />
        </Dialog>
        <DTRTable dtrList={dtrList} />
        <Toaster position="top-right" />
      </div>
    </>
  );
}
