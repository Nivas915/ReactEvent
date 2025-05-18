"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Heart, ThumbsUp, ThumbsDown, AlertCircle, Send, User, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { LiveBadge } from "@/components/ui/live-badge"

// Event type definition
interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  status: "Live" | "Scheduled" | "Closed"
}

// Feedback type definition
interface FeedbackItem {
  id: string
  content: string
  emoji: string
  timestamp: string
  user: string
}

export default function AttendeeLiveFeedbackPage() {
  const params = useParams()
  const eventId = params.eventid as string
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [comment, setComment] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

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
        setFeedback(data)
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

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji)
  }

  const handleSubmitFeedback = async () => {
    if (!comment && !selectedEmoji) {
      toast({
        variant: "destructive",
        title: "Missing feedback",
        description: "Please provide a comment or select an emoji reaction.",
      })
      return
    }

    setIsSending(true)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const feedbackData = {
        emoji: selectedEmoji || "👍",
        comment: comment,
      }

      const response = await fetch(`/api/events/${eventId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }

      // Add the new feedback to the list
      const newFeedbackItem = {
        id: `feedback-${Date.now()}`,
        content: comment,
        emoji: selectedEmoji || "👍",
        timestamp: new Date().toISOString(),
        user: "You",
      }

      setFeedback([newFeedbackItem, ...feedback])
      setComment("")
      setSelectedEmoji(null)

      toast({
        title: "Feedback sent",
        description: "Your feedback has been submitted successfully.",
      })
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
      })
    } finally {
      setIsSending(false)
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
      <DashboardLayout userRole="attendee">
        <div className="flex items-center justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!event) {
    return (
      <DashboardLayout userRole="attendee">
        <div className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="mb-2 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Event not found</h3>
          <p className="text-muted-foreground">The event you're looking for doesn't exist or has been removed</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="attendee">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Live Feedback</h1>
            <p className="text-muted-foreground">Share your thoughts and reactions in real-time</p>
          </div>
          <LiveBadge />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>{event.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-muted-foreground">{event.description}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>
                  {new Date(event.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share Your Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedEmoji === "👍" ? "default" : "outline"}
                size="sm"
                className="flex gap-2"
                onClick={() => handleEmojiSelect("👍")}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>👍</span>
              </Button>
              <Button
                variant={selectedEmoji === "👎" ? "default" : "outline"}
                size="sm"
                className="flex gap-2"
                onClick={() => handleEmojiSelect("👎")}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>👎</span>
              </Button>
              <Button
                variant={selectedEmoji === "❤️" ? "default" : "outline"}
                size="sm"
                className="flex gap-2"
                onClick={() => handleEmojiSelect("❤️")}
              >
                <Heart className="h-4 w-4" />
                <span>❤️</span>
              </Button>
              <Button
                variant={selectedEmoji === "😮" ? "default" : "outline"}
                size="sm"
                className="flex gap-2"
                onClick={() => handleEmojiSelect("😮")}
              >
                <AlertCircle className="h-4 w-4" />
                <span>😮</span>
              </Button>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Share your thoughts or questions..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-24"
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitFeedback} disabled={isSending} className="flex gap-2">
                  <Send className="h-4 w-4" />
                  {isSending ? "Sending..." : "Send Feedback"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Live Feedback Stream</h2>
          {feedback.length > 0 ? (
            <div className="space-y-4">
              {feedback.map((item) => (
                <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.user}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <Badge variant="outline" className="ml-auto">
                            {item.emoji}
                          </Badge>
                        </div>
                        {item.content && <p className="mt-1">{item.content}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Send className="mb-2 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No feedback yet</h3>
                <p className="text-muted-foreground">Be the first to share your thoughts!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
