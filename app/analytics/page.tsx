import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationChart } from "@/components/application-chart"
import { ResponseTimeChart } from "@/components/response-time-chart"
import { StatsCards } from "@/components/stats-cards"

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      <StatsCards />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponseTimeChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

