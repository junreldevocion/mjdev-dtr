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
import { User, Mail, Lock, UserPlus } from "lucide-react"

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-2 px-2 sm:py-8 sm:px-6">
      <div className="w-full max-w-md">
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-1 pt-4">
            <div className="flex items-center justify-center mb-0">
              <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-lg sm:text-2xl text-center mt-1">Create Account</CardTitle>
            <CardDescription className="text-center text-xs sm:text-sm mt-0">
              Sign up to start tracking your time
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1 pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <div className="space-y-2">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1 text-xs">
                          <User className="w-3 h-3 text-gray-500" />
                          Name
                        </FormLabel>
                        <Input
                          {...field}
                          className="bg-white dark:bg-gray-800 h-8 text-sm"
                          placeholder="Enter your name"
                        />
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1 text-xs">
                          <Mail className="w-3 h-3 text-gray-500" />
                          Email
                        </FormLabel>
                        <Input
                          {...field}
                          className="bg-white dark:bg-gray-800 h-8 text-sm"
                          placeholder="Enter your email"
                        />
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1 text-xs">
                          <Lock className="w-3 h-3 text-gray-500" />
                          Password
                        </FormLabel>
                        <Input
                          type="password"
                          {...field}
                          className="bg-white dark:bg-gray-800 h-8 text-sm"
                          placeholder="Create a password"
                        />
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 mt-1 text-sm"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RegisterForm