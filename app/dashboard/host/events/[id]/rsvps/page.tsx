"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"


interface RSVP {
  _id: string
  attendee: {
    name: string
    email: string
  }
  checkedIn: boolean
}

export default function RSVPsPage() {
  const { id } = useParams();
  const [attendees, setAttendees] = useState<RSVP[]>([])
  const [selectedAttendee, setSelectedAttendee] = useState<RSVP | null>(null)
  const [emailInput, setEmailInput] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
useEffect(() => {
  const fetchRSVPs = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://eventpluse.onrender.com/api/events/${id}/rsvps`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      console.log('RSVP Data:', data)
      if (Array.isArray(data)) {
        setAttendees(data)
      } else {
        // if data is not an array, handle accordingly
        setAttendees([])
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch RSVPs." })
    }
  }
  fetchRSVPs()
}, [id, toast])


  const handleCheckIn = (rsvp: RSVP) => {
    setSelectedAttendee(rsvp)
    setIsDialogOpen(true)
  }

  const submitCheckIn = async () => {
    if (!emailInput || !selectedAttendee) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://eventpluse.onrender.com/api/events/${id}/checkin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ attendeeEmail:emailInput }),
        }
      )

      if (!response.ok) throw new Error("Check-in failed")

      setAttendees((prev) =>
        prev.map((rsvp) =>
          rsvp.attendee.email === selectedAttendee.attendee.email
            ? { ...rsvp, checkedIn: true }
            : rsvp
        )
      )
      setIsDialogOpen(false)
      setEmailInput("")
      toast({ title: "Success", description: "Attendee checked in and mail sent" })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Please check in on the date of event" })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">RSVP List</h1>
      <ul className="space-y-4">
        {attendees.map((rsvp) => (
        <li
        key={rsvp._id}
        className="flex justify-between items-center border p-4 rounded-md"
        >
        <span className="text-lg font-medium">{rsvp.attendee.name}</span>
        {rsvp.checkedIn ? (
        <Button variant="secondary" disabled>
          Checked In
        </Button>
      ) : (
        <Button onClick={() => handleCheckIn(rsvp)}>Check In</Button>
      )}
    </li>
  ))}
</ul>


      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Email to Confirm</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter attendee email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitCheckIn}>Confirm Check-In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}