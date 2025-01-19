"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", applications: 10 },
  { name: "Feb", applications: 15 },
  { name: "Mar", applications: 20 },
  { name: "Apr", applications: 25 },
  { name: "May", applications: 30 },
  { name: "Jun", applications: 35 },
]

export function ApplicationChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="applications" stroke="#10b981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

