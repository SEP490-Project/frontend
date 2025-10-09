import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

interface Contract {
  id: string;
  name: string;
  type: string;
}
interface Assignee {
  id: string;
  name: string;
}

const mockContracts: Contract[] = [
  { id: "550e8400-e29b-41d4-a716-446655440000", name: "GlowSkin 2025", type: "AD_CAMPAIGN" },
  { id: "660e8400-e29b-41d4-a716-446655440001", name: "F&B Launch Q2", type: "MARKETING" },
  { id: "770e8400-e29b-41d4-a716-446655440002", name: "Holiday Promo", type: "PROMOTION" },
];

const mockAssignees: Assignee[] = [
  { id: "a1e8400-e29b-41d4-a716-446655440010", name: "Alice Nguyen" },
  { id: "b2e8400-e29b-41d4-a716-446655440011", name: "Bob Tran" },
  { id: "c3e8400-e29b-41d4-a716-446655440012", name: "Charlie Le" },
];

const campaignTypes = [
  { value: "ADVERTISING", label: "Advertising" },
  { value: "MARKETING", label: "Marketing" },
  { value: "PROMOTION", label: "Promotion" },
  { value: "OTHER", label: "Other" },
];

function formatToISO(dateStr?: string | null) {
  if (!dateStr) return null;
  // ensure time and Z
  // If dateStr already includes time zone, Date will handle it; but we expect YYYY-MM-DD from input
  const iso = new Date(dateStr + "T00:00:00Z").toISOString();
  return iso;
}

const SetUpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("campaign");

  // Campaign-level state (matches schema)
  const [campaignData, setCampaignData] = useState({
    name: "",
    type: "ADVERTISING",
    description: "",
    start_date: "", // YYYY-MM-DD
    end_date: "",
    contract_id: "",
    budget_projected: "" as string | number,
  });

  // Milestones array
  const [milestones, setMilestones] = useState<
    {
      id: string;
      description: string;
      due_date: string; // YYYY-MM-DD
      tasks: {
        id: string;
        name: string;
        type: string;
        description: string;
        deadline: string; // YYYY-MM-DD
        assigned_to: string;
      }[];
    }[]
  >([]);

  // Helpers
  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: "",
        due_date: "",
        tasks: [],
      },
    ]);
  };

  const removeMilestone = (id: string) => setMilestones((prev) => prev.filter((m) => m.id !== id));

  const updateMilestone = (id: string, patch: Partial<any>) =>
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const addTask = (milestoneId: string) =>
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              tasks: [
                ...m.tasks,
                {
                  id: crypto.randomUUID(),
                  name: "",
                  type: "",
                  description: "",
                  deadline: "",
                  assigned_to: "",
                },
              ],
            }
          : m,
      ),
    );

  const removeTask = (milestoneId: string, taskId: string) =>
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId ? { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) } : m,
      ),
    );

  const updateTask = (milestoneId: string, taskId: string, patch: Partial<any>) =>
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
            }
          : m,
      ),
    );

  const isCampaignValid = useMemo(() => {
    return (
      !!campaignData.name &&
      !!campaignData.contract_id &&
      !!campaignData.start_date &&
      !!campaignData.end_date
    );
  }, [campaignData]);

  const toPayload = () => {
    // Build payload matching user's schema example
    const payload: any = {
      name: campaignData.name,
      type: campaignData.type,
      description: campaignData.description,
      start_date: formatToISO(campaignData.start_date) || null,
      end_date: formatToISO(campaignData.end_date) || null,
      contract_id: campaignData.contract_id || null,
      budget_projected:
        campaignData.budget_projected === "" ? null : Number(campaignData.budget_projected),
      milestones: milestones.map((m) => ({
        description: m.description,
        due_date: formatToISO(m.due_date) || null,
        tasks: m.tasks.map((t) => ({
          assigned_to: t.assigned_to || null,
          deadline: formatToISO(t.deadline) || null,
          description: t.description,
          name: t.name,
          type: t.type || null,
        })),
      })),
    };
    return payload;
  };

  const handleSubmit = () => {
    const payload = toPayload();
    // Replace with real API call later
    console.log("Create Campaign Payload:", payload);
    alert("✅ Payload logged to console (mock submit).");
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Set Up Workflow</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill the form below to create a campaign following the data schema.
        </p>
      </div>

      <Card className="p-6 mb-6">
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="campaign">Campaign</TabsTrigger>
              <TabsTrigger value="milestone">Milestone</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            {/* Campaign Tab (includes contract selection and campaign details) */}
            <TabsContent value="campaign" className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Contract & Identification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm">Contract</Label>
                      <Select
                        onValueChange={(v) => setCampaignData((s) => ({ ...s, contract_id: v }))}
                        value={campaignData.contract_id || undefined}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select contract..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockContracts.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium">{c.name}</span>
                                <Badge variant="secondary" className="capitalize">
                                  {c.type.toLowerCase().replace("_", " ")}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Campaign Type</Label>
                      <Select
                        onValueChange={(v) => setCampaignData((s) => ({ ...s, type: v }))}
                        value={campaignData.type || undefined}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {campaignTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Budget</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm">Projected Budget</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 10000.50"
                        value={campaignData.budget_projected as any}
                        onChange={(e) =>
                          setCampaignData((s) => ({ ...s, budget_projected: e.target.value }))
                        }
                        className="h-11"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="md:col-span-2">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Campaign Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm">Campaign Name</Label>
                        <Input
                          placeholder="Summer Sale Campaign"
                          value={campaignData.name}
                          onChange={(e) => setCampaignData((s) => ({ ...s, name: e.target.value }))}
                          className="h-11"
                        />
                      </div>

                      <div>
                        <Label className="text-sm">Description</Label>
                        <Textarea
                          placeholder="A campaign for the summer sale."
                          value={campaignData.description}
                          onChange={(e) =>
                            setCampaignData((s) => ({ ...s, description: e.target.value }))
                          }
                          className="min-h-[120px]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm">Start Date</Label>
                        <Input
                          type="date"
                          value={campaignData.start_date}
                          onChange={(e) =>
                            setCampaignData((s) => ({ ...s, start_date: e.target.value }))
                          }
                          className="h-11"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">End Date</Label>
                        <Input
                          type="date"
                          value={campaignData.end_date}
                          onChange={(e) =>
                            setCampaignData((s) => ({ ...s, end_date: e.target.value }))
                          }
                          className="h-11"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <div />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // reset form if needed
                      setCampaignData({
                        name: "",
                        type: "",
                        description: "",
                        start_date: "",
                        end_date: "",
                        contract_id: "",
                        budget_projected: "",
                      });
                      setMilestones([]);
                    }}
                  >
                    Reset
                  </Button>
                  <Button onClick={() => setActiveTab("milestone")} disabled={!isCampaignValid}>
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Milestone Tab */}
            <TabsContent value="milestone" className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Milestones</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={addMilestone}
                      className="flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Milestone
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {milestones.length === 0 && (
                    <Card className="border-0">
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          No milestones yet. Click "Add Milestone" to start.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {milestones.map((m, mi) => (
                    <Card key={m.id} className="border border-gray-200/60 shadow-sm">
                      <CardHeader className="flex justify-between items-center bg-gray-50 p-4">
                        <div>
                          <CardTitle className="text-sm font-semibold">
                            Milestone {mi + 1}
                          </CardTitle>
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {m.due_date || "Not set"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMilestone(m.id)}
                            className="hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 p-4">
                        <div>
                          <Label className="text-sm">Description</Label>
                          <Textarea
                            placeholder="Milestone description..."
                            value={m.description}
                            onChange={(e) => updateMilestone(m.id, { description: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Due Date</Label>
                          <Input
                            type="date"
                            value={m.due_date}
                            onChange={(e) => updateMilestone(m.id, { due_date: e.target.value })}
                            className="h-11"
                          />
                        </div>

                        {/* Tasks */}
                        <div className="space-y-3 mt-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Tasks</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addTask(m.id)}
                              className="flex items-center gap-2"
                            >
                              <Plus size={12} /> Add Task
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {m.tasks.map((t) => (
                              <Card key={t.id} className="border rounded-md">
                                <CardContent className="p-4">
                                  <div className="grid md:grid-cols-3 gap-3">
                                    <div>
                                      <Label className="text-sm">Task Name</Label>
                                      <Input
                                        placeholder="Design Banner Ads"
                                        value={t.name}
                                        onChange={(e) =>
                                          updateTask(m.id, t.id, { name: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm">Type</Label>
                                      <Input
                                        placeholder="e.g. PRODUCT"
                                        value={t.type}
                                        onChange={(e) =>
                                          updateTask(m.id, t.id, { type: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm">Deadline</Label>
                                      <Input
                                        type="date"
                                        value={t.deadline}
                                        onChange={(e) =>
                                          updateTask(m.id, t.id, { deadline: e.target.value })
                                        }
                                        className="h-11"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                                    <div>
                                      <Label className="text-sm">Assigned To</Label>
                                      <Select
                                        onValueChange={(v) =>
                                          updateTask(m.id, t.id, { assigned_to: v })
                                        }
                                        value={t.assigned_to || undefined}
                                      >
                                        <SelectTrigger className="h-11">
                                          <SelectValue placeholder="Select assignee..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {mockAssignees.map((a) => (
                                            <SelectItem key={a.id} value={a.id}>
                                              {a.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <Label className="text-sm">Description</Label>
                                      <Textarea
                                        placeholder="Task details..."
                                        value={t.description}
                                        onChange={(e) =>
                                          updateTask(m.id, t.id, { description: e.target.value })
                                        }
                                        className="min-h-[72px]"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex justify-end mt-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeTask(m.id, t.id)}
                                    >
                                      Remove Task
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setActiveTab("campaign")}>
                    Back
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setActiveTab("review")}
                      disabled={milestones.length === 0}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Review Tab */}
            <TabsContent value="review" className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Campaign Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between border-b py-2">
                      <span className="text-sm text-gray-600">Name</span>
                      <span className="font-medium">{campaignData.name || "—"}</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                      <span className="text-sm text-gray-600">Type</span>
                      <span className="font-medium">{campaignData.type || "—"}</span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                      <span className="text-sm text-gray-600">Contract</span>
                      <span className="font-medium">
                        {mockContracts.find((c) => c.id === campaignData.contract_id)?.name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                      <span className="text-sm text-gray-600">Start → End</span>
                      <span className="font-medium">
                        {campaignData.start_date ? campaignData.start_date : "—"} →{" "}
                        {campaignData.end_date ? campaignData.end_date : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                      <span className="text-sm text-gray-600">Projected Budget</span>
                      <span className="font-medium">{campaignData.budget_projected || "—"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Milestones Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Total milestones: <span className="font-medium">{milestones.length}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Total tasks:{" "}
                      <span className="font-medium">
                        {milestones.reduce((acc, m) => acc + m.tasks.length, 0)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      {milestones.map((m, i) => (
                        <div key={m.id} className="p-3 border rounded-md">
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <div className="text-sm font-semibold">Milestone {i + 1}</div>
                              <div className="text-xs text-gray-500">
                                {m.description || "No description"}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Due: {m.due_date || "—"}
                              </div>
                            </div>
                            <Badge variant="secondary">{m.tasks.length} tasks</Badge>
                          </div>

                          <div className="mt-3 space-y-2">
                            {m.tasks.map((t) => (
                              <div key={t.id} className="p-2 bg-gray-50 rounded-md border">
                                <div className="flex justify-between items-center">
                                  <div className="text-sm font-medium">
                                    {t.name || "Untitled task"}
                                  </div>
                                  <div className="text-xs text-gray-500">{t.type || "—"}</div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {t.description || "No description"}
                                </div>
                                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                                  <div>Deadline: {t.deadline || "—"}</div>
                                  <div>
                                    Assigned:{" "}
                                    {mockAssignees.find((a) => a.id === t.assigned_to)?.name || "—"}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm md:col-span-1">
                  <CardHeader>
                    <CardTitle>JSON Payload Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-72 p-4 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap break-words">
                        {JSON.stringify(toPayload(), null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-end justify-end gap-3">
                  <Button variant="outline" onClick={() => setActiveTab("milestone")}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit}>Submit</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetUpPage;
