'use server'

import { deleteDTR } from "@/app/actions"
import { Button } from "./ui/button"

const DeleteDTR = async ({ id }: { id: string }) => {
  return (
    <form action={deleteDTR}>
      <input
        hidden
        type="text"
        name="id"
        defaultValue={id.toString()}
      />
      <Button className="sm">Delete</Button>
    </form>
  )
}

export default DeleteDTR