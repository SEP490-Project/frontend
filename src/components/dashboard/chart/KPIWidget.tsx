import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useRef, useEffect } from "react";
import { convertNumberToCurrency } from "@/libs/helper/helper";
import { HelpTooltip } from "@/components/ui/help-tooltip";

interface KPIData {
  value: string | number;
  status?: "up" | "down" | "stable";
  statusText?: string;
  compareLabel?: string;
}

interface Props {
  title: string;
  data: KPIData;
  mode?: "percent" | "currency";
  icon?: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  id?: string;
  tooltip?: string;
}

function KPIWidget({
  title,
  data,
  mode,
  icon,
  iconColor = "text-gray-500",
  iconBg = "bg-gray-100",
  id,
  tooltip,
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
    if (isFirstRender.current && value !== 0) {
      isFirstRender.current = false;
      setTimeout(() => {
        hasAnimated.current = true;
      }, 3000);
    }
  }, [value, mode]);

  return (
    <Card className="rounded-2xl shadow-sm" id={id}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 gap-2">
        <CardTitle className="text-base font-medium text-gray-500 flex items-center gap-1.5">
          {title}
          {tooltip && <HelpTooltip>{tooltip}</HelpTooltip>}
        </CardTitle>
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
          {
            // !hasAnimated.current ? (
            //   <CountUp
            //     end={typeof value === "number" ? value : 0}
            //     duration={3}
            //     formattingFn={formatValue}
            //     onEnd={() => {
            //       hasAnimated.current = true;
            //     }}
            //   />
            // ) :
            mode === "currency"
              ? `${convertNumberToCurrency(Number(value).toFixed(2))}`
              : mode === "percent"
                ? `${Number(value).toFixed(3)}%`
                : formatValue(value)
          }
        </div>
        {data?.status && data?.statusText && (
          <p
            className={`flex items-center gap-1 text-xs font-medium mt-1 ${
              data.status === "up"
                ? "text-green-600"
                : data.status === "down"
                  ? "text-red-600"
                  : "text-gray-500"
            }`}
          >
            {data.status === "up" ? (
              <ArrowUpRight size={14} />
            ) : data.status === "down" ? (
              <ArrowDownRight size={14} />
            ) : null}
            {data.statusText}
            {data.compareLabel && (
              <span className="text-gray-400 font-normal ml-1">{data.compareLabel}</span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default KPIWidget;
