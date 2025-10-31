"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export default function DatePickerCalendar({ selectedDate, onDateChange }: DatePickerCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7)) // August 2025

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Des"]
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"]

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDateClick = (day: number | null) => {
    if (day) {
      onDateChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
    }
  }

  const isSelected = (day: number | null) => {
    if (!day) return false
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground"
            value={selectedDate.toLocaleDateString("en-US")}
            readOnly
          />
          <button className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">📅</button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="text-sm font-semibold text-muted-foreground">{monthNames[currentMonth.getMonth()]}</p>
              <p className="text-sm font-bold text-foreground">{currentMonth.getFullYear()}</p>
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={!day}
                className={`aspect-square text-sm rounded-lg transition-colors ${
                  !day
                    ? "cursor-default"
                    : isSelected(day)
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-foreground hover:bg-sidebar-accent"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <button className="flex-1 px-4 py-2 text-sm font-medium text-primary hover:bg-input rounded-lg transition-colors">
              Cancel
            </button>
            <button className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
