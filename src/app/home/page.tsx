"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import StatisticsChart from "@/components/statistics-chart"
// import DatePickerCalendar from "@/components/date-picker-calendar"
import Header from "@/components/header"

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 7, 17)) // Aug 17, 2025

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="">
            <div className="">
              <StatisticsChart />
            </div>
            <div>
              {/* <DatePickerCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} /> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
