"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Heart, ThumbsUp, ThumbsDown, AlertCircle, User, Pin, Flag, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { LiveBadge } from "@/components/ui/live-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Event type definition
interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: "Live" | "Scheduled" | "Closed"
  rsvpCount: number
  checkedInCount: number
}

// Feedback type definition
interface FeedbackItem {
  id: string
  content: string
  emoji: string
  timestamp: string
  user: string
  isPinned: boolean
  isFlagged: boolean
}

export default function HostLiveFeedbackPage() {
  const params = useParams()
  const eventId = params.eventid as string
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({})

  // Fetch feedback data with auto-refresh
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No authentication token found")
        }

        // Fetch event details
        // In a real app, you would have an endpoint for this
        const mockEvent = {
          id: eventId,
          title: "Product Launch Webinar",
          description: "Unveiling our new product line with live Q&A",
          date: new Date().toISOString(),
          location: "Virtual (Zoom)",
          status: "Live" as const,
          rsvpCount: 85,
          checkedInCount: 72,
        }

        setEvent(mockEvent)
      } catch (error) {
        console.error("Error fetching event data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event data. Please try again later.",
        })
      }
    }

    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No authentication token found")
        }

        // Fetch feedback data
        const response = await fetch(`/api/events/${eventId}/feedback`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch feedback data")
        }

        const data = await response.json()

        // Add isPinned and isFlagged properties if they don't exist
        const processedData = data.map((item: any) => ({
          ...item,
          isPinned: item.isPinned || false,
          isFlagged: item.isFlagged || false,
        }))

        setFeedback(processedData)

        // Count reactions
        const counts: Record<string, number> = {}
        processedData.forEach((item: FeedbackItem) => {
          counts[item.emoji] = (counts[item.emoji] || 0) + 1
        })
        setReactionCounts(counts)

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching feedback:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load feedback. Please try again later.",
        })
      }
    }

    // Initial fetch
    fetchEventData()
    fetchFeedback()

    // Set up auto-refresh every 10 seconds
    const intervalId = setInterval(fetchFeedback, 10000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [eventId, toast])

  const handlePinFeedback = async (id: string) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      // In a real app, you would have an endpoint for this
      // For now, we'll just update the local state
      setFeedback(feedback.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item)))

      toast({
        title: "Feedback updated",
        description: "The feedback has been pinned/unpinned.",
      })
    } catch (error) {
      console.error("Error updating feedback:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update feedback. Please try again.",
      })
    }
  }

  const handleFlagFeedback = async (id: string) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      // In a real app, you would have an endpoint for this
      // For now, we'll just update the local state
      setFeedback(feedback.map((item) => (item.id === id ? { ...item, isFlagged: !item.isFlagged } : item)))

      toast({
        title: "Feedback flagged",
        description: "The feedback has been flagged for review.",
      })
    } catch (error) {
      console.error("Error flagging feedback:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to flag feedback. Please try again.",
      })
    }
  }

  const getEmojiIcon = (emoji: string) => {
    switch (emoji) {
      case "👍":
        return <ThumbsUp className="h-5 w-5" />
      case "👎":
        return <ThumbsDown className="h-5 w-5" />
      case "❤️":
        return <Heart className="h-5 w-5" />
      case "😮":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <ThumbsUp className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout userRole="host">
        <div className="flex items-center justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!event) {
    return (
      <DashboardLayout userRole="host">
        <div className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="mb-2 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Event not found</h3>
          <p className="text-muted-foreground">The event you're looking for doesn't exist or has been removed</p>
        </div>
      </DashboardLayout>
    )
  }

  const pinnedFeedback = feedback.filter((item) => item.isPinned)
  const unpinnedFeedback = feedback.filter((item) => !item.isPinned)
  const flaggedFeedback = feedback.filter((item) => item.isFlagged)

  return (
    <DashboardLayout userRole="host">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Live Feedback Management</h1>
            <p className="text-muted-foreground">Monitor and manage real-time feedback for your event</p>
          </div>
          <LiveBadge />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{event.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{event.description}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10">
                        {event.checkedInCount}/{event.rsvpCount} Checked In
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10">
                        {feedback.length} Feedback Received
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="all" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pinned">Pinned</TabsTrigger>
                <TabsTrigger value="flagged">Flagged</TabsTrigger>
                <TabsTrigger value="reactions">Reactions</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4 space-y-4">
                {pinnedFeedback.map((item) => (
                  <Card key={item.id} className="border-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{item.user}</p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <Badge variant="outline" className="bg-primary/10">
                                Pinned
                              </Badge>
                            </div>
                            {item.content && <p className="mt-1">{item.content}</p>}
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant="outline">{item.emoji}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePinFeedback(item.id)}
                            className="text-primary"
                          >
                            <Pin className="h-4 w-4" />
                            <span className="sr-only">Unpin</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleFlagFeedback(item.id)}>
                            <Flag className="h-4 w-4" />
                            <span className="sr-only">Flag</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {unpinnedFeedback.map((item) => (
                  <Card key={item.id} className={item.isFlagged ? "border-destructive/50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{item.user}</p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {item.isFlagged && (
                                <Badge variant="outline" className="bg-destructive/10 text-destructive">
                                  Flagged
                                </Badge>
                              )}
                            </div>
                            {item.content && <p className="mt-1">{item.content}</p>}
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant="outline">{item.emoji}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handlePinFeedback(item.id)}>
                            <Pin className="h-4 w-4" />
                            <span className="sr-only">Pin</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleFlagFeedback(item.id)}
                            className={item.isFlagged ? "text-destructive" : ""}
                          >
                            <Flag className="h-4 w-4" />
                            <span className="sr-only">Flag</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="pinned" className="mt-4 space-y-4">
                {pinnedFeedback.length > 0 ? (
                  pinnedFeedback.map((item) => (
                    <Card key={item.id} className="border-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{item.user}</p>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(item.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                <Badge variant="outline" className="bg-primary/10">
                                  Pinned
                                </Badge>
                              </div>
                              {item.content && <p className="mt-1">{item.content}</p>}
                              <div className="mt-2 flex items-center gap-2">
                                <Badge variant="outline">{item.emoji}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePinFeedback(item.id)}
                              className="text-primary"
                            >
                              <Pin className="h-4 w-4" />
                              <span className="sr-only">Unpin</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleFlagFeedback(item.id)}>
                              <Flag className="h-4 w-4" />
                              <span className="sr-only">Flag</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Pin className="mb-2 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No pinned feedback</h3>
                    <p className="text-muted-foreground">Pin important feedback to highlight it here</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="flagged" className="mt-4 space-y-4">
                {flaggedFeedback.length > 0 ? (
                  flaggedFeedback.map((item) => (
                    <Card key={item.id} className="border-destructive/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{item.user}</p>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(item.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                <Badge variant="outline" className="bg-destructive/10 text-destructive">
                                  Flagged
                                </Badge>
                              </div>
                              {item.content && <p className="mt-1">{item.content}</p>}
                              <div className="mt-2 flex items-center gap-2">
                                <Badge variant="outline">{item.emoji}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {!item.isPinned && (
                              <Button variant="ghost" size="icon" onClick={() => handlePinFeedback(item.id)}>
                                <Pin className="h-4 w-4" />
                                <span className="sr-only">Pin</span>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleFlagFeedback(item.id)}
                              className="text-destructive"
                            >
                              <Flag className="h-4 w-4" />
                              <span className="sr-only">Unflag</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Flag className="mb-2 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No flagged feedback</h3>
                    <p className="text-muted-foreground">Flagged feedback will appear here for review</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reactions" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reaction Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <Card className="border-0 shadow-none">
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <div className="text-4xl">👍</div>
                          <div className="mt-2 text-2xl font-bold">{reactionCounts["👍"] || 0}</div>
                          <p className="text-sm text-muted-foreground">Thumbs Up</p>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-none">
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <div className="text-4xl">👎</div>
                          <div className="mt-2 text-2xl font-bold">{reactionCounts["👎"] || 0}</div>
                          <p className="text-sm text-muted-foreground">Thumbs Down</p>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-none">
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <div className="text-4xl">❤️</div>
                          <div className="mt-2 text-2xl font-bold">{reactionCounts["❤️"] || 0}</div>
                          <p className="text-sm text-muted-foreground">Heart</p>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow-none">
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <div className="text-4xl">😮</div>
                          <div className="mt-2 text-2xl font-bold">{reactionCounts["😮"] || 0}</div>
                          <p className="text-sm text-muted-foreground">Surprised</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Feedback Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Feedback</span>
                    <span className="font-bold">{feedback.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pinned</span>
                    <span className="font-bold">{pinnedFeedback.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Flagged</span>
                    <span className="font-bold">{flaggedFeedback.length}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Top Reactions</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex flex-col items-center rounded-md border p-2">
                      <ThumbsUp className="h-5 w-5 text-muted-foreground" />
                      <span className="mt-1 text-xs font-bold">{reactionCounts["👍"] || 0}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-md border p-2">
                      <ThumbsDown className="h-5 w-5 text-muted-foreground" />
                      <span className="mt-1 text-xs font-bold">{reactionCounts["👎"] || 0}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-md border p-2">
                      <Heart className="h-5 w-5 text-muted-foreground" />
                      <span className="mt-1 text-xs font-bold">{reactionCounts["❤️"] || 0}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-md border p-2">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <span className="mt-1 text-xs font-bold">{reactionCounts["😮"] || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Feedback Rate</h3>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {((feedback.length / event.checkedInCount) * 100).toFixed(1)}% of attendees
                        </span>
                        <span className="text-xs font-medium">
                          {feedback.length}/{event.checkedInCount}
                        </span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(feedback.length / event.checkedInCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Announcement
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Flag className="mr-2 h-4 w-4" />
                  Review Flagged Content
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Pin className="mr-2 h-4 w-4" />
                  Manage Pinned Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
