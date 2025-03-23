'use client'

import { useState } from "react";
import useSWR from "swr";


import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { fetcher } from "@/lib/utils";

const Navbar = () => {

  const { data } = useSWR('/api/auth', fetcher)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex flex-col">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">MJDEV-DTR</span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{data?.name}</span>
          </div>
        </Link>

        {data?.name && <div className="relative">
          <CircleUserRound
            size={24}
            className="cursor-pointer"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg dark:bg-gray-800">
              <ul className="py-1">
                <li>
                  <Link href="/updateUser">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 w-full text-left"
                    >
                      Update
                    </button>
                  </Link>

                </li>
                <li>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 w-full text-left"
                    >
                      Logout
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          )}
        </div>}
      </div>
    </nav>
  );
};

export default Navbar;