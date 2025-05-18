"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"
import { useToast } from "@/hooks/use-toast"

// Types for feedback data
interface FeedbackItem {
  id: string
  content: string
  timestamp: string
  reaction: string
  user: string
}

interface EventAnalytics {
  id: string
  title: string
  date: string
  rsvpCount: number
  checkedInCount: number
  feedbackCount: number
  positiveReactions: number
  negativeReactions: number
  neutralReactions: number
  attendanceByTime: { time: string; count: number }[]
  feedbackByTime: { time: string; count: number }[]
  reactionBreakdown: { name: string; value: number }[]
  keywordCloud: { text: string; value: number }[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AttendeeEventAnalyticsPage() {
  const params = useParams()
  const eventId = params.id as string
  const { toast } = useToast()
  const [eventData, setEventData] = useState<EventAnalytics | null>(null)
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No authentication token found")
        }

        // Fetch feedback data
        const feedbackResponse = await fetch(`https://eventpluse.onrender.com/api/events/${eventId}/feedback`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!feedbackResponse.ok) {
          throw new Error("Failed to fetch feedback data")
        }

        const feedbackData = await feedbackResponse.json()
        setFeedback(feedbackData)

        // Process feedback data to create analytics
        const analytics = processAnalytics(feedbackData, eventId)
        setEventData(analytics)
      } catch (error) {
        console.error("Error fetching event analytics:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event analytics. Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventData()
  }, [eventId, toast])

  // Process feedback data to create analytics
  const processAnalytics = (feedbackData: FeedbackItem[], eventId: string): EventAnalytics => {
    // This is a simplified version - in a real app, you would get this data from the API
    // Here we're just processing the feedback data to create analytics

    // Count reactions
    const reactions = feedbackData.map((item) => item.reaction)
    const reactionCounts: Record<string, number> = {}
    reactions.forEach((reaction) => {
      reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1
    })

    // Create reaction breakdown
    const reactionBreakdown = Object.entries(reactionCounts).map(([name, value]) => ({
      name,
      value,
    }))

    // Count positive/negative reactions
    const positiveReactions = (reactionCounts["👍"] || 0) + (reactionCounts["❤️"] || 0)
    const negativeReactions = reactionCounts["👎"] || 0
    const neutralReactions = reactionCounts["🤔"] || 0

    // Create feedback by time
    const feedbackByTime = Array.from({ length: 8 }, (_, i) => {
      const hour = 14 + Math.floor(i / 2)
      const minute = (i % 2) * 30
      return {
        time: `${hour}:${minute === 0 ? "00" : minute}`,
        count: Math.floor(Math.random() * 10) + i * 5,
      }
    })

    // Create attendance by time
    const attendanceByTime = Array.from({ length: 8 }, (_, i) => {
      const hour = 14 + Math.floor(i / 2)
      const minute = (i % 2) * 30
      return {
        time: `${hour}:${minute === 0 ? "00" : minute}`,
        count: Math.floor(Math.random() * 20) + i * 10,
      }
    })

    // Extract keywords from feedback content
    const words = feedbackData
      .flatMap((item) => item.content.toLowerCase().split(/\s+/))
      .filter((word) => word.length > 3)

    const wordCounts: Record<string, number> = {}
    words.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1
    })

    // Create keyword cloud
    const keywordCloud = Object.entries(wordCounts)
      .filter(([_, count]) => count > 1)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)

    return {
      id: eventId,
      title: "Product Launch Webinar", // This would come from the event data
      date: "2023-06-20T14:00:00", // This would come from the event data
      rsvpCount: 85, // This would come from the event data
      checkedInCount: 72, // This would come from the event data
      feedbackCount: feedbackData.length,
      positiveReactions,
      negativeReactions,
      neutralReactions,
      attendanceByTime,
      feedbackByTime,
      reactionBreakdown,
      keywordCloud,
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

  if (!eventData) {
    return (
      <DashboardLayout userRole="attendee">
        <div className="flex flex-col items-center justify-center py-10">
          <BarChart3 className="mb-2 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No analytics available</h3>
          <p className="text-muted-foreground">Analytics data could not be loaded for this event</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="attendee">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Summary</h1>
          <p className="text-muted-foreground">View event performance and engagement metrics</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{eventData.title}</CardTitle>
            <CardDescription>
              {new Date(eventData.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center space-y-1">
                <span className="text-3xl font-bold">{eventData.rsvpCount}</span>
                <span className="text-sm text-muted-foreground">Total RSVPs</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <span className="text-3xl font-bold">{eventData.checkedInCount}</span>
                <span className="text-sm text-muted-foreground">Check-ins</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <span className="text-3xl font-bold">{eventData.feedbackCount}</span>
                <span className="text-sm text-muted-foreground">Feedback Submissions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Over Time</CardTitle>
              <CardDescription>Feedback submissions during the event</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer>
                <AreaChart
                  data={eventData.feedbackByTime}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Area type="monotone" dataKey="count" stroke="#82ca9d" fill="#82ca9d" name="Feedback" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 3 Emoji Reactions</CardTitle>
              <CardDescription>Most common reactions from attendees</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer>
                <PieChart>
                  <Pie
                    data={eventData.reactionBreakdown.slice(0, 3)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {eventData.reactionBreakdown.slice(0, 3).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <ChartLegend>
                    {eventData.reactionBreakdown.slice(0, 3).map((entry, index) => (
                      <ChartLegendItem
                        key={`legend-${index}`}
                        name={entry.name}
                        color={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </ChartLegend>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Common Feedback Keywords</CardTitle>
            <CardDescription>Most frequently mentioned terms in feedback</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px]">
            <div className="flex h-full flex-wrap items-center justify-center gap-4">
              {eventData.keywordCloud.map((keyword, index) => (
                <div
                  key={index}
                  className="rounded-full bg-primary/10 px-3 py-1 text-primary"
                  style={{
                    fontSize: `${Math.max(0.8, Math.min(2, keyword.value / 5))}rem`,
                  }}
                >
                  {keyword.text}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
