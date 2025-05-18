import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CalendarClock, CheckCircle, MessageSquare, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <CalendarClock className="h-6 w-6" />
            <span>EventPulse</span>
          </Link>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/auth/login" className="text-sm font-medium hover:underline underline-offset-4">
              Login
            </Link>
            <Link href="/auth/signup" className="text-sm font-medium hover:underline underline-offset-4">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Real-Time RSVP & Feedback Platform
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Track attendance, collect on-the-fly feedback, and measure audience sentiment during events—whether
                    virtual or in-person.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button size="lg" variant="outline">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="EventPulse Dashboard"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  src="/placeholder.svg?height=400&width=600"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to manage your events effectively
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">RSVP & Check-In</h3>
                    <p className="text-muted-foreground">
                      Manage RSVPs until deadline and enable check-ins on event day with real-time attendee tracking.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Live Feedback Stream</h3>
                    <p className="text-muted-foreground">
                      Collect real-time comments and emoji reactions during events with auto-updating feed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="flex items-start gap-4">
                  <CalendarClock className="h-8 w-8 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Event Management</h3>
                    <p className="text-muted-foreground">
                      Create and manage events with detailed information and real-time status updates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Analytics & Reporting</h3>
                    <p className="text-muted-foreground">
                      View post-event summaries with attendance metrics, feedback analysis, and engagement insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Get Started Today</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join EventPulse and transform how you manage your events
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/signup">
                  <Button size="lg">Sign Up Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:justify-between md:py-0">
          <div className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} EventPulse. All rights reserved.
          </div>
          <nav className="flex items-center justify-center gap-4 text-sm md:justify-end md:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
