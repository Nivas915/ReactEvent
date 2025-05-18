"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, ArrowUpRight, Search, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

// Event type definition
interface Event {
  _id: string // changed from id to _id to match your usage
  title: string
  description: string
  date: string // ISO string expected
  location: string
  status: "Scheduled" | "Live" | "Closed"
  isRSVPed: boolean
  isCheckedIn: boolean
}
export default function AttendeeDashboardPage() {
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [myEventsData, setMyEventsData] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No authentication token found")
        }

        // Fetch RSVP'd events
        const myEventsResponse = await fetch("https://eventpluse.onrender.com/api/events/events-mine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!myEventsResponse.ok) {
          throw new Error("Failed to fetch RSVP'd events")
        }
        const myEventsData: Event[] = await myEventsResponse.json()
        setMyEvents(myEventsData)

        // Fetch all events
        const allEventsResponse = await fetch("https://eventpluse.onrender.com/api/events/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!allEventsResponse.ok) {
          throw new Error("Failed to fetch all events")
        }
        const allEventsData: Event[] = await allEventsResponse.json()

        // Filter out events that are already RSVP'd (to avoid duplicates)
        const filteredAllEvents = allEventsData.filter(
          (event) => !myEventsData.some((myEvent) => myEvent._id === event._id),
        )
        setAllEvents(filteredAllEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load events. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [toast])

  const getStatusColor = (status: Event["status"]) => {
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

  const handleRSVP = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`https://eventpluse.onrender.com/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to RSVP for event ")
      }

      // Find the event in allEvents and move it to myEvents
      const updatedEventIndex = allEvents.findIndex((event) => event._id === eventId)
      if (updatedEventIndex !== -1) {
        const updatedEvent = { ...allEvents[updatedEventIndex], isRSVPed: true }
        setMyEvents((prev) => [...prev, updatedEvent])
        setAllEvents((prev) => prev.filter((event) => event._id !== eventId))
      }

      toast({
        title: "RSVP Successful",
        description: "You have successfully RSVPed for this event.",
      })
    } catch (error) {
      console.error("Error RSVPing for event:", error)
      toast({
        variant: "destructive",
        title: "RSVP Failed since the rsvp deadline is passed",
        description: "Failed to RSVP for this event . Please try again.",
      })
    }
  }

  // Filter events based on search query
  const filteredAllEvents = allEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const myUpcomingEvents = myEvents.filter((event) => event.status === "Scheduled")
  const myLiveEvents = myEvents.filter((event) => event.status === "Live")
  const myPastEvents = myEvents.filter((event) => event.status === "Closed")

  // Check if an event is happening today (for check-in button)
  const isEventToday = (eventDate: string) => {
    const today = new Date()
    const date = new Date(eventDate)
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <DashboardLayout userRole="attendee">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendee Dashboard</h1>
          <p className="text-muted-foreground">Discover events, manage your RSVPs, and provide feedback</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myEvents.length}</div>
              <p className="text-xs text-muted-foreground">{myUpcomingEvents.length} upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Now</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myLiveEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                {myLiveEvents.length > 0 ? "Events currently live" : "No live events"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Past Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myPastEvents.length}</div>
              <p className="text-xs text-muted-foreground">Events you've attended</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* My Events Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">My Events</h2>
                <Link href="/dashboard/attendee/events">
                  <Button variant="ghost" className="gap-1">
                    View all
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {myEvents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <Calendar className="mb-2 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No events found</h3>
                    <p className="text-muted-foreground">RSVP to events to see them here</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {myEvents.map((event) => (
                    <Card key={event._id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge className={`${getStatusColor(event.status)} text-white`} variant="outline">
                            {event.status}
                          </Badge>
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
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="border-t bg-muted/50 p-4">
                        <div className="flex w-full justify-between">
                          {event.status === "Live" && event.isCheckedIn && (
                            <Link href={`/dashboard/attendee/events/${event._id}/feedback`}>
                              <Button size="sm">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Give Feedback
                              </Button>
                            </Link>
                          )}
                          {event.status === "Scheduled" && (
                            <Button size="sm" variant="outline">
                              <Calendar className="mr-2 h-4 w-4" />
                              Add to Calendar
                            </Button>
                          )}
                          {event.status === "Closed" && (
                            <Button size="sm" variant="outline">
                              Thanks for Attending
                            </Button>
                          )}
                        </div>
                        <Button>RSVP'ed</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Discover Events Section */}
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold">Discover Events</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search events..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredAllEvents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <Search className="mb-2 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No events found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? "Try a different search term" : "Check back later for new events"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredAllEvents.map((event) => (
                    <Card key={event._id ?? `${event.title}-${event.date}`} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge className={`${getStatusColor(event.status)} text-white`} variant="outline">
                            {event.status}
                          </Badge>
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
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="border-t bg-muted/50 p-4">
                        <div className="flex w-full justify-between">
                          {event.status === "Scheduled" && (
                            <Button size="sm" onClick={() => handleRSVP(event._id)}>
                              RSVP Now
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
