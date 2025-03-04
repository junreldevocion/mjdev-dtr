"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn, formatResponse } from "@/lib/utils"
import { CalendarIcon, Save } from "lucide-react"
import { IDTR } from "@/model/dtrModel"
import { format } from "date-fns"

const FormSchema = z.object({
  timeInOutDate: z.date(),
  timeIn: z.string().min(0, { message: 'Time in should be greater than 00:00' }),
  timeOut: z.string().min(0, { message: 'Time out should be greater than 00:00' }),
  id: z.string().optional()
})

interface DtrFormProps {
  action: string | ((formData: FormData) => void | Promise<void>) | undefined;
  data?: IDTR
}

export function DtrForm({ action, data }: DtrFormProps) {

  const {timeInOutDate, timeIn, timeOut } = formatResponse(data!)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      timeInOutDate:  timeInOutDate,
      timeIn,
      timeOut,
      id: (data?._id as string) ?? ''
    },
  })

  return (
    <Form {...form}>
      <form action={action} className="w-full flex gap-4 flex-col">
        <FormField
          control={form.control}
          name="timeInOutDate"
          render={({ field }) => {
            const { value, onChange } = field
            return <FormItem className="flex flex-col">
              <FormLabel>Select date</FormLabel>
              <Input type="hidden" {...field} value={format(value, 'yyyy-MM-dd')} />
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !value && "text-muted-foreground"
                      )}
                    >
                      {value ? (
                        format(value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Default current date
              </FormDescription>
              <FormMessage />
            </FormItem>

          }}
        />
        <div className="flex w-full flex-col md:flex-row justify-end gap-4">
          <FormField
            control={form.control}
            name="timeIn"
            render={({ field }) => {
              return <FormItem className="flex flex-col w-full">
                <FormLabel>Time in</FormLabel>
                <Input type="time" {...field} onChange={field.onChange} className="w-full" />
                <FormDescription>
                  Default current time
                </FormDescription>
                <FormMessage />
              </FormItem>
            }}
          />
          <FormField
            control={form.control}
            name="timeOut"
            render={({ field }) => {
              return <FormItem className="flex flex-col w-full">
                <FormLabel>Time out</FormLabel>
                <Input type="time" {...field} onChange={field.onChange} />
                <FormDescription>
                  Default time + 8 hours
                </FormDescription>
                <FormMessage />
              </FormItem>

            }}
          />
          <input type="hidden" {...form.register('id')} />
        </div>
        <div>
          <Button type="submit">Submit <Save /></Button>
        </div>
      </form>
    </Form >
  )
}
