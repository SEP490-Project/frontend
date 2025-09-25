import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  title: string;
  data: { name: string; value: number }[];
}

export default function BarChartWidget({ title, data }: Props) {
  if (!Array.isArray(data) || !data.length || !data[0]?.name || !data[0]?.value) return null;
  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl h-[340px] flex flex-col">
      <h3 className="text-gray-700 text-base font-semibold mb-3">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
