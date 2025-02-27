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
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { addHours, format } from "date-fns"
import { createDTR } from "@/app/actions"

const FormSchema = z.object({
  timeInOutDate: z.date(),
  timeIn: z.string().min(0, { message: 'Time in should be greater than 00:00' }),
  timeOut: z.string().min(0, { message: 'Time out should be greater than 00:00' }),
  overtime: z.string().optional(),
})

export function DtrForm() {
  const currentDate = new Date()
  const timeIn = format(currentDate, 'HH:mm');
  const timeOutDateTime = addHours(currentDate, 8);
  const timeOut = format(timeOutDateTime, 'HH:mm');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      timeInOutDate: currentDate,
      timeIn: timeIn,
      timeOut: timeOut,
      overtime: '',
    },
  })

  return (
    <Form {...form}>
      <form action={createDTR} className="w-full flex gap-4 flex-col">
        <FormField
          control={form.control}
          name="timeInOutDate"
          render={({ field }) => {
            const { value, onChange } = field
            value.setHours(0)
            value.setMinutes(0)
            value.setSeconds(0)
            return <FormItem className="flex flex-col">
              <FormLabel>Select date</FormLabel>
              <Input type="hidden" {...field} value={value.toISOString()} />
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
              console.log(field, 'field')
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
        </div>
        <FormField
          control={form.control}
          name="overtime"
          render={({ field }) => {
            return <FormItem className="flex flex-col w-full">
              <FormLabel>Overtime</FormLabel>
              <Input type="time" {...field} onChange={field.onChange} className="w-full" />
              <FormMessage />
            </FormItem>
          }}
        />
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form >
  )
}
