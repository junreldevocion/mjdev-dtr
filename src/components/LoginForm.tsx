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
import { Mail, Lock, LogIn } from "lucide-react"

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
    <Card className="border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-1 pt-4">
        <div className="flex items-center justify-center mb-0">
          <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <CardTitle className="text-lg sm:text-2xl text-center mt-1">Welcome Back</CardTitle>
        <CardDescription className="text-center text-xs sm:text-sm mt-0">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-1 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-2">
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
                      placeholder="Enter your password"
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default LoginForm