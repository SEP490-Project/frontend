import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { month: "Jan", value: 400 },
  { month: "Feb", value: 300 },
  { month: "Mar", value: 600 },
  { month: "Apr", value: 200 },
  { month: "May", value: 800 },
];

export default function AreaChartWidget({ title }: { title: string }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full h-[300px]">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
