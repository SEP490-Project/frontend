import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, HelpCircle } from "lucide-react";
import { useRef, useEffect } from "react";
import { convertNumberToCurrency } from "@/libs/helper/helper";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface KPIData {
  value: string | number;
  status?: "up" | "down";
  statusText?: string;
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
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-medium text-gray-500">{title}</CardTitle>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
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
