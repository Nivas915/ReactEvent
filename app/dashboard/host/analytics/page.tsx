"use client"

import { useEffect, useState } from "react"
import { Calendar, CheckCircle, MessageSquare, ThumbsUp, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, XAxis, YAxis } from "recharts"

// Mock data for analytics
const mockEventAnalytics = {
  id: "2",
  title: "Product Launch Webinar",
  date: "2023-06-20T14:00:00",
  rsvpCount: 85,
  checkedInCount: 72,
  feedbackCount: 45,
  positiveReactions: 32,
  negativeReactions: 5,
  neutralReactions: 8,
  attendanceByTime: [
    { time: "13:45", count: 15 },
    { time: "14:00", count: 35 },
    { time: "14:15", count: 55 },
    { time: "14:30", count: 65 },
    { time: "14:45", count: 70 },
    { time: "15:00", count: 72 },
    { time: "15:15", count: 72 },
    { time: "15:30", count: 70 },
  ],
  feedbackByTime: [
    { time: "14:00", count: 0 },
    { time: "14:15", count: 8 },
    { time: "14:30", count: 15 },
    { time: "14:45", count: 25 },
    { time: "15:00", count: 35 },
    { time: "15:15", count: 42 },
    { time: "15:30", count: 45 },
  ],
  reactionBreakdown: [
    { name: "👍 Thumbs Up", value: 25 },
    { name: "❤️ Heart", value: 7 },
    { name: "🤔 Thinking", value: 8 },
    { name: "👎 Thumbs Down", value: 5 },
  ],
  keywordCloud: [
    { text: "innovative", value: 12 },
    { text: "pricing", value: 8 },
    { text: "features", value: 15 },
    { text: "integration", value: 7 },
    { text: "demo", value: 10 },
    { text: "helpful", value: 9 },
    { text: "questions", value: 6 },
    { text: "excited", value: 5 },
  ],
}

// Mock data for all events
const mockAllEventsData = [
  {
    name: "Tech Conference",
    rsvp: 120,
    checkedIn: 95,
    feedback: 60,
  },
  {
    name: "Product Launch",
    rsvp: 85,
    checkedIn: 72,
    feedback: 45,
  },
  {
    name: "Team Workshop",
    rsvp: 45,
    checkedIn: 45,
    feedback: 30,
  },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AnalyticsPage() {
  const [eventData, setEventData] = useState(mockEventAnalytics)
  const [allEventsData, setAllEventsData] = useState(mockAllEventsData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <DashboardLayout userRole="host">
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Track event performance and attendee engagement</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="product-launch">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech-conference">Tech Conference</SelectItem>
                <SelectItem value="product-launch">Product Launch Webinar</SelectItem>
                <SelectItem value="team-workshop">Team Building Workshop</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RSVPs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventData.rsvpCount}</div>
              <p className="text-xs text-muted-foreground">Total event registrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventData.checkedInCount}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((eventData.checkedInCount / eventData.rsvpCount) * 100)}% attendance rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventData.feedbackCount}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((eventData.feedbackCount / eventData.checkedInCount) * 100)}% feedback rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sentiment</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((eventData.positiveReactions / eventData.feedbackCount) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Positive feedback rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="comparison">Event Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Over Time</CardTitle>
                <CardDescription>Check-in rate during the event</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer>
                  <AreaChart
                    data={eventData.attendanceByTime}
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
                    <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" name="Attendees" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>RSVP vs Check-in</CardTitle>
                  <CardDescription>Comparison of registrations and actual attendance</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Checked In", value: eventData.checkedInCount },
                          { name: "No-Shows", value: eventData.rsvpCount - eventData.checkedInCount },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {[
                          { name: "Checked In", value: eventData.checkedInCount },
                          { name: "No-Shows", value: eventData.rsvpCount - eventData.checkedInCount },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip>
                        <ChartTooltipContent />
                      </ChartTooltip>
                      <ChartLegend>
                        <ChartLegendItem name="Checked In" color={COLORS[0]} />
                        <ChartLegendItem name="No-Shows" color={COLORS[1]} />
                      </ChartLegend>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Metrics</CardTitle>
                  <CardDescription>Key attendance statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Attendance Rate</span>
                        <span className="font-bold">
                          {Math.round((eventData.checkedInCount / eventData.rsvpCount) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(eventData.checkedInCount / eventData.rsvpCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">No-Show Rate</span>
                        <span className="font-bold">
                          {Math.round(((eventData.rsvpCount - eventData.checkedInCount) / eventData.rsvpCount) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-destructive"
                          style={{
                            width: `${((eventData.rsvpCount - eventData.checkedInCount) / eventData.rsvpCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Peak Attendance</span>
                        <span className="font-bold">
                          {Math.max(...eventData.attendanceByTime.map((item) => item.count))}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{
                            width: `${
                              (Math.max(...eventData.attendanceByTime.map((item) => item.count)) /
                                eventData.rsvpCount) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
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

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Reaction Breakdown</CardTitle>
                  <CardDescription>Distribution of emoji reactions</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer>
                    <PieChart>
                      <Pie
                        data={eventData.reactionBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {eventData.reactionBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip>
                        <ChartTooltipContent />
                      </ChartTooltip>
                      <ChartLegend>
                        {eventData.reactionBreakdown.map((entry, index) => (
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

              <Card>
                <CardHeader>
                  <CardTitle>Feedback Metrics</CardTitle>
                  <CardDescription>Key feedback statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Feedback Rate</span>
                        <span className="font-bold">
                          {Math.round((eventData.feedbackCount / eventData.checkedInCount) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(eventData.feedbackCount / eventData.checkedInCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Positive Sentiment</span>
                        <span className="font-bold">
                          {Math.round((eventData.positiveReactions / eventData.feedbackCount) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{
                            width: `${(eventData.positiveReactions / eventData.feedbackCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Negative Sentiment</span>
                        <span className="font-bold">
                          {Math.round((eventData.negativeReactions / eventData.feedbackCount) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-destructive"
                          style={{
                            width: `${(eventData.negativeReactions / eventData.feedbackCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
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
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Comparison</CardTitle>
                <CardDescription>Compare metrics across all your events</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer>
                  <BarChart
                    data={allEventsData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip>
                      <ChartTooltipContent />
                    </ChartTooltip>
                    <Legend />
                    <Bar dataKey="rsvp" fill="#8884d8" name="RSVPs" />
                    <Bar dataKey="checkedIn" fill="#82ca9d" name="Check-ins" />
                    <Bar dataKey="feedback" fill="#ffc658" name="Feedback" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      (allEventsData.reduce((acc, event) => acc + event.checkedIn, 0) /
                        allEventsData.reduce((acc, event) => acc + event.rsvp, 0)) *
                        100,
                    )}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">Across all events</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Feedback Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      (allEventsData.reduce((acc, event) => acc + event.feedback, 0) /
                        allEventsData.reduce((acc, event) => acc + event.checkedIn, 0)) *
                        100,
                    )}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">Across all events</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {allEventsData.reduce((acc, event) => acc + event.checkedIn, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Across all events</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
