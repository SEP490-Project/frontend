import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import CountUp from "react-countup";
import { useRef, useEffect } from "react";

interface KPIData {
  value: string | number;
  status?: "up" | "down";
  statusText?: string;
}

interface Props {
  title: string;
  data: KPIData;
  icon?: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  id?: string;
}

function KPIWidget({
  title,
  data,
  icon,
  iconColor = "text-gray-500",
  iconBg = "bg-gray-100",
  id,
}: Props) {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      return new Intl.NumberFormat("vi-VN").format(val);
    }
    return val;
  };

  const value = data?.value !== undefined ? data.value : 0;

  const hasAnimated = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Chỉ set hasAnimated thành true sau khi CountUp hoàn thành
    if (isFirstRender.current && value !== 0) {
      isFirstRender.current = false;
      // Set timeout để đợi CountUp hoàn thành (duration = 3s)
      setTimeout(() => {
        hasAnimated.current = true;
      }, 3000);
    }
  }, [value]);

  return (
    <Card className="rounded-2xl shadow-sm" id={id}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-base font-medium text-gray-500">{title}</CardTitle>
        {icon && (
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
          >
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">
          {!hasAnimated.current ? (
            <CountUp
              end={typeof value === "number" ? value : 0}
              duration={3}
              formattingFn={formatValue}
              onEnd={() => {
                hasAnimated.current = true;
              }}
            />
          ) : (
            formatValue(value)
          )}
        </div>
        {data?.status && data?.statusText && (
          <p
            className={`flex items-center gap-1 text-xs font-medium mt-1 ${
              data.status === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {data.status === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {data.statusText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default KPIWidget;
