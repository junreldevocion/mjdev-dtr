'use client'

import { CircleUserRound } from "lucide-react"
import Link from "next/link";
// import { useState } from "react"
// import { Button } from "./ui/button";

const Navbar = () => {
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex flex-col">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">MJDEV-DTR</span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Jane Lo-ay</span>
          </div>
        </Link>
        <CircleUserRound size={24} className="cursor-pointer" />
      </div>
    </nav>
  )
}

export default Navbar