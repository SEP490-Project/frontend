import { LogoSpinner } from "@/components/logo-spinner";
import { Map } from "@/components/map/Map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, type RootState } from "@/libs/stores";
import { getGHNInfoRaw } from "@/libs/stores/ghnManager/thunk";
import type { GHNOrderInfo } from "@/libs/types/ghn";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const OrderTracking = () => {
  const dispatch = useAppDispatch();

  const { loading, msg } = useSelector((state: RootState) => state.manageGHN);

  const [ghnId, setGhnId] = useState("");
  const [orderInfo, setOrderInfo] = useState<GHNOrderInfo | null>(null);

  const handleTrackOrder = async () => {
    if (!ghnId) {
      toast.error("Please enter a GHN Order ID");
      return;
    }

    const result = await dispatch(getGHNInfoRaw(ghnId.trim()));

    if (getGHNInfoRaw.fulfilled.match(result)) {
      toast.success(msg || "Order information retrieved successfully");
      setOrderInfo(result.payload.data);
    } else if (getGHNInfoRaw.rejected.match(result)) {
      toast.error(msg || `Failed to retrieve order information: ${result.payload}`);
    }
  };

  if (loading) {
    return <LogoSpinner />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white">
      <div className="w-full flex flex-col items-center">
        <div className="w-full text-center space-y-4 p-6">
          <h1 className="text-6xl font-bold text-gray-800 w-full">Order Tracking</h1>
          <p className="text-2xl">Enter your GHN Order ID in the field below.</p>
        </div>
        <div className="w-full p-6 flex-col md:flex-row flex items-center justify-center">
          <Input
            type="text"
            placeholder="Enter GHN Id"
            className="md:rounded-r-none h-16 md:w-[50%] md:text-xl mb-4 md:mb-0 placeholder:text-xl"
            onChange={(e) => setGhnId(e.target.value)}
            value={ghnId}
          />
          <Button
            onClick={handleTrackOrder}
            className="md:rounded-l-none h-16 md:w-[10%] text-xl font-medium"
          >
            Track Order
          </Button>
        </div>
        {orderInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-2 md:px-6">
            <div className="flex items-center border border-gray-300 rounded-lg shadow-md h-full overflow-hidden ">
              <Map data={orderInfo} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border h-full">
              <div className="space-y-6 overflow-y-scroll h-[70vh]">
                {orderInfo && (
                  <div className="px-2 h-full flex flex-col">
                    {/* Sender Info */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                        Sender Info
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">From Name</label>
                          <p className="text-sm text-gray-900">{orderInfo?.from_name || "-"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">From Phone</label>
                          <p className="text-sm text-gray-900">{orderInfo?.from_phone || "-"}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-600">From Address</label>
                          <p className="text-sm text-gray-900">{orderInfo?.from_address || "-"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">From Ward</label>
                          <p className="text-sm text-gray-900">
                            {orderInfo?.from_ward_name || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">From District</label>
                          <p className="text-sm text-gray-900">
                            {orderInfo?.from_district_name || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">From Province</label>
                          <p className="text-sm text-gray-900">
                            {orderInfo?.from_province_name || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Receiver Info */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                        Receiver Info
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">To Name</label>
                          <p className="text-sm text-gray-900">{orderInfo?.to_name || "-"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">To Phone</label>
                          <p className="text-sm text-gray-900">{orderInfo?.to_phone || "-"}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-600">To Address</label>
                          <p className="text-sm text-gray-900">{orderInfo?.to_address || "-"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">To Ward</label>
                          <p className="text-sm text-gray-900">{orderInfo?.to_ward_name || "-"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">To District</label>
                          <p className="text-sm text-gray-900">
                            {orderInfo?.to_district_name || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">To Province</label>
                          <p className="text-sm text-gray-900">
                            {orderInfo?.to_province_name || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                        Product Info
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Weight</label>
                          <p className="text-sm text-gray-900">{orderInfo?.weight || "-"} g</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Dimensions (L x W x H)
                          </label>
                          <p className="text-sm text-gray-900">
                            {orderInfo?.length || "-"} x {orderInfo?.width || "-"} x{" "}
                            {orderInfo?.height || "-"} cm
                          </p>
                        </div>
                        <div className="md:col-span-1">
                          <label className="text-sm font-medium text-gray-600">
                            Product [quantity]
                          </label>
                          <p className="text-sm text-gray-900">{orderInfo?.content || "-"}</p>
                        </div>
                        <div className="md:col-span-1">
                          <label className="text-sm font-medium text-gray-600">Order Date</label>
                          <p className="text-sm text-gray-900">
                            {orderInfo?.order_date
                              ? new Date(orderInfo.order_date).toLocaleString()
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
