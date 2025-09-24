import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  title: string;
  data: { type: string; value: number }[];
}

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

export default function PieChartWidget({ title, data }: Props) {
  if (!Array.isArray(data) || !data.length || !data[0]?.type || !data[0]?.value) return null;
  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl h-[340px] flex flex-col">
      <h3 className="text-gray-700 text-base font-semibold mb-3">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="type" outerRadius={100} label>
              {data.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
