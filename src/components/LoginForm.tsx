'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { SigninFormSchema } from "@/lib/definations"
import { signin } from "@/app/actions/auth"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

const LoginForm = () => {

  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof SigninFormSchema>) => {
    setLoading(true)
    const result = await signin(data)
    toast.error(result.message)
    setLoading(false)
  }


  return (
    <Card className="flex flex-col gap-6">
      <CardHeader>
        <CardTitle className="text-2xl">Signin</CardTitle>
        <CardDescription>
          Signin your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 flex-col">
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
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
            <Button type="submit" variant="default" disabled={loading}>Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card >

  )
}

export default LoginForm