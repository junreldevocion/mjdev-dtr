'use client'

import { useState } from "react";
import useSWR from "swr";
import { ChevronDown, Settings, LogOut, User } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { fetcher } from "@/lib/utils";
import Image from "next/image";

// Custom loader for data URLs
const dataUrlLoader = ({ src }: { src: string }) => {
  return src;
};

const Navbar = () => {
  const { data } = useSWR('/api/auth', fetcher)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Check if the image is a data URL
  const isDataUrl = (url: string) => {
    return url?.startsWith('data:');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse group"
        >
          <div className="flex flex-col">
            <span className="self-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              MJDEV-DTR
            </span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
              {data?.name}
            </span>
          </div>
        </Link>

        {data?.name && (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {data?.image ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={data.image}
                    alt={data.name}
                    fill
                    className="object-cover"
                    loader={isDataUrl(data.image) ? dataUrlLoader : undefined}
                    unoptimized={isDataUrl(data.image)}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User size={20} className="text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    {data?.image ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={data.image}
                          alt={data.name}
                          fill
                          className="object-cover"
                          loader={isDataUrl(data.image) ? dataUrlLoader : undefined}
                          unoptimized={isDataUrl(data.image)}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User size={24} className="text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{data?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{data?.email}</p>
                    </div>
                  </div>
                </div>
                <ul className="py-2">
                  <li>
                    <Link href="/updateUser">
                      <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Settings size={16} />
                        Update Profile
                      </button>
                    </Link>
                  </li>
                  <li>
                    <form action={logout}>
                      <button
                        type="submit"
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </form>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;