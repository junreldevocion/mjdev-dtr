'use server'

import { deleteDTR } from "@/app/actions/dtr"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"

const DeleteDTR = ({ id }: { id: string }) => {
  return (
    <form action={deleteDTR}>
      <input
        hidden
        type="text"
        name="id"
        defaultValue={id.toString()}
      />
      <Button className="sm" variant="destructive"><Trash2 /></Button>
    </form>
  )
}

export default DeleteDTR