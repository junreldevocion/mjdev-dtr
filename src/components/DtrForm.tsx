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
import { format } from "date-fns"
import { Checkbox } from "./ui/checkbox"
import { CheckboxProps } from "@radix-ui/react-checkbox"
import { IDTR } from "@/model/dtr.model"
import { toast } from "sonner"
import { DTRFormSchema } from "@/lib/definations"



interface DtrFormProps {
  action: (e: z.infer<typeof DTRFormSchema>) => Promise<void>;
  data?: IDTR
}

export function DtrForm({ action, data }: DtrFormProps) {

  const { timeInOutDate, timeIn, timeOut } = formatResponse(data!)

  const form = useForm<z.infer<typeof DTRFormSchema>>({
    resolver: zodResolver(DTRFormSchema),
    defaultValues: {
      timeInOutDate: timeInOutDate,
      timeIn,
      timeOut,
      id: (data?._id as string) ?? '',
      isDoubleTime: false
    },
  })

  const onSubmit = async (data: z.infer<typeof DTRFormSchema>) => {

    const formatData = {
      ...data,
      timeInOutDate: format(data.timeInOutDate, 'yyyy-MM-dd') as unknown as Date
    }

    await action(formatData)

    toast("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex gap-4 flex-col">
        <FormField
          control={form.control}
          name="timeInOutDate"
          render={({ field }) => {
            const { value, onChange } = field
            return <FormItem className="flex flex-col">
              <FormLabel>Select date</FormLabel>
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
                <FormMessage />
              </FormItem>

            }}
          />
          <input type="hidden" {...form.register('id')} />
        </div>
        <div className="items-top flex space-x-2">
          <FormField
            control={form.control}
            name="isDoubleTime"
            render={({ field }) => {
              return <FormItem className="flex flex-row w-full">
                <Checkbox {...field as unknown as CheckboxProps} checked={field.value} onCheckedChange={field.onChange} />
                <FormLabel>Is double time?</FormLabel>
                <FormMessage />
              </FormItem>
            }}
          />
        </div>
        <div>
          <Button type="submit">Submit <Save /></Button>
        </div>
      </form>
    </Form >
  )
}
