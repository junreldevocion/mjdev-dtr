'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { UpdateUserFormSchema } from "@/lib/definations"
import { updateProfile, updateUser } from "@/app/actions/auth"
import { useState } from "react"
import Link from "next/link"
import { IUser } from "@/model/user.model"
import { User, Mail, Lock, ArrowLeft, Camera, Image as ImageIcon, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { updateUserProfile } from '@/redux/features/userSlice';
import { useAppDispatch } from "@/redux/store"

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Custom loader for data URLs
const dataUrlLoader = ({ src }: { src: string }) => {
  return src;
};

const UpdateUserForm = ({ name, email, image }: IUser) => {
  const dispatch = useAppDispatch();
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

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setImageLoading(true)
    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      await updateProfile(formData)
      dispatch(updateUserProfile({ image: previewImage }))
      toast.success("Profile picture updated successfully")
    } catch (error) {
      toast.error("Failed to update profile picture")
      console.error(error)
    } finally {
      setImageLoading(false)
    }
  }

  const onSubmit = async (data: z.infer<typeof UpdateUserFormSchema>) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    if (data.oldPassword) formData.append('oldPassword', data.oldPassword)
    if (data.newPassword) formData.append('newPassword', data.newPassword)

    try {
      await updateUser(formData)
      dispatch(updateUserProfile({
        name: data.name,
        email: data.email
      }))
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Button
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Picture Section */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Profile Picture</CardTitle>
              </div>
              <CardDescription>
                Update your profile picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-lg">
                  {imageLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
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
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {imageError && (
                  <p className="text-sm text-red-500 text-center">{imageError}</p>
                )}

                <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                  <div className="relative w-full">
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
                      className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors ${imageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

                  {imageFile && (
                    <Button
                      onClick={handleImageUpload}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={imageLoading}
                    >
                      {imageLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Upload Photo"
                      )}
                    </Button>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Max file size: 5MB. Supported formats: JPEG, PNG, WebP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Details Section */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Account Details</CardTitle>
              </div>
              <CardDescription>
                Update your account information and password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
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

                    <div className="pt-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
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
                    disabled={loading}
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
    </div>
  )
}

export default UpdateUserForm