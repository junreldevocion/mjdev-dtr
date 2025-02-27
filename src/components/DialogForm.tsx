
import { DtrForm } from "./DtrForm"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "./ui/dialog"

const DialogForm = () => {
  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Input your time.</DialogTitle>
          <DialogDescription>
            Please input yout time in and time out
          </DialogDescription>
        </DialogHeader>
        <DtrForm />
      </DialogContent>
    </>

  )
}

export default DialogForm