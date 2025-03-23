'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { UpdateUserFormSchema } from "@/lib/definations"
import { updateUser } from "@/app/actions/auth"
import { useState } from "react"
import Link from "next/link"
import { IUser } from "@/model/user.model"

const UpdateUserForm = ({ name, email }: IUser) => {

  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof UpdateUserFormSchema>>({
    resolver: zodResolver(UpdateUserFormSchema),
    defaultValues: {
      name,
      email,
      oldPassword: '',
      newPassword: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof UpdateUserFormSchema>) => {
    setLoading(true)
    await updateUser(data)
    setLoading(false)
  }


  return (
    <Card className="flex flex-col gap-6">
      <CardHeader>
        <CardTitle className="text-2xl">Update account</CardTitle>
        <CardDescription>
          Update your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 flex-col">
            <FormField name="name" control={form.control} render={({ field }) => {
              console.log(field, 'field')
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
            <FormField name="oldPassword" control={form.control} render={({ field }) => {
              return <FormItem>
                <FormLabel>Old password</FormLabel>
                <Input type="password" {...field} />
                <FormMessage />
              </FormItem>
            }}>
            </FormField>
            <FormField name="newPassword" control={form.control} render={({ field }) => {
              return <FormItem>
                <FormLabel>New password</FormLabel>
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

export default UpdateUserForm