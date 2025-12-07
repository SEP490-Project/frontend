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
    reach?: number;
    engagement?: number;
    value?: number;
    [key: string]: any;
  }[];
}

function LineChartWidget({ title, data }: Props) {
  if (!Array.isArray(data) || !data.length || !data[0]?.month) {
    return null;
  }

  // Check if there's at least one data property besides "month" and "name"
  const hasData = Object.keys(data[0]).some((key) => key !== "month" && key !== "name");
  if (!hasData) {
    return null;
  }

  const colors = ["#6366f1", "#ef4444", "#10b981", "#8884d8", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="h-[340px] flex flex-col">
      <h3 className="text-gray-700 text-base font-semibold mb-3">{title}</h3>
      <div className="flex-1">
        <ResponsiveContainer debounce={250} width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data[0]?.reach !== undefined && (
              <Line type="monotone" dataKey="reach" stroke="#6366f1" strokeWidth={2} />
            )}
            {data[0]?.engagement !== undefined && (
              <Line type="monotone" dataKey="engagement" stroke="#ef4444" strokeWidth={2} />
            )}
            {data[0]?.value !== undefined && (
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
            )}
            {Object.keys(data[0] || {})
              .filter((key) => !["month", "reach", "engagement", "value"].includes(key))
              .map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LineChartWidget;
