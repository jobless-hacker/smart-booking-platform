"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAccessCode, clearToken } from "@/lib/auth";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/slots", label: "Manage Slots" },
  { href: "/admin/bookings", label: "View Bookings" }
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearToken();
    clearAccessCode();
    router.push("/staff-access");
  }

  return (
    <header className="admin-shell">
      <nav className="admin-nav">
        <p className="admin-logo">Smart Booking Admin</p>
        <div className="admin-links">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "link-pill active" : "link-pill"}
            >
              {link.label}
            </Link>
          ))}
          <button className="danger-btn" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
