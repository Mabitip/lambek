"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface ChartPoint {
  date: string;
  inquiries: number;
  samples: number;
}

interface DashboardChartsProps {
  data: ChartPoint[];
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-foreground/50">Chart data will appear once inquiries and samples are recorded.</p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="border border-border bg-card p-6">
        <h3 className="mb-4 font-serif text-lg text-primary">Inquiries Over Time</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D9CDAF" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="inquiries" stroke="#3F4B1F" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border border-border bg-card p-6">
        <h3 className="mb-4 font-serif text-lg text-primary">Sample Requests</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D9CDAF" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="samples" fill="#C9A961" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function buildChartData(
  inquiries: { createdAt: Date }[],
  samples: { createdAt: Date }[],
  days = 30,
): ChartPoint[] {
  const map = new Map<string, { inquiries: number; samples: number }>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    map.set(key, { inquiries: 0, samples: 0 });
  }

  for (const item of inquiries) {
    const key = new Date(item.createdAt).toISOString().slice(0, 10);
    const entry = map.get(key);
    if (entry) entry.inquiries += 1;
  }

  for (const item of samples) {
    const key = new Date(item.createdAt).toISOString().slice(0, 10);
    const entry = map.get(key);
    if (entry) entry.samples += 1;
  }

  return Array.from(map.entries()).map(([date, counts]) => ({
    date: date.slice(5),
    ...counts,
  }));
}
