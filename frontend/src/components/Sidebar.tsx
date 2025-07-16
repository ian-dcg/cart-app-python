// src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg ${
        isActive
          ? "bg-blue-100 text-blue-600"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
};

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-10">Cart App</h1>
      <nav className="flex-1 space-y-2">
        <NavLink href="/products">Shopping List</NavLink>
        <NavLink href="/products/register">Item Registration</NavLink>
      </nav>
      <div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
