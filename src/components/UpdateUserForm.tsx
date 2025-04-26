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
import { User, Mail, Lock, ArrowLeft, Camera, Image as ImageIcon, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Custom loader for data URLs
const dataUrlLoader = ({ src }: { src: string }) => {
  return src;
};

const UpdateUserForm = ({ name, email, image }: IUser) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string | null>(image || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof UpdateUserFormSchema>>({
    resolver: zodResolver(UpdateUserFormSchema),
    defaultValues: {
      name,
      email,
      oldPassword: '',
      newPassword: ''
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null)
    const file = e.target.files?.[0]

    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setImageError("Image size should be less than 5MB")
      return;
    }

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Only JPEG, PNG and WebP images are allowed")
      return;
    }

    setImageLoading(true)
    setImageFile(file)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
      setImageLoading(false)
    }
    reader.onerror = () => {
      setImageError("Failed to load image")
      setImageLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setPreviewImage(null)
    setImageFile(null)
    setImageError(null)
  }

  const onSubmit = async (data: z.infer<typeof UpdateUserFormSchema>) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    if (data.oldPassword) formData.append('oldPassword', data.oldPassword)
    if (data.newPassword) formData.append('newPassword', data.newPassword)
    if (imageFile) formData.append('image', imageFile)

    try {
      await updateUser(formData)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Check if the image is a data URL
  const isDataUrl = (url: string) => {
    return url.startsWith('data:');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Update Profile</CardTitle>
            </div>
            <CardDescription>
              Update your account information, profile picture, and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6">
                  {/* Profile Picture Upload */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                      {imageLoading ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                      ) : previewImage ? (
                        <>
                          <Image
                            src={previewImage}
                            alt="Profile"
                            fill
                            className="object-cover"
                            loader={isDataUrl(previewImage) ? dataUrlLoader : undefined}
                            unoptimized={isDataUrl(previewImage)}
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {imageError && (
                      <p className="text-sm text-red-500">{imageError}</p>
                    )}

                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                          id="profile-image"
                          disabled={imageLoading}
                        />
                        <label
                          htmlFor="profile-image"
                          className={`flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors ${imageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {imageLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            {imageLoading ? "Processing..." : "Change Photo"}
                          </span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Max file size: 5MB. Supported formats: JPEG, PNG, WebP
                      </p>
                    </div>
                  </div>

                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          Name
                        </FormLabel>
                        <Input
                          {...field}
                          className="bg-white dark:bg-gray-800"
                          placeholder="Enter your name"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          Email
                        </FormLabel>
                        <Input
                          {...field}
                          className="bg-white dark:bg-gray-800"
                          placeholder="Enter your email"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Change Password</h3>

                    <FormField
                      name="oldPassword"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-500" />
                            Current Password
                          </FormLabel>
                          <Input
                            type="password"
                            {...field}
                            className="bg-white dark:bg-gray-800"
                            placeholder="Enter your current password"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="newPassword"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-500" />
                            New Password
                          </FormLabel>
                          <Input
                            type="password"
                            {...field}
                            className="bg-white dark:bg-gray-800"
                            placeholder="Enter your new password"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading || imageLoading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UpdateUserForm