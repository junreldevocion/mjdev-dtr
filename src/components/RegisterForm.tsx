'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"


export const FormSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(2, { message: 'Name must be at least 2 characters long' }).trim(),
  email: z.string({ required_error: 'Email is required' }).email({ message: 'Please enter a valid email' }).trim(),
  password: z.string({ required_error: 'Password is required' }).min(4, { message: 'Password must be at least 4 characters long' }).trim()
})

const RegisterForm = () => {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data, 'shit naman')
  }


  return (
    <Card className="flex flex-col gap-6">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 flex-col">
            <FormField name="name" control={form.control} render={({ field }) => {
              return <FormItem>
                <FormLabel>Name</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            }}>
            </FormField>
            <FormField name="email" control={form.control} render={({ field }) => {
              return <FormItem>
                <FormLabel>Email</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            }}>
            </FormField>
            <FormField name="password" control={form.control} render={({ field }) => {
              return <FormItem>
                <FormLabel>Password</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            }}>
            </FormField>
          </form>
        </Form>
      </CardContent>
    </Card >

  )
}

export default RegisterForm