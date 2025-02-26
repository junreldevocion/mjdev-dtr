import Navbar from "@/components/Navbar";
import List from "@/components/List";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl m-auto pt-50 p-4">
        <Button variant="outline" className="">Add</Button>
        <List />
      </div>

    </>
  );
}
