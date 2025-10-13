import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  FaCrown,
  FaCalendarDay,
  FaLocationDot,
  FaClock,
  FaBullseye,
  FaScroll,
  FaChartLine,
} from "react-icons/fa6";
import { CollapsibleSection, KPIFields, DynamicListInput } from "../shared/SharedComponents";
import type { EventItem, ScopeOfWorkProps } from "../types/scopeTypes";

const BrandAmbassadorScope: React.FC<ScopeOfWorkProps> = ({ formData, onUpdateScopeOfWork }) => {
  const scope = formData?.scopeOfWork || {};
  const deliverables = scope.deliverables || {};

  const ensureArray = (arr: any) => (Array.isArray(arr) ? arr : []);

  const updateDeliverables = (partialDeliverables: any) => {
    const updated = { ...deliverables, ...partialDeliverables };
    onUpdateScopeOfWork({ ...scope, deliverables: updated });
  };

  const newEvent = (): EventItem => ({
    name: "",
    date: "",
    location: "",
    expected_duration: "",
    activities: [],
    representation_rules: [],
    kpis: [],
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
          <CardTitle className="flex items-center gap-2">
            <FaCrown className="w-5 h-5 text-orange-600" />
            Brand Ambassador Events & Appearances
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
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
                    className="border-2 border-orange-100 rounded-xl p-4 bg-gradient-to-br from-orange-25 to-white"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <Label className="font-semibold text-orange-800 flex items-center gap-2">
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
                        <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <FaCalendarDay className="w-4 h-4" />
                          Event Name
                        </Label>
                        <Input
                          placeholder="e.g., Brand talk show, Commercial photo shoot"
                          value={event.name || ""}
                          onChange={(e) => {
                            const updated = [...events];
                            updated[i] = { ...updated[i], name: e.target.value };
                            updateDeliverables({ events: updated });
                          }}
                          className="bg-white"
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                            <FaLocationDot className="w-4 h-4" />
                            Location
                          </Label>
                          <Input
                            placeholder="e.g., Studio A, Downtown Hotel"
                            value={event.location || ""}
                            onChange={(e) => {
                              const updated = [...events];
                              updated[i] = { ...updated[i], location: e.target.value };
                              updateDeliverables({ events: updated });
                            }}
                            className="bg-white"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Details will be aggregated with location API
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                            <FaCalendarDay className="w-4 h-4" />
                            Date & Time
                          </Label>
                          <Input
                            type="datetime-local"
                            value={event.date || ""}
                            onChange={(e) => {
                              const updated = [...events];
                              updated[i] = { ...updated[i], date: e.target.value };
                              updateDeliverables({ events: updated });
                            }}
                            className="bg-white"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                            <FaClock className="w-4 h-4" />
                            Expected Duration
                          </Label>
                          <Input
                            placeholder="e.g., 1H, 5H, 30mins"
                            value={event.expected_duration || ""}
                            onChange={(e) => {
                              const updated = [...events];
                              updated[i] = { ...updated[i], expected_duration: e.target.value };
                              updateDeliverables({ events: updated });
                            }}
                            className="bg-white"
                          />
                        </div>
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
                        <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                          <FaChartLine className="w-4 h-4" />
                          Key Performance Indicators
                        </Label>
                        <KPIFields
                          kpis={event.kpis || []}
                          onChange={(kpis) => {
                            const updated = [...events];
                            updated[i] = { ...updated[i], kpis };
                            updateDeliverables({ events: updated });
                          }}
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
                    events: [...ensureArray(deliverables.events), newEvent()],
                  })
                }
                className="w-full py-6 border-2 border-dashed border-orange-200 hover:border-orange-300 hover:bg-orange-50"
              >
                <Plus className="w-5 h-5 mr-2" /> Add New Event
              </Button>

              {/* Empty State */}
              {ensureArray(deliverables.events).length === 0 && (
                <div className="text-center py-12 bg-orange-50 rounded-lg border-2 border-dashed border-orange-200">
                  <FaCalendarDay className="w-12 h-12 mx-auto text-orange-300 mb-4" />
                  <h3 className="text-lg font-medium text-orange-900 mb-2">No Events Scheduled</h3>
                  <p className="text-orange-700 mb-4">
                    Add brand ambassador events like talk shows, photo shoots, or special
                    appearances.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateDeliverables({
                        events: [newEvent()],
                      })
                    }
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Create First Event
                  </Button>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Event Summary */}
          {ensureArray(deliverables.events).length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-orange-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900 flex items-center gap-2">
                      <FaChartLine className="w-4 h-4" />
                      Event Summary
                    </h4>
                    <p className="text-sm text-blue-700">
                      {ensureArray(deliverables.events).length} event(s) scheduled for brand
                      ambassador
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      {ensureArray(deliverables.events).length}
                    </div>
                    <div className="text-xs text-gray-600">Total Events</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandAmbassadorScope;
