
import Navbar from "@/components/Navbar";
import List from "@/components/DTRTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DialogForm from "@/components/DialogForm";


export default function Home() {
  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl m-auto pt-20 p-4">
        <Dialog>
          <DialogTrigger asChild >
            <Button variant="outline" className="">Add DTR</Button>
          </DialogTrigger>
          <DialogForm />
        </Dialog>
        <List />
      </div>
    </>
  );
}
