import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { FaCrown, FaCalendarDay, FaBullseye, FaScroll, FaChartLine } from "react-icons/fa6";
import { CollapsibleSection, DynamicListInput } from "../shared/SharedComponents";
import type { EventItem, ScopeOfWorkProps } from "../types/scopeTypes";
import DateTimePicker from "@/components/date-time-picker";
import DurationPicker from "@/components/duration-picker";
import { KPISelector } from "@/components/global";
import AddressSelector from "@/components/global/AddressSelector"; // Import AddressSelector

const BrandAmbassadorScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const scope = formData?.scopeOfWork || {};
  const deliverables = scope.deliverables || {};

  // Get contract date limits
  const contractStartDate = formData?.startDate;
  const contractEndDate = formData?.endDate;

  const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);

  const updateDeliverables = (partialDeliverables: any) => {
    const updated = { ...deliverables, ...partialDeliverables };
    onUpdateScopeOfWork({ ...scope, deliverables: updated });
  };

  const newEvent = (): EventItem => ({
    id: 0,
    name: "",
    date: "",
    location: "",
    expected_duration: "",
    activities: [],
    representation_rules: [],
    kpis: [],
  });

  // Helper function to format date for minDate/maxDate
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Format to YYYY-MM-DD for consistency with date inputs
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100">
          <CardTitle className="flex items-center gap-2 text-pink-900">
            <FaCrown className="w-5 h-5" style={{ color: "#ff9fb2" }} />
            Brand Ambassador Events & Appearances
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Contract Period Info */}
          {contractStartDate && contractEndDate && (
            <Card className="p-4 bg-blue-50 border-blue-200 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Contract Period</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Start Date:</span>{" "}
                  {new Date(contractStartDate).toLocaleDateString("vi-VN")}
                </div>
                <div>
                  <span className="font-medium">End Date:</span>{" "}
                  {new Date(contractEndDate).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                Events can only be scheduled within this contract period
              </p>
            </Card>
          )}

          {/* Events & Appearances */}
          <CollapsibleSection
            title="Events & Special Appearances"
            badge={ensureArray(deliverables.events).length}
            defaultOpen={true}
          >
            <div className="space-y-4">
              {ensureArray(deliverables.events).map((event: EventItem, i: number) => {
                const events = ensureArray(deliverables.events);
                return (
                  <div
                    key={i}
                    className="border-2 rounded-xl p-4 bg-gradient-to-br from-pink-25 to-white"
                    style={{ borderColor: "#ff9fb2" }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <Label
                        className="font-semibold flex items-center gap-2"
                        style={{ color: "#d6336c" }}
                      >
                        <FaCalendarDay className="w-4 h-4" />
                        Event #{i + 1}
                      </Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() =>
                          updateDeliverables({ events: events.filter((_, idx) => idx !== i) })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Event Basic Info */}
                      <div>
                        <Label htmlFor={`event-name-${i}`}>Event Name</Label>
                        <Input
                          id={`event-name-${i}`}
                          placeholder="e.g., Brand talk show, Commercial photo shoot"
                          value={event.name || ""}
                          onChange={(e) => {
                            const updated = [...events];
                            updated[i] = { ...updated[i], name: e.target.value, id: i + 1 };
                            updateDeliverables({ events: updated });
                          }}
                          className="bg-white border-pink-200 focus:border-pink-400"
                        />
                      </div>

                      <div className="mb-4">
                        <AddressSelector
                          label="Location"
                          placeholder="Search for event address..."
                          value={event.location || ""}
                          onChange={(address) => {
                            const updated = [...events];
                            updated[i] = { ...updated[i], location: address };
                            updateDeliverables({ events: updated });
                          }}
                        />
                      </div>

                      {/* Date & Time + Expected Duration - two columns */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <DateTimePicker
                          label="Date & Time"
                          value={event.date || ""}
                          onChange={(dateTime) => {
                            const updated = [...events];
                            updated[i] = { ...updated[i], date: dateTime };
                            updateDeliverables({ events: updated });
                          }}
                          placeholder="Select date and time"
                          minDate={
                            contractStartDate
                              ? formatDateForInput(contractStartDate)
                              : new Date().toISOString().split("T")[0]
                          }
                          maxDate={
                            contractEndDate ? formatDateForInput(contractEndDate) : undefined
                          }
                          className="bg-white"
                        />

                        <DurationPicker
                          label="Expected Duration"
                          value={event.expected_duration || ""}
                          onChange={(duration) => {
                            const updated = [...events];
                            updated[i] = { ...updated[i], expected_duration: duration };
                            updateDeliverables({ events: updated });
                          }}
                          placeholder="Select duration"
                          maxHours={3}
                          className="bg-white"
                        />
                      </div>

                      {/* Event Activities */}
                      <DynamicListInput
                        label="Event Activities"
                        icon={<FaBullseye className="w-4 h-4" />}
                        items={event.activities || []}
                        placeholder="e.g., Interview with the show MC, Attends press photo"
                        helpText="Specific activities and tasks during the event"
                        multiline
                        onChange={(activities) => {
                          const updated = [...events];
                          updated[i] = { ...updated[i], activities };
                          updateDeliverables({ events: updated });
                        }}
                      />

                      {/* Representation Rules */}
                      <DynamicListInput
                        label="Representation Rules & Requirements"
                        icon={<FaScroll className="w-4 h-4" />}
                        items={event.representation_rules || []}
                        placeholder="e.g., Must wear formal attire with long leggings, Wear light makeup"
                        helpText="Dress code, behavior guidelines, and specific requirements"
                        multiline
                        onChange={(representation_rules) => {
                          const updated = [...events];
                          updated[i] = { ...updated[i], representation_rules };
                          updateDeliverables({ events: updated });
                        }}
                      />

                      {/* KPIs */}
                      <div className="border-t pt-4">
                        <Label className="text-sm font-medium mb-3 flex items-center gap-2 text-pink-800">
                          <FaChartLine className="w-4 h-4" />
                          Key Performance Indicators
                        </Label>
                        <KPISelector
                          kpis={(event.kpis || []).map((kpi: any) => ({
                            id: kpi.id ?? "",
                            type: kpi.type ?? "",
                            target_value: kpi.target_value ?? "",
                            unit: kpi.unit ?? "",
                            ...kpi,
                          }))}
                          onChange={(kpis) => {
                            const updated = [...events];
                            updated[i] = { ...updated[i], kpis };
                            updateDeliverables({ events: updated });
                          }}
                          contractType={formData?.type}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add New Event Button */}
              <Button
                variant="outline"
                onClick={() =>
                  updateDeliverables({
                    events: [
                      ...ensureArray(deliverables.events),
                      { ...newEvent(), id: ensureArray(deliverables.events).length + 1 },
                    ],
                  })
                }
                className="w-full py-6 border-2 border-dashed hover:bg-pink-50"
                style={{ borderColor: "#ff9fb2" }}
              >
                <Plus className="w-5 h-5 mr-2" style={{ color: "#ff9fb2" }} /> Add New Event
              </Button>

              {/* Empty State */}
              {ensureArray(deliverables.events).length === 0 && (
                <div
                  className="text-center py-12 bg-pink-50 rounded-lg border-2 border-dashed"
                  style={{ borderColor: "#ff9fb2" }}
                >
                  <FaCalendarDay className="w-12 h-12 mx-auto mb-4" style={{ color: "#ff9fb2" }} />
                  <h3 className="text-lg font-medium text-pink-900 mb-2">No Events Scheduled</h3>
                  <p className="text-pink-700 mb-4">
                    Add brand ambassador events like talk shows, photo shoots, or special
                    appearances.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateDeliverables({
                        events: [{ ...newEvent(), id: 1 }],
                      })
                    }
                    className="border-pink-300 text-pink-700 hover:bg-pink-100"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Create First Event
                  </Button>
                </div>
              )}
            </div>
          </CollapsibleSection>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandAmbassadorScope;
