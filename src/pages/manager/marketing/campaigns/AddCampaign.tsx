import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/libs/utils";
import FileUploader from "@/components/global/FileUploader";
import { Card } from "@/components/ui/card";

interface Task {
  id: string;
  name: string;
  deadline: Date | null;
  type: string;
  status: string;
  files: File[];
}

interface Milestone {
  id: string;
  description: string;
  due_date: Date | null;
  tasks: Task[];
}

const initialTask: Task = {
  id: crypto.randomUUID(),
  name: "",
  deadline: null,
  type: "",
  status: "TODO",
  files: [],
};

const initialMilestone: Milestone = {
  id: crypto.randomUUID(),
  description: "",
  due_date: null,
  tasks: [],
};

const AddCampaignPage: React.FC = () => {
  const [campaign, setCampaign] = useState({
    name: "",
    description: "",
    start_date: null as Date | null,
    end_date: null as Date | null,
    status: "ON_GOING",
    budget_projected: "",
    type: "",
  });
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Campaign handlers
  const handleCampaignChange = (field: string, value: any) =>
    setCampaign((prev) => ({ ...prev, [field]: value }));

  // Milestone handlers
  const addMilestone = () =>
    setMilestones((prev) => [...prev, { ...initialMilestone, id: crypto.randomUUID() }]);
  const removeMilestone = (id: string) => setMilestones((prev) => prev.filter((m) => m.id !== id));
  const updateMilestone = (id: string, data: Partial<Milestone>) =>
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));

  // Task handlers
  const addTask = (milestoneId: string) =>
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? { ...m, tasks: [...m.tasks, { ...initialTask, id: crypto.randomUUID() }] }
          : m,
      ),
    );
  const removeTask = (milestoneId: string, taskId: string) =>
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId ? { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) } : m,
      ),
    );
  const updateTask = (milestoneId: string, taskId: string, data: Partial<Task>) =>
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, ...data } : t)),
            }
          : m,
      ),
    );

  // File upload for task
  const handleTaskFilesChange = (milestoneId: string, taskId: string, files: File[]) => {
    updateTask(milestoneId, taskId, { files });
  };

  const handleSubmit = () => {
    console.log("Campaign Data:", {
      campaign,
      milestones,
    });
    alert("Campaign saved successfully!");
  };

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <div className="max-w-7xl mx-auto pb-10">
        <h1 className="text-2xl font-bold mb-6">Add Campaign</h1>

        {/* Campaign Information */}
        <Card className="p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Campaign Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Campaign Name *</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter campaign name"
                value={campaign.name}
                onChange={(e) => handleCampaignChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Campaign Type *</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter campaign type"
                value={campaign.type}
                onChange={(e) => handleCampaignChange("type", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline2"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !campaign.start_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {campaign.start_date
                      ? format(campaign.start_date, "dd/MM/yyyy")
                      : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={campaign.start_date ?? undefined}
                    onSelect={(date) => handleCampaignChange("start_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline2"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !campaign.end_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {campaign.end_date
                      ? format(campaign.end_date, "dd/MM/yyyy")
                      : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={campaign.end_date ?? undefined}
                    onSelect={(date) => handleCampaignChange("end_date", date)}
                    disabled={(date) => (campaign.start_date ? date < campaign.start_date : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Budget Projected</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter projected budget"
                type="number"
                min="0"
                value={campaign.budget_projected}
                onChange={(e) => handleCampaignChange("budget_projected", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter campaign description"
              rows={3}
              value={campaign.description}
              onChange={(e) => handleCampaignChange("description", e.target.value)}
            />
          </div>
        </Card>

        {/* Milestones */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Milestones</h2>
          <Button onClick={addMilestone}>+ Add Milestone</Button>
        </div>

        {milestones.length === 0 && (
          <Card className="p-8 text-center text-gray-500 mb-8">
            <p>No milestones added yet. Click "Add Milestone" to get started.</p>
          </Card>
        )}

        {milestones.map((milestone) => (
          <Card key={milestone.id} className="p-6 mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Milestone Description *</label>
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter milestone description"
                  value={milestone.description}
                  onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Due Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline2"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !milestone.due_date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {milestone.due_date
                        ? format(milestone.due_date, "dd/MM/yyyy")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={milestone.due_date ?? undefined}
                      onSelect={(date) => updateMilestone(milestone.id, { due_date: date })}
                      disabled={(date) =>
                        campaign.start_date ? date < campaign.start_date : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                variant="destructive"
                onClick={() => removeMilestone(milestone.id)}
                className="mt-6"
              >
                Remove
              </Button>
            </div>

            {/* Tasks for this milestone */}
            <div className="ml-4 border-l-2 border-gray-100 pl-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">Tasks</h3>
                <Button size="sm" onClick={() => addTask(milestone.id)} variant="outline">
                  + Add Task
                </Button>
              </div>

              {milestone.tasks.length === 0 && (
                <p className="text-gray-500 text-sm py-4">No tasks added for this milestone.</p>
              )}

              {milestone.tasks.map((task) => (
                <Card key={task.id} className="p-4 mb-3 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Task Name *</label>
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Enter task name"
                        value={task.name}
                        onChange={(e) =>
                          updateTask(milestone.id, task.id, { name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Deadline *</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline2"
                            size="sm"
                            className={cn(
                              "w-full justify-start text-left font-normal text-xs",
                              !task.deadline && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {task.deadline ? format(task.deadline, "dd/MM/yyyy") : "Select"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={task.deadline ?? undefined}
                            onSelect={(date) =>
                              updateTask(milestone.id, task.id, { deadline: date })
                            }
                            disabled={(date) =>
                              milestone.due_date ? date > milestone.due_date : false
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Type</label>
                      <input
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Task type"
                        value={task.type}
                        onChange={(e) =>
                          updateTask(milestone.id, task.id, { type: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* File Upload for Task */}
                  <div className="mb-3">
                    <FileUploader
                      maxFiles={5}
                      maxSize={10}
                      onFilesChange={(files: File[]) =>
                        handleTaskFilesChange(milestone.id, task.id, files)
                      }
                      title="Task Files"
                      allowedTypes={[
                        "pdf",
                        "doc",
                        "docx",
                        "xls",
                        "xlsx",
                        "jpg",
                        "jpeg",
                        "png",
                        "zip",
                        "rar",
                      ]}
                      showSummary={false}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeTask(milestone.id, task.id)}
                    >
                      Remove Task
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        ))}

        {/* Fixed Submit Actions */}
        <div className="sticky bottom-0 -mx-2 bg-white/80 border-t rounded-xl border-gray-200 shadow-lg z-40">
          <div className="flex justify-end gap-4 px-4 py-3">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handleSubmit}>Create Campaign</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCampaignPage;
