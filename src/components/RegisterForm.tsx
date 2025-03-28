'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { SignupFormSchema } from "@/lib/definations"
import { signup } from "@/app/actions/auth"
import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

const RegisterForm = () => {

  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof SignupFormSchema>) => {
    setLoading(true)

    const result = await signup(data)
    toast.error(result.message)
    setLoading(false)
  }


  return (
    <Card className="flex flex-col gap-6">
      <CardHeader>
        <CardTitle className="text-2xl">Signup</CardTitle>
        <CardDescription>
          Signup your account
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
                <Input type="password" {...field} />
                <FormMessage />
              </FormItem>
            }}>
            </FormField>
            {/* <FormField name="confPassword" control={form.control} render={({ field }) => {
              return <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <Input type="password" {...field}  />
                <FormMessage />
              </FormItem>
            }}>
            </FormField> */}
            <div className="text-center text-sm">
              Already have an account? {" "}
              <Link href="/signin" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
            <Button type="submit" variant="default" disabled={loading}>Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card >

  )
}

export default RegisterForm