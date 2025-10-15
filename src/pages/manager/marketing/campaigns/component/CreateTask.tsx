import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface Assignee {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  type: string;
  description: string;
  deadline: string;
  assigned_to: string;
}

interface Milestone {
  id: string;
  description: string;
  due_date: string;
  tasks: Task[];
}

interface CreateTaskProps {
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
  mockAssignees: Assignee[];
  onBack: () => void;
  onNext: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({
  milestones,
  setMilestones,
  mockAssignees,
  onBack,
  onNext,
}) => {
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

  return (
    <div className="pt-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Milestones</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={addMilestone} className="flex items-center gap-2">
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
                  <CardTitle className="text-sm font-semibold">Milestone {mi + 1}</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">Due: {m.due_date || "Not set"}</p>
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
                                onChange={(e) => updateTask(m.id, t.id, { name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Type</Label>
                              <Input
                                placeholder="e.g. PRODUCT"
                                value={t.type}
                                onChange={(e) => updateTask(m.id, t.id, { type: e.target.value })}
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
                                onValueChange={(v) => updateTask(m.id, t.id, { assigned_to: v })}
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
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <div className="flex gap-3">
            <Button onClick={onNext} disabled={milestones.length === 0}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
