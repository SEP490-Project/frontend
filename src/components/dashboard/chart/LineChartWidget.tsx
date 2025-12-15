import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// 1. Define a config for each line to make it generic
interface LineConfig {
  dataKey: string;
  color: string;
  name?: string; // Human readable name (e.g., "reach" -> "Total Reach")
}

interface Props {
  title: string;
  data: Record<string, any>[];
  unit?: string;
  xAxisKey: string; // Dynamic X-Axis (e.g., "month", "date", "year")
  lines?: LineConfig[]; // Explicit definition of what lines to draw
  className?: string;
  tooltip?: string;
}

function LineChartWidget({ title, data, xAxisKey, lines, className, unit, tooltip }: Props) {
  // 2. Better "Empty State" handling
  const isEmpty = !Array.isArray(data) || data.length === 0;
  const defaultColors = [
    "#6366f1",
    "#ef4444",
    "#10b981",
    "#8884d8",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];

  if (isEmpty) {
    return (
      <div
        className={`h-[340px] flex flex-col justify-center items-center bg-gray-50 rounded border ${className}`}
      >
        <p className="text-gray-400 font-medium">No data available for {title}</p>
      </div>
    );
  }

  // 3. Determine which keys to draw lines for
  let linesToRender: LineConfig[] = [];

  if (lines) {
    linesToRender = lines;
  } else {
    // Auto-detect keys (excluding the x-axis key)
    linesToRender = Object.keys(data[0])
      .filter((key) => key !== xAxisKey)
      .map((key, index) => ({
        dataKey: key,
        color: defaultColors[index % defaultColors.length],
      }));
  }

  return (
    <div className={`h-[340px] flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-gray-700 text-base font-semibold mb-3">{title}</h3>
        {tooltip && (
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </ShadcnTooltip>
        )}
      </div>
      <div className="flex-1 w-full min-w-0">
        {" "}
        {/* min-w-0 fixes flex issues with charts */}
        <ResponsiveContainer debounce={250} width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />

            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              type="number"
              tick={{ fontSize: "12px" }}
              tickCount={11}
              domain={[
                0,
                (dataMax: number) => {
                  if (dataMax <= 10) return 20;
                  if (dataMax <= 50) return Math.ceil(dataMax / 10) * 10;
                  if (dataMax <= 100) return Math.ceil(dataMax / 20) * 20;
                  return Math.ceil(dataMax / 100) * 100;
                },
              ]}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
              tickMargin={5}
              unit={unit ? ` ${unit}` : undefined}
              width={100}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            <Legend verticalAlign="top" height={36} iconType="circle" />

            {linesToRender.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={2}
                name={line.name || line.dataKey} // Custom label support
                dot={false} // Cleaner look for dense data
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LineChartWidget;
