"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { CalendarClock, LayoutDashboard, Calendar, Users, BarChart3, Settings, LogOut, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: "host" | "attendee"
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Check for JWT token
    const token = localStorage.getItem("token")
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to access this page.",
      })
      router.push("/auth/login")
    }
  }, [router, toast])

  if (!isMounted) {
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/auth/login")
  }

  const navItems = [
    {
      title: "Dashboard",
      href: `/dashboard/${userRole}`,
      icon: LayoutDashboard,
    },
    
    ...(userRole === "host"
      ? [
          {
      title: "Analytics",
      href: `/dashboard/${userRole}/analytics`,
      icon: BarChart3,
    },
        ]
      : []),
    
      
    
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 sm:max-w-sm">
            <nav className="grid gap-2 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <CalendarClock className="h-6 w-6" />
                <span>EventPulse</span>
              </Link>
              <div className="mt-8 grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                      pathname === item.href ? "bg-muted text-primary" : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start gap-2 rounded-lg px-3 py-2 hover:bg-muted"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <CalendarClock className="h-6 w-6" />
          <span>EventPulse</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
            <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground">
                {userRole === "host" ? "H" : "A"}
              </span>
            </span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <div className="py-2">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                {userRole === "host" ? "Host Dashboard" : "Attendee Dashboard"}
              </h2>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                      pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 hover:bg-muted"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
