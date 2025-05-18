"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarPlus, Users, Calendar, Clock, MapPin, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  timezone: string
  locationPhysical: string
  rsvpDeadline: string
  maxAttendees: number
  createdBy: string
  status: "Scheduled" | "Live" | "Closed"
  createdAt: string
  updatedAt: string
}

export default function HostDashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)

        const token = localStorage.getItem("token")
        if (!token) throw new Error("No authentication token found")

        const response = await fetch("https://eventpluse.onrender.com/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }

        const data = await response.json()
        setEvents(data)
      } catch (error: any) {
        console.error("Error fetching events:", error.message || error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your events. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [toast])
const handleStatusChange = async (eventId: string, newStatus: string) => {
  try {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("No auth token")

    const response = await fetch(`https://eventpluse.onrender.com/api/events/${eventId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })

    if (!response.ok) {
      throw new Error("Failed to update event status")
    }

    // Update local state after successful status change
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === eventId ? { ...event, status: newStatus as Event["status"] } : event
      )
    )

    toast({
      title: "Status Updated",
      description: `Event marked as ${newStatus}`,
    })
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Error updating status",
      description: error.message || "Something went wrong",
    })
  }
}

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "bg-green-500 animate-pulse"
      case "Scheduled":
        return "bg-blue-500"
      case "Closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const upcomingEvents = events.filter((event) => event.status === "Scheduled")
  const liveEvents = events.filter((event) => event.status === "Live")

  return (
    <DashboardLayout userRole="host">
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Host Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your events, track RSVPs, and collect feedback
            </p>
          </div>
          <Link href="/dashboard/host/events/create">
            <Button>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Event Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingEvents.length} upcoming
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Max Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.reduce((acc, event) => acc + event.maxAttendees, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Now</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{liveEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                {liveEvents.length > 0 ? "Events currently live" : "No live events"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Event Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Events</h2>
            <Link href="/dashboard/host/events">
              <Button variant="ghost" className="gap-1">
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {events.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Calendar className="mb-2 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No events found</h3>
                <p className="text-muted-foreground">
                  Create your first event to get started
                </p>
                <Link href="/dashboard/host/events/create" className="mt-4">
                  <Button>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event._id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(event.status)} text-white`} variant="outline">
                          {event.status}
                        </Badge>
                        <div className="flex flex-col gap-2 w-full">
                         <select
                          className="w-full rounded-md border px-3 py-2 text-sm"
                          value={event.status}
                          onChange={(e) => handleStatusChange(event._id, e.target.value)}
                        >
                           <option value="Select Status" disabled>Select Status</option>     
                           <option value="Scheduled">Scheduled</option>
                          <option value="Live">Live</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{event.maxAttendees}/{event.maxAttendees}</span>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(event.date).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="line-clamp-1">{event.locationPhysical}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 p-4">
                    <div className="flex w-full justify-between flex-wrap gap-2">
                      
                      {event.status === "Live" && (
                        <Link href={`/dashboard/host/events/${event._id}/feedback`}>
                          <Button size="sm">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Manage Live
                          </Button>
                        </Link>
                      )}
                      {event.status === "Scheduled" && (
                        <Link href={`/dashboard/host/events/${event._id}/rsvps`}>
                          <Button size="sm">
                            <Users className="mr-2 h-4 w-4" />
                            Start Checkin's
                          </Button>
                        </Link>
                      )}
                      {event.status === "Closed" && (
                        <Link href={`/dashboard/host/events/${event._id}/analytics`}>
                          <Button size="sm" variant="outline">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            View Summary
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}