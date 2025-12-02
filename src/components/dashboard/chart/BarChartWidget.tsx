import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  title: string;
  data: { name: string; value: number }[];
}

function BarChartWidget({ title, data }: Props) {
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
          <p className="text-indigo-600">Value: {payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 h-[380px] flex flex-col">
      <h3 className="text-gray-700 text-base font-semibold mb-3">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer debounce={250} width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartWidget;
