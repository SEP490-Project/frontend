import { convertNumberToCurrency } from "@/libs/helper/helper";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  title: string;
  data: { type: string; value: number }[];
  mode?: "count" | "percent" | "currency";
}

const COLORS = [
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#0ea5e9",
];

const renderCustomizedLabel =
  (mode: "count" | "percent" | "currency") =>
  ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={13}
        fontWeight={500}
      >
        {mode === "percent"
          ? `${value}%`
          : mode === "currency"
            ? `${convertNumberToCurrency(value.toFixed(2))}`
            : value}
      </text>
    );
  };

function PieChartWidget({ title, data, mode = "count" }: Props) {
  if (!Array.isArray(data) || !data.length || !data[0]?.type || typeof data[0]?.value !== "number")
    return null;
  return (
    <div className="p-6 h-[340px] flex flex-col bg-white rounded-lg shadow">
      <h3 className="text-gray-700 text-base font-semibold mb-3">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer debounce={250} width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="type"
              outerRadius={100}
              label={renderCustomizedLabel(mode)}
              labelLine={false}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                mode === "percent"
                  ? `${value}%`
                  : mode === "currency"
                    ? convertNumberToCurrency(Number(value).toFixed(2))
                    : value,
                name,
              ]}
            />
            <Legend
              formatter={(value: string) => <span style={{ fontWeight: 500 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PieChartWidget;
