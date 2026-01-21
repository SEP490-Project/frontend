import { useAppDispatch } from "@/libs/stores";
import { getGHNInfoRaw, updateGHNOrderStatus } from "@/libs/stores/ghnManager/thunk";
import type { GHNOrderInfo } from "@/libs/types/ghn";
import { Loader2, Package, Search, Send } from "lucide-react"; // Added icons for better UI
import { useEffect, useState } from "react";

export const GhnMock = () => {
  const dispatch = useAppDispatch();

  const [result, setResult] = useState("");
  const [orderInfo, setOrderInfo] = useState<GHNOrderInfo | null>(null); // Typed loosely for now
  const [isLoading, setIsLoading] = useState(false);
  const [updateStatusPayload, setUpdateStatusPayload] = useState({
    order_code: "",
    status: "", // Will be set dynamically based on available states
  });
  const [availableStates, setAvailableStates] = useState<Map<string, boolean>>(new Map());

  const handlePayload = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const key = e.target.name;
    const val = e.target.value;
    setUpdateStatusPayload({
      ...updateStatusPayload,
      [key]: val,
    });
  };

  const extractErrMsg = (err: unknown) => {
    try {
      let errStr = (err as Error).toString();
      if (errStr.includes("corev2_tenant_order_detail") && errStr.includes("code=400")) {
        errStr = errStr.split("-")[1];
      } else {
        errStr = "Can not fetch order details.";
      }
      return errStr;
    } catch (err: any) {
      return "Can not fetch order details: " + err.message;
    }
  };

  const submitUpdateStatusAPI = async () => {
    if (!updateStatusPayload.order_code.trim()) {
      alert("Please enter the order code");
      return;
    }

    const statusEl = document.getElementById("status-select") as HTMLSelectElement | null;
    const currentStatus = statusEl?.value || updateStatusPayload.status;

    console.log("Submitting Update Status with Payload:", {
      ...updateStatusPayload,
      status: currentStatus,
    });

    setIsLoading(true);
    setResult("⏳ Sending request...");

    try {
      const response = await dispatch(
        updateGHNOrderStatus({ ...updateStatusPayload, status: currentStatus }),
      )
        .unwrap()
        .then(() => fetchAvailableStates(updateStatusPayload.order_code));
      setResult("✅ Success: " + JSON.stringify(response, null, 2));
    } catch (err) {
      setResult("❌ Error: " + (err as Error).toString());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Available States Updated:", availableStates);
  }, [availableStates]);

  useEffect(() => {
    console.log("updateStatusPayload Updated:", updateStatusPayload);
  }, [updateStatusPayload]);

  const getOrderInfo = async (orderCode: string) => {
    setIsLoading(true);

    try {
      const response = await dispatch(getGHNInfoRaw(orderCode)).unwrap();
      console.log("GHN Order Info Response:", response);
      setOrderInfo(response?.data || null);

      const rawStates = response?.data?.available_states;

      const statesMap =
        rawStates && typeof rawStates === "object"
          ? new Map<string, boolean>(Object.entries(rawStates))
          : new Map<string, boolean>();

      setAvailableStates(statesMap);

      // Set default status to first available happy case
      const states = response?.data?.available_states as Map<string, boolean>;
      console.log("Available States:", states);
      if (states && states.size > 0) {
        for (const [status, isHappy] of states) {
          if (isHappy) {
            setUpdateStatusPayload((prev) => ({ ...prev, status }));
            break;
          }
        }
      }

      setResult("✅ Successfully fetched order information!");
    } catch (err) {
      setResult("❌ Error: " + extractErrMsg(err));
      setOrderInfo(null); // Clear info on error so it collapses
      setAvailableStates(new Map()); // Clear states on error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableStates = async (orderCode: string) => {
    try {
      const response = await dispatch(getGHNInfoRaw(orderCode)).unwrap();
      const rawStates = response?.data?.available_states;

      const statesMap =
        rawStates && typeof rawStates === "object"
          ? new Map<string, boolean>(Object.entries(rawStates))
          : new Map<string, boolean>();

      setAvailableStates(statesMap);
    } catch (err) {
      console.error("Error fetching available states:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eVal = e.target.value.toUpperCase();
    setUpdateStatusPayload({
      ...updateStatusPayload,
      order_code: eVal,
    });
  };

  // --- Styles constants ---
  const primaryColor = "#004AAD";
  const accentColor = "#FF6A00";

  return (
    <div className="flex items-center justify-center p-6 transition-all duration-500 h-full">
      <div
        className={`
                    bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ease-in-out
                    ${orderInfo ? "max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12" : "max-w-xl w-full"}
                `}
      >
        <div
          className={`
                    p-8 flex flex-col h-full border-t-8 transition-all duration-500
                    ${orderInfo ? "lg:col-span-4 border-r border-gray-100" : "border-none"}
                `}
          style={{ borderColor: primaryColor }}
        >
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-50 mb-4">
              <Package size={32} color={primaryColor} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">GHN Mocking Interface</h2>
            <p className="text-gray-500 text-sm mt-1">Simulate GHN order status updates</p>
          </div>

          <div className="space-y-4 flex-1">
            {/* Input Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Order Code</label>
              <div className="relative">
                <input
                  name="order_code"
                  value={updateStatusPayload.order_code}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono tracking-wider"
                  placeholder="E.g.: S2Y3D4"
                />
                <Search className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
              </div>
            </div>

            <button
              onClick={() => getOrderInfo(updateStatusPayload.order_code)}
              disabled={!updateStatusPayload.order_code.trim() || isLoading}
              className="w-full py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              Get Info
            </button>

            {/* Action Section - Only visible if we have info */}
            <div
              className={`transition-all duration-700 delay-100 overflow-hidden ${orderInfo ? "max-h-96 opacity-100 mt-6 pt-6 border-t border-dashed" : "max-h-0 opacity-0"}`}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Update Status
              </label>

              {availableStates && availableStates.size > 0 ? (
                <select
                  name="status"
                  id="status-select"
                  value={updateStatusPayload.status}
                  onChange={handlePayload}
                  className="w-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none mb-4 text-gray-700"
                >
                  {/* Happy Cases (true values) */}
                  {Array.from(availableStates.entries())
                    .filter(([, isHappy]) => isHappy)
                    .map(([status]) => (
                      <option key={status} value={status} className="text-green-700 bg-green-50">
                        ✅ {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}

                  {/* Edge Cases (false values) */}
                  {Array.from(availableStates.entries())
                    .filter(([, isHappy]) => !isHappy)
                    .map(([status]) => (
                      <option key={status} value={status} className="text-red-700 bg-red-50">
                        ⚠️ {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                </select>
              ) : (
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl mb-4 text-gray-500 text-center">
                  🚫 The order has reached its final status and cannot be updated
                </div>
              )}

              <button
                onClick={submitUpdateStatusAPI}
                disabled={!availableStates || availableStates.size === 0}
                className="w-full py-3 rounded-xl font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-orange-500/50 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: accentColor }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                Update Status
              </button>
            </div>

            {/* Result Log */}
            <div className={`transition-all duration-300 ${result ? "opacity-100" : "opacity-0"}`}>
              <div className="bg-gray-900 rounded-xl p-4 overflow-hidden">
                <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  Console Log
                </h3>
                <div className="text-green-400 text-xs font-mono break-all max-h-32 overflow-auto custom-scrollbar">
                  {result || "Waiting for action..."}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`
                    bg-gray-50 flex flex-col transition-all duration-700 ease-in-out
                    ${orderInfo ? "lg:col-span-8 opacity-100 translate-x-0" : "w-0 h-0 lg:col-span-0 opacity-0 translate-x-10 overflow-hidden"}
                `}
        >
          {orderInfo && (
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-8 rounded bg-blue-600 inline-block"></span>
                  Order Information
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                  RESPONSE: 200 OK
                </span>
              </div>

              <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 overflow-auto relative group max-h-150 custom-scrollbar">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(JSON.stringify(orderInfo, null, 2))
                    }
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-md font-medium transition-colors"
                  >
                    Copy JSON
                  </button>
                </div>

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
                      <p className="text-sm text-gray-900">{orderInfo?.from_ward_name || "-"}</p>
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
                      <p className="text-sm text-gray-900">{orderInfo?.to_district_name || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">To Province</label>
                      <p className="text-sm text-gray-900">{orderInfo?.to_province_name || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #CBD5E1;
                    border-radius: 20px;
                }
            `}</style>
    </div>
  );
};

export default GhnMock;
