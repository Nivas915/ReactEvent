"use client"

import { useEffect, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import { ThumbsUp, ThumbsDown, Heart, HelpCircle, Send, User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

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
  timestamp: string
  reaction: string
  user: string
}

export default function AttendeeFeedbackPage() {
  const params = useParams()
  const pathname = usePathname()
  
  
  // Extract event ID from the URL path
  const getEventIdFromPath = () => {
    // Log all available information for debugging
    console.log("Full params object:", params)
    console.log("Full pathname:", pathname)
    
    // Extract event ID from pathname
    // Expected format: /dashboard/attendee/events/EVENT_ID/feedback
    const pathParts = pathname?.split('/') || []
    console.log("Path parts:", pathParts)
    
    // The event ID should be the second-to-last segment before 'feedback'
    const feedbackIndex = pathParts.findIndex(part => part === 'feedback')
    const eventIdIndex = feedbackIndex > 0 ? feedbackIndex - 1 : -1
    const extractedId = eventIdIndex > 0 ? pathParts[eventIdIndex] : null
    
    console.log("Extracted event ID:", extractedId)
    return extractedId
  }
  
  const eventId = getEventIdFromPath()
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [newFeedback, setNewFeedback] = useState("")
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) {
        console.error("No event ID found in URL")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not determine which event to load. Please try again.",
        })
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No authentication token found")

        // Fetch event details
        const eventResponse = await fetch(`https://eventpluse.onrender.com/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!eventResponse.ok) throw new Error("Failed to fetch event details")
        const eventData = await eventResponse.json()
        setEvent(eventData)

        // Fetch feedback
        const feedbackResponse = await fetch(`https://eventpluse.onrender.com/api/events/${eventId}/feedback`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!feedbackResponse.ok) throw new Error("Failed to fetch feedback data")
        const feedbackData = await feedbackResponse.json()

        const userFeedback = feedbackData.filter((item: FeedbackItem) => item.user === "You")
        setFeedback(userFeedback)
      } catch (error) {
        console.error("Error fetching event data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event data. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventData()
  }, [eventId, toast])

  const handleReactionSelect = (reaction: string) => {
    setSelectedReaction(reaction)
  }

  const handleSubmitFeedback = async () => {
    if (!eventId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not determine which event to submit feedback for.",
      })
      return
    }
    
    if (!newFeedback && !selectedReaction) {
      toast({
        variant: "destructive",
        title: "Missing feedback",
        description: "Please provide a comment or select a reaction.",
      })
      return
    }

    setIsSending(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found")

      // Fake delay (remove in prod)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newFeedbackItem: FeedbackItem = {
        id: `feedback-${Date.now()}`,
        content: newFeedback,
        timestamp: new Date().toISOString(),
        reaction: selectedReaction || "👍",
        user: "You",
      }

      setFeedback([newFeedbackItem, ...feedback])
      setNewFeedback("")
      setSelectedReaction(null)

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

  if (isLoading) {
    return (
      <DashboardLayout userRole="attendee">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h3 className="mt-4 text-lg font-medium">Loading event data...</h3>
        </div>
      </DashboardLayout>
    )
  }

  if (!event && !isLoading) {
    return (
      <DashboardLayout userRole="attendee">
        <div className="flex flex-col items-center justify-center py-10">
          <Send className="mb-2 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Event not found</h3>
          <p className="text-muted-foreground">The event you're looking for doesn't exist or has been removed</p>
          <Button className="mt-4" variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="attendee">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Feedback</h1>
          <p className="text-muted-foreground">Share your thoughts and reactions during the event</p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Event Details</CardTitle>
              <Badge className="bg-green-500 animate-pulse text-white">Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">{event?.title}</h2>
              <p className="text-muted-foreground">{event?.description}</p>
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
                variant={selectedReaction === "👍" ? "default" : "outline"}
                size="sm"
                className="flex gap-2"
                onClick={() => handleReactionSelect("👍")}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Thumbs Up</span>
              </Button>
              <Button
                variant={selectedReaction === "👎" ? "default" : "outline"}
                size="sm"
                className="flex gap-2"
                onClick={() => handleReactionSelect("👎")}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>Thumbs Down</span>
              </Button>
              <Button
                variant={selectedReaction === "❤️" ? "default" : "outline"}
                size="sm"
                className="flex gap-2"
                onClick={() => handleReactionSelect("❤️")}
              >
                <Heart className="h-4 w-4" />
                <span>Heart</span>
              </Button>
              <Button
                variant={selectedReaction === "🤔" ? "default" : "outline"}
                size="sm"
                className="flex gap-2"
                onClick={() => handleReactionSelect("🤔")}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Question</span>
              </Button>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Share your thoughts, questions, or feedback..."
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
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
          <h2 className="text-xl font-bold">Your Feedback</h2>
          {feedback.length > 0 ? (
            <div className="space-y-4">
              {feedback.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
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
                        </div>
                        <p className="mt-1">{item.content}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline">{item.reaction}</Badge>
                        </div>
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
                <p className="text-muted-foreground">Your feedback will appear here after you submit it</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
