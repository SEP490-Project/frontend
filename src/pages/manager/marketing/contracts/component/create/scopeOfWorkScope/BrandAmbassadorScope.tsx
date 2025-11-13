import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaCrown, FaBullseye, FaScroll, FaTrash, FaPlus } from "react-icons/fa6";
import {
  CollapsibleSection,
  DynamicListInput,
  CompactKPISelector,
} from "../shared/SharedComponents";
import type { EventItem, ScopeOfWorkProps } from "../types/scopeTypes";
import DateTimePicker from "@/components/date-time-picker";
import DurationPicker from "@/components/duration-picker";
import AddressSelector from "@/components/global/AddressSelector";
import { WarningDialog } from "@/components/global";

const BrandAmbassadorScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const scope = formData?.scope_of_work || {}; // Changed from scopeOfWork to scope_of_work
  const deliverables = scope.deliverables || {};
  const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);
  const eventsList = ensureArray(deliverables.events);

  const contractStartDate = formData?.start_date; // snake_case
  const contractEndDate = formData?.end_date; // snake_case

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    itemIdx: number | null;
    itemName: string;
  }>({
    isOpen: false,
    itemIdx: null,
    itemName: "",
  });

  const updateDeliverables = useCallback(
    (partialDeliverables: any) => {
      const updated = { ...deliverables, ...partialDeliverables };
      onUpdateScopeOfWork({ ...scope, deliverables: updated });
    },
    [deliverables, onUpdateScopeOfWork, scope],
  );

  const newEvent = (): EventItem => ({
    id: 0,
    name: "",
    date: "",
    location: "",
    expected_duration: "", // snake_case
    activities: [""],
    representation_rules: [""], // snake_case
    kpis: [{ metric: "", target: "", description: "" }],
  });

  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (formData && (!deliverables.events || deliverables.events.length === 0)) {
      updateDeliverables({
        events: [{ ...newEvent(), id: 1 }],
      });
    }
  }, [formData, deliverables.events, updateDeliverables]);

  const handleConfirmDelete = () => {
    if (deleteDialog.itemIdx !== null) {
      const updatedEvents = eventsList.filter((_, idx) => idx !== deleteDialog.itemIdx);
      updateDeliverables({ events: updatedEvents });
    }
    setDeleteDialog({ isOpen: false, itemIdx: null, itemName: "" });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100">
          <CardTitle className="flex items-center justify-between text-pink-900">
            <div className="flex items-center gap-2">
              <FaCrown className="w-5 h-5" style={{ color: "#ff9fb2" }} />
              Brand Ambassador Events & Appearances
            </div>
            <span className="text-sm font-semibold text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
              {eventsList.length} items
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
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

          {eventsList.map((event: EventItem, i: number) => {
            const events = [...eventsList];
            const isDefaultOpen = i === 0 || i === eventsList.length - 1;
            const eventName = event.name || `Event #${i + 1}`;

            const openDeleteDialog = (e: React.MouseEvent) => {
              e.stopPropagation();
              setDeleteDialog({
                isOpen: true,
                itemIdx: i,
                itemName: eventName,
              });
            };

            const DeleteActionComponent = (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50"
                onClick={openDeleteDialog}
              >
                <FaTrash className="w-4 h-4" />
              </Button>
            );

            return (
              <CollapsibleSection
                key={i}
                title={eventName}
                defaultOpen={isDefaultOpen}
                actionComponent={DeleteActionComponent}
              >
                <div className="p-4 space-y-4">
                  <div>
                    <Label htmlFor={`event-name-${i}`}>Event Name</Label>
                    <Input
                      id={`event-name-${i}`}
                      placeholder="e.g., Brand talk show, Commercial photo shoot"
                      value={event.name || ""}
                      onChange={(e) => {
                        const updated = [...events];
                        updated[i] = {
                          ...updated[i],
                          name: e.target.value,
                          id: i + 1,
                        };
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
                          : new Date().toLocaleDateString("en-CA")
                      }
                      maxDate={contractEndDate ? formatDateForInput(contractEndDate) : undefined}
                      className="bg-white"
                    />

                    <DurationPicker
                      label="Expected Duration"
                      value={event.expected_duration || ""} // snake_case
                      onChange={(duration) => {
                        const updated = [...events];
                        updated[i] = { ...updated[i], expected_duration: duration }; // snake_case
                        updateDeliverables({ events: updated });
                      }}
                      placeholder="Select duration"
                      maxHours={3}
                      className="bg-white"
                    />
                  </div>

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
                    addLabel="Add Activity"
                  />

                  <DynamicListInput
                    label="Representation Rules & Requirements"
                    icon={<FaScroll className="w-4 h-4" />}
                    items={event.representation_rules || []} // snake_case
                    placeholder="e.g., Must wear formal attire with long leggings, Wear light makeup"
                    helpText="Dress code, behavior guidelines, and specific requirements"
                    multiline
                    onChange={(representation_rules) => {
                      // snake_case
                      const updated = [...events];
                      updated[i] = { ...updated[i], representation_rules }; // snake_case
                      updateDeliverables({ events: updated });
                    }}
                    addLabel="Add Rule"
                  />

                  <div className="border-t pt-4">
                    <CompactKPISelector
                      contractType="BRAND_AMBASSADOR"
                      kpis={(event.kpis || []).map((kpi: any) => ({
                        metric: kpi.type || kpi.metric || "",
                        target: kpi.target_value || kpi.target || "", // snake_case
                        description: kpi.description || "",
                      }))}
                      onChange={(kpis) => {
                        const updated = [...events];
                        updated[i] = { ...updated[i], kpis };
                        updateDeliverables({ events: updated });
                      }}
                    />
                  </div>
                </div>
              </CollapsibleSection>
            );
          })}

          <Button
            variant="outline"
            onClick={() =>
              updateDeliverables({
                events: [...eventsList, { ...newEvent(), id: eventsList.length + 1 }],
              })
            }
            className="w-full py-6 border-2 border-dashed hover:bg-pink-50"
            style={{ borderColor: "#ff9fb2" }}
          >
            <FaPlus className="w-5 h-5 mr-2" style={{ color: "#ff9fb2" }} /> Add New Event
          </Button>
        </CardContent>
      </Card>

      <WarningDialog
        isOpen={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, isOpen: open }))}
        title="Confirm Event Deletion"
        description={`You are deleting the event: "${deleteDialog.itemName}".`}
        warningMessage="This action cannot be undone and will permanently delete this data."
        additionalInfo="Please confirm to proceed."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, itemIdx: null, itemName: "" })}
        confirmText="Delete Permanently"
      />
    </div>
  );
};

export default BrandAmbassadorScope;
