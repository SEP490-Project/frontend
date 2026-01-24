import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface LineConfig {
  dataKey: string;
  label: string;
  color: string;
}

interface BarConfig {
  dataKey: string;
  label: string;
  color: string;
}

interface Props {
  title: string;
  data: {
    name: string;
    [key: string]: any;
  }[];
  barConfig?: BarConfig;
  lineConfigs?: LineConfig[];
  unit?: string;
  tooltip?: string;
  height?: number;
  formatXAxis?: (value: string) => string;
}

function ComposedChartWidget({
  title,
  data,
  barConfig,
  lineConfigs = [],
  unit,
  tooltip,
  height = 400,
  formatXAxis,
}: Props) {
  if (!Array.isArray(data) || !data.length) {
    return (
      <div className="h-[340px] flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const defaultFormatXAxis = (value: string) => {
    if (!value) return "";
    // Handle ISO date strings
    if (value.includes("T") || value.includes("-")) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
    }
    if (value.length > 10) {
      return value.substring(0, 10) + "...";
    }
    return value;
  };

  const xAxisFormatter = formatXAxis || defaultFormatXAxis;

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg border rounded-lg min-w-[200px]">
          <p className="font-medium text-gray-900 mb-2 border-b pb-1">{xAxisFormatter(label)}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center py-1">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-600 text-sm">{entry.name}:</span>
              </span>
              <span className="font-medium text-gray-900 text-sm">
                {unit === "₫"
                  ? `${formatCurrency(entry.value)} ${unit}`
                  : entry.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`h-[${height}px] flex flex-col`} style={{ height }}>
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
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tickFormatter={xAxisFormatter}
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
              tickMargin={5}
              width={80}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
              tickMargin={5}
              width={80}
              hide
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value: string) => <span className="text-sm text-gray-600">{value}</span>}
            />
            {/* Render bar first (background) */}
            {barConfig && (
              <Bar
                yAxisId="left"
                dataKey={barConfig.dataKey}
                name={barConfig.label}
                fill={barConfig.color}
                radius={[4, 4, 0, 0]}
                opacity={0.7}
              />
            )}
            {/* Render lines on top */}
            {lineConfigs.map((config) => (
              <Line
                key={config.dataKey}
                yAxisId="left"
                type="monotone"
                dataKey={config.dataKey}
                name={config.label}
                stroke={config.color}
                strokeWidth={2}
                dot={{ r: 3, fill: config.color }}
                activeDot={{ r: 5 }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ComposedChartWidget;
