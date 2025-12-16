import { useTask } from "@/libs/hooks/useTask";
import { getTasksByProfile } from "@/libs/stores/taskManager/thunk";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Tag } from "lucide-react";
import { format } from "date-fns";
import type { Task } from "@/libs/types/task";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAppDispatch } from "@/libs/stores";
import { updateTaskStateThunk } from "@/libs/stores/stateManager/thunk";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TaskDetailDisplay } from "./TaskDetailDisplay";

export const TaskDisplay = () => {
  return <TaskList />;
};

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "in-progress":
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return dateString;
  }
};

const TaskCard = ({
  task,
  onClick,
  isSelected,
  setOnOpenTaskDetail,
}: {
  task: Task;
  onClick: () => void;
  isSelected: boolean;
  setOnOpenTaskDetail: (open: boolean) => void;
}) => {
  const isOverdue =
    new Date(task.deadline) < new Date() && task.status.toLowerCase() !== "completed";

  return (
    <Card
      className={`hover:shadow-md cursor-pointer transition-shadow duration-200 w-full flex flex-col mb-4 mx-2 mt-2 ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex gap-2">
            <CardTitle className="text-lg font-semibold line-clamp-2">{task.name}</CardTitle>
            <Badge className={`${getStatusColor(task.status)} shrink-0`}>{task.status}</Badge>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => {
                    setOnOpenTaskDetail(true);
                  }}
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div
          className={`flex items-center gap-2 text-sm ${isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}
        >
          <Clock className="h-4 w-4" />
          <span>Deadline: {formatDate(task.deadline)}</span>
          {isOverdue && (
            <Badge variant="destructive" className="text-xs ml-auto">
              Overdue
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const TaskList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profileTasksLoading: loading, profileTasks: tasks } = useTask();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [onOpenTaskDetail, setOnOpenTaskDetail] = useState(false);

  const filterIncompleteTasks = (tasks: Task[]) => {
    return tasks.filter(
      (task) =>
        ["todo", "in_progress"].includes(task.status.toLowerCase()) &&
        // Check if child_status === draft || revision then navigate to edit to complete the task
        !["submitted", "actived"].includes(task.child_status?.toLowerCase() || "") &&
        (!task.product_ids?.length || task.product_ids.length === 0),
    );
  };

  useEffect(() => {
    dispatch(getTasksByProfile(undefined));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading tasks...</span>
      </div>
    );
  }

  if (!filterIncompleteTasks(tasks) || filterIncompleteTasks(tasks).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Tag className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No tasks found</h3>
        <p className="text-sm text-muted-foreground">
          There are no tasks assigned to you at the moment.
        </p>
      </div>
    );
  }

  const handleChooseTask = () => {
    if (selectedTask?.status.toLowerCase() === "todo") {
      dispatch(updateTaskStateThunk({ taskId: selectedTask.id, newState: "IN_PROGRESS" }));
    } else if (
      selectedTask?.child_status?.toLowerCase() === "draft" ||
      selectedTask?.child_status?.toLowerCase() === "revision"
    ) {
      navigate(`/manage/sale/product/${selectedTask.product_id}/edit`, {
        state: { formType: "EDIT", productType: "LIMITED", task: selectedTask },
      });
      return;
    }

    navigate("create", {
      state: { formType: "CREATE", productType: "LIMITED", task: selectedTask },
    });
  };

  return (
    <div className="space-y-4">
      <div
        className="h-[70vh] overflow-y-scroll overflow-x-hidden scroll"
        style={{ scrollbarWidth: "thin" }}
      >
        {filterIncompleteTasks(tasks).map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => setSelectedTask(task)}
            isSelected={selectedTask === task}
            setOnOpenTaskDetail={setOnOpenTaskDetail}
          />
        ))}
      </div>
      <div className="flex justify-end">
        <Button variant={"default"} size={"default"} onClick={handleChooseTask}>
          Next
        </Button>
      </div>

      <TaskDetailDisplay
        taskId={selectedTask?.id}
        onOpen={onOpenTaskDetail}
        setOnOpen={setOnOpenTaskDetail}
      />
    </div>
  );
};
