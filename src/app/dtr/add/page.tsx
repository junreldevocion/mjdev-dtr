import { createDTR } from "@/app/actions";
import { DtrForm } from "@/components/DtrForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AddDTR() {
  return (
    <>
      <div className="max-w-3xl m-auto pt-15 pb-8 flex flex-col gap-4 px-4">
        <Link href="/"><Button variant="link" className="text-left"><ArrowLeft /> Back</Button></Link>
        <h1 className="text-2xl font-semibold">Add Daily Time Record</h1>
        <h4 className="font-medium tracking-tight text-sm float-left xl:float-end">Fill up the form below</h4>
        <DtrForm action={createDTR}  />
      </div>
    </>
  );
}
