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

interface Props {
  title: string;
  data: {
    month?: string;
    name?: string;
    [key: string]: any;
  }[];
  unit?: string;
  lineConfig?: {
    [key: string]: {
      label: string;
      color: string;
    };
  };
  tooltip?: string;
}

function LineChartWidget({ title, data, unit, lineConfig, tooltip }: Props) {
  if (!Array.isArray(data) || !data.length || !data[0]?.month) {
    return null;
  }

  // Check if there's at least one data property besides "month" and "name"
  const dataKeys = Object.keys(data[0]).filter((key) => key !== "month" && key !== "name");
  if (!dataKeys.length) {
    return null;
  }

  const defaultColors = [
    "#6366f1",
    "#ef4444",
    "#10b981",
    "#8884d8",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];

  return (
    <div className="h-[340px] flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-gray-700 text-base font-semibold">{title}</h3>
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
      <div className="flex-1">
        <ResponsiveContainer debounce={250} width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
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
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const displayName = lineConfig?.[name]?.label || name;
                const formattedValue = value.toLocaleString();
                return [unit ? `${formattedValue} ${unit}` : formattedValue, displayName];
              }}
            />
            <Legend formatter={(value: string) => lineConfig?.[value]?.label || value} />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={lineConfig?.[key]?.color || defaultColors[index % defaultColors.length]}
                strokeWidth={2}
                name={lineConfig?.[key]?.label || key}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LineChartWidget;
