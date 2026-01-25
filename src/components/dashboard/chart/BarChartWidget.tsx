import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface Props {
  title: string;
  data: { name: string; value: number }[];
  unit?: string;
  tooltip?: string;
  maxValue?: number;
}

function BarChartWidget({ title, data, unit, tooltip, maxValue }: Props) {
  if (!Array.isArray(data) || !data.length || !data[0]?.name || !data[0]?.value) return null;

  const formatTick = (tickItem: string) => {
    if (tickItem.length > 12) {
      return tickItem.substring(0, 12) + "...";
    }
    return tickItem;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg border rounded-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-indigo-600">
            Value:{" "}
            {unit
              ? `${payload[0].value.toLocaleString()} ${unit}`
              : payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 h-[380px] flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-gray-700 text-base font-semibold">{title}</h3>
        {tooltip && (
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </ShadcnTooltip>
        )}
      </div>
      <div className="flex-1">
        <ResponsiveContainer debounce={250} width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickFormatter={formatTick}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="number"
              tick={{ fontSize: "12px" }}
              tickCount={maxValue ? Math.min(maxValue + 1, 11) : 11}
              domain={[
                0,
                maxValue ||
                  ((dataMax: number) => {
                    if (dataMax <= 10) return 20;
                    if (dataMax <= 50) return Math.ceil(dataMax / 10) * 10;
                    if (dataMax <= 100) return Math.ceil(dataMax / 20) * 20;
                    return Math.ceil(dataMax / 100) * 100;
                  }),
              ]}
              tickFormatter={(value) =>
                maxValue && unit === "★"
                  ? value.toString()
                  : new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
              }
              tickMargin={5}
              unit={unit ? ` ${unit}` : undefined}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartWidget;
