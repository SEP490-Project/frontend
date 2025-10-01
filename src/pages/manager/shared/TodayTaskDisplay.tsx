import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Task } from "../sale/mock-data/sale-mock-data";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import React from "react";

const TodayTaskDisplay = ({ tasks }: { tasks: Task[] }) => {
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  if (tasks.length === 0) {
    return <div>No tasks available</div>;
  }

  const sortedTasks = tasks.sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
  );

  const todayTasks = sortedTasks.filter((task) => {
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    deadlineDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const currentDateTask = new Date(deadlineDate);
    const taskDate = new Date(currentDateTask.setDate(currentDateTask.getDate() - 1));

    return taskDate.getTime() === today.getTime() || deadlineDate.getTime() === today.getTime();
  });

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
          Today's Tasks
        </DialogTitle>
        <DialogDescription>Choose a Task from the list below to Add Product</DialogDescription>
      </DialogHeader>
      {todayTasks.map((task) => (
        <CardTask
          key={task.id}
          task={task}
          selectedTask={selectedTask}
          onSelect={handleTaskSelect}
        />
      ))}
      <DialogFooter>
        <Button
          className="bg-primary hover:bg-[#f794a8] text-white px-4 py-2 rounded"
          disabled={!selectedTask}
        >
          Next
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const CardTask = ({
  task,
  onSelect,
  selectedTask,
}: {
  task: Task;
  onSelect: (task: Task) => void;
  selectedTask: Task | null;
}) => {
  return (
    <Card
      onClick={() => onSelect(task)}
      className={`mb-4 cursor-pointer hover:shadow-lg transition-shadow ${selectedTask?.id === task.id ? "bg-neutral-50 border-primary" : ""}`}
    >
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className={`${selectedTask?.id === task.id ? "text-primary" : ""}`}>
            {task.name}
          </CardTitle>
          <CardDescription>
            Deadline: <span className="text-red-600 font-semibold">{task.deadline}</span>
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Proposal</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Task Details</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-sm text-muted-foreground">{task.description.details}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayTaskDisplay;
