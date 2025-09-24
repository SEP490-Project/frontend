interface Props {
  title: string;
  data: any[];
}

export default function TableWidget({ title, data }: Props) {
  if (!data) return null;

  // Nếu data là array of string (alerts)
  const isSimple = typeof data[0] === "string";

  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl">
      <h3 className="text-gray-700 text-base font-semibold mb-3">{title}</h3>
      {isSimple ? (
        <ul className="list-disc list-inside text-sm text-gray-700">
          {data.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {Object.keys(data[0]).map((k) => (
                  <th
                    key={k}
                    className="border-b py-2 text-left capitalize font-semibold text-gray-500 bg-gray-50"
                  >
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b last:border-0">
                  {Object.entries(row).map(([k, v], j) => (
                    <td key={j} className="py-2">
                      {/* Nếu là trạng thái thì render badge màu */}
                      {k.toLowerCase().includes("status") ? (
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${v === "Completed" ? "bg-green-100 text-green-600" : v === "Pending" ? "bg-yellow-100 text-yellow-600" : v === "Cancelled" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}
                        >
                          {String(v)}
                        </span>
                      ) : (
                        String(v)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
