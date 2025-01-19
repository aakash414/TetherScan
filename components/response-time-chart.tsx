"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Google", time: 3 },
  { name: "Amazon", time: 5 },
  { name: "Microsoft", time: 2 },
  { name: "Apple", time: 4 },
  { name: "Facebook", time: 6 },
]

export function ResponseTimeChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} days`} />
        <Tooltip />
        <Bar dataKey="time" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

