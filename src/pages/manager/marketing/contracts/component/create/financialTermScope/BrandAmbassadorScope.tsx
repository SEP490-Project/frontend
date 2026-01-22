import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaDollarSign } from "react-icons/fa6";
import { PaymentSchedule } from "../shared/FinancialSharedComponent";

interface BrandAmbassadorScopeProps {
  formData: any;
  onUpdate: (updates: any) => void;
  errors?: any;
}

const BrandAmbassadorScope: React.FC<BrandAmbassadorScopeProps> = ({ formData, onUpdate }) => {
  const financial_terms = formData?.financial_terms || {};
  const start_date = formData?.start_date;
  const end_date = formData?.end_date;

  // Get number of events from scope of work
  const scope_of_work = formData?.scope_of_work || {};
  const deliverables = scope_of_work.deliverables || {};
  const events = Array.isArray(deliverables.events) ? deliverables.events : [];
  const numberOfEvents = events.length;

  useEffect(() => {
    const updates: any = {};
    if (financial_terms.payment_method !== "BANK_TRANSFER") {
      updates.payment_method = "BANK_TRANSFER";
    }
    if (financial_terms.model !== "FIXED") {
      updates.model = "FIXED";
    }
    if (Object.keys(updates).length > 0) {
      onUpdate(updates);
    }
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
        <CardTitle className="flex items-center gap-3">
          <FaDollarSign className="w-6 h-6 text-emerald-600" />
          <div>
            <h2 className="text-xl font-bold">Fixed Payment Terms</h2>
            <p className="text-sm text-gray-600 font-normal">
              Configure financial terms for brand ambassador contract
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {start_date && end_date && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Contract Period</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Start Date:</span>{" "}
                {new Date(start_date).toLocaleDateString("vi-VN")}
              </div>
              <div>
                <span className="font-medium">End Date:</span>{" "}
                {new Date(end_date).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </Card>
        )}

        <div>
          <Label className="text-sm font-medium mb-2 block">Payment Method</Label>
          <div className="p-2.5 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">
            Bank Transfer (Default)
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Payment method is fixed as Bank Transfer for this contract type.
          </p>
        </div>

        {numberOfEvents > 0 && (
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-medium text-green-900 mb-3">Event & Milestone Overview</h4>
            <div className="text-sm space-y-3">
              <div>
                <span className="font-medium">Number of Events:</span> {numberOfEvents}
              </div>
              <div>
                <span className="font-medium">Event List:</span>
                <div className="mt-2 space-y-2">
                  {events.map((event: any, i: number) => (
                    <div
                      key={event.id || i}
                      className="bg-white p-2 rounded border border-green-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-green-900">
                            {event.name || `Event #${i + 1}`}
                          </div>
                          <div className="text-xs text-green-700 mt-1 space-y-1">
                            <div>
                              {event.date
                                ? new Date(event.date).toLocaleDateString("vi-VN") +
                                  " " +
                                  new Date(event.date).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Date TBD"}
                            </div>
                            <div>{event.location || "Location TBD"}</div>
                            <div>{event.expected_duration || "Duration TBD"}</div>
                          </div>
                        </div>
                        <div className="text-xs bg-green-100 px-2 py-1 rounded">Event #{i + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">Milestone Requirements:</span>
                {numberOfEvents === 1
                  ? " Maximum 1 milestone allowed"
                  : ` Minimum 1, Maximum ${numberOfEvents} milestones allowed`}
              </div>
              <p className="text-green-700 text-xs mt-2 bg-green-100 p-2 rounded">
                <strong>Payment Rules:</strong> Each event can only be linked to ONE milestone. Each
                milestone can link to multiple events. Payment dates must be scheduled after the
                linked event dates.
              </p>
            </div>
          </Card>
        )}

        <PaymentSchedule
          schedules={financial_terms.schedule || []}
          totalCost={financial_terms.total_cost || 0}
          onUpdate={(schedule) => {
            onUpdate({ schedule });
          }}
          startDate={start_date}
          endDate={end_date}
          depositPercent={formData.deposit_percent || 0}
          numberOfEvents={numberOfEvents}
          events={events}
        />
      </CardContent>
    </Card>
  );
};

export default BrandAmbassadorScope;
