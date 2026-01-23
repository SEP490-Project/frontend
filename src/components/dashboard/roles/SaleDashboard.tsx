import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import LimitedProductRevenueGrossModal from "./sub-components/sale/modals/LimitedProductRevenueGrossModal";
import { OverviewTab } from "./sub-components/sale/tabs/OverviewTabs";
import { OrderTab } from "./sub-components/sale/tabs/OrderTabs";
import { LimitedProductRevenueNetModal } from "./sub-components/sale/modals/LimitedProductRevenueNetModal";
import { StandardProductRevenue } from "./sub-components/sale/modals/StandardProductRevenue";
import { TotalRefundModal } from "./sub-components/sale/modals/TotalRefundModal";
import { TotalRevenueModal } from "./sub-components/sale/modals/TotalRevenueModal";
// import { AverageOrderValueModal } from "./sub-components/sale/modals/AverageOrderValueModal";

export const formatDateToRFC3339 = (dateString: string | undefined, isEndDate: boolean = false) => {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString);
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }
    return date.toISOString();
  } catch {
    return undefined;
  }
};

const SaleDashboard: React.FC = () => {
  const currentDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(currentDate.getMonth() - 1);

  const [showFilter, setShowFilter] = React.useState(false);
  const [startDate, setStartDate] = React.useState<string | undefined>(
    formatDateToRFC3339(defaultStartDate.toISOString().split("T")[0], false),
  );
  const [endDate, setEndDate] = React.useState<string | undefined>(
    formatDateToRFC3339(currentDate.toISOString().split("T")[0], true),
  );
  const [periodGap, setPeriodGap] = React.useState<"day" | "month" | "year">("day");
  const [openLimitedProductRevenueGrossModal, setOpenLimitedProductRevenueGrossModal] =
    useState(false);
  const [openLimitedProductRevenueNetModal, setOpenLimitedProductRevenueNetModal] = useState(false);
  const [openStandardProductRevenue, setOpenStandardProductRevenue] = useState(false);
  const [openTotalRefundModal, setOpenTotalRefundModal] = useState(false);
  const [openTotalRevenueModal, setOpenTotalRevenueModal] = useState(false);
  // const [openAverageOrderValueModal, setOpenAverageOrderValueModal] = useState(false);

  const handleClearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleSetGapPeriod = (value: "day" | "month" | "year") => {
    setPeriodGap(value);
    if (value === "day") {
      const start = new Date();
      start.setMonth(currentDate.getMonth() - 1);
      const end = new Date();
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      return;
    } else if (value === "month") {
      const start = new Date();
      start.setFullYear(currentDate.getFullYear() - 1);
      const end = new Date();
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      return;
    } else if (value === "year") {
      const start = new Date();
      start.setFullYear(currentDate.getFullYear() - 5);
      const end = new Date();
      setStartDate(start.toISOString().split("T")[0]);
      setEndDate(end.toISOString().split("T")[0]);
      return;
    }
  };

  // Handle scroll to hide filter
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollY = target.scrollTop;
      if (showFilter === true && scrollY > 0) {
        setShowFilter(false);
      }
    };

    // Find the scrolling container (the main element in ManageLayout)
    const scrollContainer = document.querySelector("main");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [showFilter]);

  const handlCloseOpenModals = () => {
    setOpenLimitedProductRevenueGrossModal(false);
    setOpenLimitedProductRevenueNetModal(false);
    setOpenStandardProductRevenue(false);
    setOpenTotalRefundModal(false);
    setOpenTotalRevenueModal(false);
    // setOpenAverageOrderValueModal(false);
  };

  return (
    <Tabs defaultValue="overview">
      <div className="p-2 sm:p-6 w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between w-full gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between w-full sm:w-auto">
            <div className="relative">
              <Button variant="default" size="lg" onClick={() => setShowFilter(!showFilter)}>
                <Filter size={16} />
                Filter
              </Button>
              {showFilter && (
                <div className="absolute mt-2 flex items-center gap-4 bg-white shadow-lg rounded-lg p-4 right-0 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2">
                    <div className="text-gray-600 font-medium">Period Gap:</div>
                    <Select
                      value={periodGap}
                      onValueChange={(value) =>
                        handleSetGapPeriod(value as "day" | "month" | "year")
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select period gap" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Daily</SelectItem>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-gray-600 font-medium">Date Range:</div>
                    <DatePicker
                      value={startDate}
                      onChange={setStartDate}
                      maxDate={endDate}
                      placeholder="Start Date"
                    />
                    <span className="text-gray-400">-</span>
                    <DatePicker
                      value={endDate}
                      onChange={setEndDate}
                      minDate={startDate}
                      placeholder="End Date"
                    />
                    {(startDate || endDate) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearDates}
                        className="h-8 px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="order/preorder">Order/Preorder</TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        <TabsContent value="overview">
          <OverviewTab
            startDate={formatDateToRFC3339(startDate, false)}
            endDate={formatDateToRFC3339(endDate, true)}
            periodGap={periodGap}
            setOpenLimitedProductRevenueGrossModal={setOpenLimitedProductRevenueGrossModal}
            setOpenLimitedProductRevenueNetModal={setOpenLimitedProductRevenueNetModal}
            setOpenStandardProductRevenue={setOpenStandardProductRevenue}
            setOpenTotalRefundModal={setOpenTotalRefundModal}
            setOpenTotalRevenueModal={setOpenTotalRevenueModal}
            // setOpenAverageOrderValueModal={setOpenAverageOrderValueModal}
          />
        </TabsContent>
        <TabsContent value="order/preorder">
          <OrderTab
            startDate={formatDateToRFC3339(startDate, false)}
            endDate={formatDateToRFC3339(endDate, true)}
            periodGap={periodGap}
          />
        </TabsContent>
      </div>

      <LimitedProductRevenueGrossModal
        isOpen={openLimitedProductRevenueGrossModal}
        onClose={handlCloseOpenModals}
        startDate={formatDateToRFC3339(startDate, false)}
        endDate={formatDateToRFC3339(endDate, true)}
      />
      <LimitedProductRevenueNetModal
        isOpen={openLimitedProductRevenueNetModal}
        onClose={handlCloseOpenModals}
        startDate={formatDateToRFC3339(startDate, false)}
        endDate={formatDateToRFC3339(endDate, true)}
      />
      <StandardProductRevenue
        isOpen={openStandardProductRevenue}
        onClose={handlCloseOpenModals}
        startDate={formatDateToRFC3339(startDate, false)}
        endDate={formatDateToRFC3339(endDate, true)}
      />
      <TotalRefundModal
        isOpen={openTotalRefundModal}
        onClose={handlCloseOpenModals}
        startDate={formatDateToRFC3339(startDate, false)}
        endDate={formatDateToRFC3339(endDate, true)}
      />
      <TotalRevenueModal
        isOpen={openTotalRevenueModal}
        onClose={handlCloseOpenModals}
        startDate={formatDateToRFC3339(startDate, false)}
        endDate={formatDateToRFC3339(endDate, true)}
      />
      {/* <AverageOrderValueModal isOpen={openAverageOrderValueModal} onClose={handlCloseOpenModals} /> */}
    </Tabs>
  );
};

export default SaleDashboard;
