import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { APPLICATION_GROWTH, EVENT } from "@/lib/event";

const config = {
  applied: { label: "Applications", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function GrowthChart({ extra = 0 }: { extra?: number }) {
  const data = APPLICATION_GROWTH.map((d, i) =>
    i === APPLICATION_GROWTH.length - 1 ? { ...d, applied: d.applied + extra } : d,
  );
  const last = data[data.length - 1]?.applied ?? 0;
  const prev = data[data.length - 2]?.applied ?? 0;
  const weekly = last - prev;

  return (
    <section className="surface p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="eyebrow">Momentum</span>
          <h2 className="mt-1 text-lg font-semibold">Applications growth</h2>
          <p className="text-sm text-muted-foreground">Total applications, week by week</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          <TrendingUp className="size-3.5" /> +{weekly} this week
        </div>
      </div>
      <ChartContainer config={config} className="mt-5 aspect-auto h-64 w-full">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <YAxis tickLine={false} axisLine={false} width={44} domain={[0, EVENT.capacity]} />
          <ReferenceLine
            y={EVENT.capacity}
            stroke="var(--brand)"
            strokeDasharray="4 4"
            label={{ value: "Capacity", position: "insideTopRight", fill: "var(--brand)", fontSize: 11 }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="applied"
            type="monotone"
            stroke="var(--color-applied)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--color-applied)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </section>
  );
}
