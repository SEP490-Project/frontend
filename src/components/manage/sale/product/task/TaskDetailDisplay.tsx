import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { manageTask, type SingleTaskResponse } from "@/libs/task";
import { useEffect, useState } from "react";
import { Calendar, FileText, Package, TriangleAlert } from "lucide-react";

export const TaskDetailDisplay = ({
  taskId,
  onOpen,
  setOnOpen,
}: {
  taskId: string | undefined;
  onOpen: boolean;
  setOnOpen: (open: boolean) => void;
}) => {
  const [detailedTask, setDetailedTask] = useState<SingleTaskResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    const fetchTaskDetail = async () => {
      setIsLoading(true);
      try {
        const response = await manageTask.getTaskById(taskId);
        setDetailedTask(response.data);
      } catch (error) {
        console.error("Failed to fetch task details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskDetail();
  }, [taskId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      todo: "bg-gray-100 text-gray-800 border border-gray-200",
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      in_progress: "bg-blue-100 text-blue-800 border border-blue-200",
      completed: "bg-green-100 text-green-800 border border-green-200",
      cancelled: "bg-red-100 text-red-800 border border-red-200",
      overdue: "bg-orange-100 text-orange-800 border border-orange-200",
    };
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const task = detailedTask?.data;

  const isOverdue = task?.deadline
    ? new Date(task.deadline) < new Date() && task?.status?.toLowerCase() !== "completed"
    : false;

  return (
    <Dialog open={onOpen} onOpenChange={setOnOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Task Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading task details...</span>
          </div>
        ) : task ? (
          <div className="space-y-6 py-4">
            {/* Task Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusBadgeClass(task.status)}>
                      {task.status.toUpperCase()}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800 border border-gray-200">
                      {task.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {task.description && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs font-semibold text-gray-700 uppercase mb-2">
                    Description
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {task.description.details}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Task Information Grid */}
            <div>
              {/* Timeline Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </h4>
                <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-gray-600">Deadline:</span>
                    <span
                      className={`text-sm font-semibold ${isOverdue ? "text-red-600" : "text-green-600"}`}
                    >
                      {isOverdue && <TriangleAlert className="inline h-4 w-4 mr-1" />}
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between pt-2 border-t">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm text-gray-900">{formatDate(task.created_at)}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-gray-600">Updated:</span>
                    <span className="text-sm text-gray-900">{formatDate(task.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content & Product IDs */}
            {((task.content_ids && task.content_ids.length > 0) ||
              (task.product_ids && task.product_ids.length > 0)) && (
              <>
                <Separator />
                <Accordion type="single" collapsible className="w-full">
                  {task.content_ids && task.content_ids.length > 0 && (
                    <AccordionItem
                      value="content"
                      className="border border-gray-200 rounded-lg mb-2"
                    >
                      <AccordionTrigger className="px-4 hover:bg-gray-50 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="font-semibold">
                            Content Items ({task.content_ids.length})
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {task.content_ids.map((contentId, index) => (
                            <div
                              key={contentId}
                              className="bg-gray-50 border border-gray-200 rounded px-3 py-2 font-mono text-xs"
                            >
                              <span className="text-gray-600">#{index + 1}:</span>{" "}
                              <span className="text-gray-900">{contentId}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {task.product_ids && task.product_ids.length > 0 && (
                    <AccordionItem value="products" className="border border-gray-200 rounded-lg">
                      <AccordionTrigger className="px-4 hover:bg-gray-50 hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-600" />
                          <span className="font-semibold">
                            Product Items ({task.product_ids.length})
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {task.product_ids.map((productId, index) => (
                            <div
                              key={productId}
                              className="bg-gray-50 border border-gray-200 rounded px-3 py-2 font-mono text-xs"
                            >
                              <span className="text-gray-600">#{index + 1}:</span>{" "}
                              <span className="text-gray-900">{productId}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No task details available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
