import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  FaFileLines,
  FaHashtag,
  FaLocationDot,
  FaUser,
  FaDiagramProject,
  FaCalendarDays,
  FaListCheck,
  FaQuoteLeft,
  FaClock,
} from "react-icons/fa6";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Package,
  Calendar,
  Target,
  FileText,
  ExternalLink,
  Copy,
  RefreshCw,
  X,
} from "lucide-react";
import { formatDate } from "@/libs/helper/helper";
import { useTask } from "@/libs/hooks/useTask";
import { useAppDispatch } from "@/libs/stores";
import { getTaskDetailById } from "@/libs/stores/taskManager/thunk";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";

interface TaskInfoCardProps {
  task?: any | null;
  onChangeTask?: () => void;
  onRemoveTask?: () => void;
}

const copyToClipboard = (text: string, linkName: string) => {
  navigator.clipboard.writeText(text);
  toast.success(linkName ? `${linkName} copied to clipboard` : "Link copied to clipboard", {
    duration: 2000,
  });
};

const getStatusColor = (status?: string): string => {
  switch (status?.toUpperCase()) {
    case "TODO":
    case "TO_DO":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "DONE":
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "CANCELLED":
    case "CANCELED":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getTaskTypeConfig = (
  type?: string,
): { color: string; bgColor: string; icon: React.ReactNode; label: string } => {
  switch (type?.toUpperCase()) {
    case "PRODUCT":
      return {
        color: "#f59e0b",
        bgColor: "bg-amber-50",
        icon: <Package className="h-4 w-4" />,
        label: "Product",
      };
    case "CONTENT":
      return {
        color: "#ec4899",
        bgColor: "bg-pink-50",
        icon: <FileText className="h-4 w-4" />,
        label: "Content",
      };
    case "EVENT":
      return {
        color: "#06b6d4",
        bgColor: "bg-cyan-50",
        icon: <Calendar className="h-4 w-4" />,
        label: "Event",
      };
    case "OTHER":
      return {
        color: "#8b5cf6",
        bgColor: "bg-violet-50",
        icon: <Target className="h-4 w-4" />,
        label: "Other",
      };
    default:
      return {
        color: "#6b7280",
        bgColor: "bg-gray-50",
        icon: <FaListCheck className="h-4 w-4" />,
        label: "Task",
      };
  }
};

const isOverdue = (dateString?: string): boolean => {
  if (!dateString) return false;
  try {
    const deadline = new Date(dateString);
    return deadline < new Date();
  } catch {
    return false;
  }
};

const DetailBlock = ({
  title,
  icon: Icon,
  children,
  contentToCopy,
  bgColor = "bg-gray-50/50",
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  contentToCopy?: string;
  bgColor?: string;
}) => (
  <div
    className={`${bgColor} rounded-xl p-4 border border-gray-100 group relative transition-all hover:border-gray-200`}
  >
    <div className="flex items-center justify-between mb-2.5">
      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-gray-400" /> {title}
      </h4>
      {contentToCopy && (
        <button
          onClick={() => copyToClipboard(contentToCopy, title)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-all"
          title={`Copy ${title}`}
        >
          <Copy className="h-3 w-3" />
        </button>
      )}
    </div>
    <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
  </div>
);

const renderTaskDetails = (description: any) => {
  if (!description || typeof description !== "object") return null;

  // 1. Advertising / Affiliate Content Task
  if (description.advertised_item_id || (description.name && description.tracking_link)) {
    return (
      <div className="space-y-4">
        {/* Top Feature: Product & Link */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-100 text-[10px]"
              >
                PLATFORM
              </Badge>
              {description.platform && (
                <span className="text-xs font-semibold text-gray-400">{description.platform}</span>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{description.product_name}</h3>
          </div>
          {description.tracking_link && (
            <div className="flex items-center gap-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-blue-400 uppercase ml-1">
                  Tracking Link
                </span>
                <a
                  href={description.tracking_link}
                  target="_blank"
                  className="text-[11px] text-blue-600 font-medium px-1 truncate max-w-[200px] hover:underline"
                >
                  {description.tracking_link}
                </a>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-blue-600 hover:bg-blue-100"
                onClick={() => copyToClipboard(description.tracking_link, "Link")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {description.tagline && (
              <DetailBlock
                title="Hook / Tagline"
                icon={FaQuoteLeft}
                contentToCopy={description.tagline}
                bgColor="bg-amber-50/30"
              >
                <p className="text-base italic font-medium text-gray-800">
                  "{description.tagline}"
                </p>
              </DetailBlock>
            )}
            {description.creative_notes && (
              <DetailBlock
                title="Creative Notes"
                icon={FileText}
                contentToCopy={description.creative_notes}
              >
                <p className="whitespace-pre-wrap">{description.creative_notes}</p>
              </DetailBlock>
            )}
          </div>
          <div className="space-y-4">
            {description.hashtags && description.hashtags.length > 0 && (
              <DetailBlock
                title="Hashtags"
                icon={FaHashtag}
                contentToCopy={description.hashtags.map((t: string) => `#${t}`).join(" ")}
              >
                <div className="flex flex-wrap gap-1.5">
                  {description.hashtags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-white border border-gray-100 px-2 py-0.5 rounded text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </DetailBlock>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Brand Ambassador Event Task
  if (description.event_id || description.event_name) {
    return (
      <div className="space-y-4">
        <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100">
          <Badge className="bg-emerald-500 hover:bg-emerald-600 mb-2">EVENT BRIEF</Badge>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{description.event_name}</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { icon: Calendar, text: description.event_date },
              { icon: FaClock, text: description.event_duration },
              { icon: FaLocationDot, text: description.location },
            ].map(
              (item, i) =>
                item.text && (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white/80 px-3 py-1.5 rounded-lg border border-emerald-100"
                  >
                    <item.icon className="h-3.5 w-3.5 text-emerald-500" />
                    {item.text}
                  </div>
                ),
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {description.activities && (
            <DetailBlock title="Planned Activities" icon={FaListCheck}>
              <ul className="space-y-2">
                {description.activities.map((item: string, i: number) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </DetailBlock>
          )}
          {description.representation_rules && (
            <DetailBlock title="Compliance Rules" icon={FaCheckCircle} bgColor="bg-red-50/30">
              <ul className="space-y-2">
                {description.representation_rules.map((rule: string, i: number) => (
                  <li key={i} className="flex gap-2 items-start text-xs font-medium">
                    <div className="w-4 h-4 rounded border border-red-200 flex-shrink-0 mt-0.5 bg-white" />
                    {rule}
                  </li>
                ))}
              </ul>
            </DetailBlock>
          )}
        </div>
      </div>
    );
  }

  // 3. Co-Producing Product Task
  if (
    description.is_product_creation_task === true ||
    description.product_id ||
    description.product_name
  ) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <DetailBlock title="Product Creation" icon={Package} bgColor="bg-violet-50/30">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{description.product_name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description.product_description}
            </p>
          </DetailBlock>
        </div>
        {description.subtasks && (
          <DetailBlock title="Milestones / Subtasks" icon={FaListCheck}>
            <div className="grid gap-2">
              {description.subtasks.map((task: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 bg-white border border-gray-100 rounded-lg shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-violet-200 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-700">{task}</span>
                </div>
              ))}
            </div>
          </DetailBlock>
        )}
      </div>
    );
  }

  // 4. Co-Producing Concept Task
  if (
    description.is_product_creation_task === false ||
    description.concept_id ||
    description.concept_name
  ) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <DetailBlock title="Concept Strategy" icon={Target} bgColor="bg-indigo-50/30">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900">{description.concept_name}</h3>
              {description.platform && <Badge variant="secondary">{description.platform}</Badge>}
            </div>
            <p className="text-sm text-gray-600">{description.concept_description}</p>
          </DetailBlock>
        </div>
        <div className="space-y-4">
          {description.related_product_name && (
            <DetailBlock title="Related Product" icon={Package}>
              <span className="font-bold text-gray-900">{description.related_product_name}</span>
            </DetailBlock>
          )}
          {description.hashtags && (
            <DetailBlock
              title="Campaign Hashtags"
              icon={FaHashtag}
              contentToCopy={description.hashtags.map((t: string) => `#${t}`).join(" ")}
            >
              <div className="flex flex-wrap gap-1">
                {description.hashtags.map((tag: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-[10px] font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            </DetailBlock>
          )}
        </div>
      </div>
    );
  }

  // 5. KPI Goals
  if (description.kpi_goals && description.kpi_goals.length > 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {description.kpi_goals.map((kpi: any, idx: number) => (
          <div
            key={idx}
            className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:border-blue-200 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500">
                <Target className="h-3.5 w-3.5" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase truncate">
                {kpi.metric?.replace(/_/g, " ")}
              </span>
            </div>
            <div className="text-xl font-black text-gray-900">{kpi.target}</div>
            {kpi.description && (
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">{kpi.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

// Render materials
const renderMaterials = (description: any) => {
  const materials: string[] = [];

  if (description?.material_url && Array.isArray(description.material_url)) {
    materials.push(...description.material_url);
  }
  if (description?.materials && Array.isArray(description.materials)) {
    materials.push(...description.materials);
  }
  if (description?.material_urls && Array.isArray(description.material_urls)) {
    materials.push(...description.material_urls);
  }

  if (materials.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {materials.map((material, index) => (
        <div
          key={index}
          className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium hover:border-blue-300 transition-all duration-200 shadow-sm overflow-hidden"
        >
          {/* Main Link Part */}
          <a
            href={material}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 hover:from-blue-100 hover:to-indigo-100 transition-colors border-r border-blue-100"
          >
            <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center flex-shrink-0">
              <FaFileLines className="h-3 w-3 text-white" />
            </div>
            <span>Material {index + 1}</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>

          {/* Copy Button Part */}
          <button
            onClick={(e) => {
              e.preventDefault();
              copyToClipboard(material, `Material ${index + 1} link`);
            }}
            className="px-2.5 py-2 hover:bg-blue-100 transition-colors flex items-center justify-center text-blue-500 hover:text-blue-700 group/copy"
            title="Copy to clipboard"
          >
            <Copy className="h-3.5 w-3.5 group-active/copy:scale-90 transition-transform" />
          </button>
        </div>
      ))}
    </div>
  );
};

const TaskInfoCard: React.FC<TaskInfoCardProps> = ({ task, onChangeTask, onRemoveTask }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  // Get Task details from task prop
  const { taskDetailById, detailLoading: taskDetailLoading } = useTask();
  const dispatch = useAppDispatch();
  const taskDetail = taskDetailById?.data || null;

  useEffect(() => {
    const taskId = task?.id;
    if (!taskId) return;
    const currentDataId = taskDetailById?.data?.id;

    if (currentDataId !== taskId && !taskDetailLoading) {
      dispatch(getTaskDetailById(taskId));
    }
  }, [task?.id, dispatch, taskDetailById?.data?.id, taskDetailLoading]);

  if (!taskDetail) return null;

  if (taskDetailLoading) {
    return (
      <Card className="w-full overflow-hidden animate-pulse bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const taskTitle = taskDetail.name;
  const taskDeadline = taskDetail.deadline;
  const campaignName = taskDetail.campaign_name || taskDetail.campaign_details?.name;
  const hasDetails = taskDetail.description && typeof taskDetail.description === "object";
  const hasMaterials =
    taskDetail.description &&
    ((Array.isArray(taskDetail.description.material_url) &&
      taskDetail.description.material_url?.length > 0) ||
      (Array.isArray(taskDetail.description.materials) &&
        taskDetail.description.materials?.length > 0) ||
      (Array.isArray(taskDetail.description.material_urls) &&
        taskDetail.description.material_urls?.length > 0));

  const typeConfig = getTaskTypeConfig(taskDetail.type);
  const overdueStatus = isOverdue(taskDeadline);

  return (
    <Card
      className="w-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${typeConfig.bgColor} 0%, white 100%)`,
      }}
    >
      {/* Colored Top Border */}
      <div
        className="h-1 w-full transition-all duration-300"
        style={{ background: `linear-gradient(90deg, ${typeConfig.color}, ${typeConfig.color}88)` }}
      />

      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          {/* Left: Task Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Task Type Icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 text-white transition-transform duration-200 hover:scale-105"
              style={{ backgroundColor: typeConfig.color }}
            >
              {typeConfig.icon}
            </div>

            {/* Task Title & Campaign */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-base font-semibold text-gray-900 truncate max-w-[300px]">
                  {taskTitle || "Untitled Task"}
                </h3>
                {taskDetail.status && (
                  <Badge
                    className={`${getStatusColor(taskDetail.status)} border text-xs font-medium px-2 py-0.5`}
                  >
                    {taskDetail.status.replace(/_/g, " ")}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-500">
                {campaignName && (
                  <span className="flex items-center gap-1.5 bg-white/60 px-2 py-0.5 rounded-full">
                    <FaDiagramProject className="h-3 w-3 text-gray-400" />
                    <span className="truncate max-w-[200px]">{campaignName}</span>
                  </span>
                )}
                {taskDetail.type && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${typeConfig.color}20`, color: typeConfig.color }}
                  >
                    {typeConfig.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Meta Info */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Assignee */}
            {taskDetail.assigned_to_name && (
              <div className="flex items-center gap-1.5 bg-white/80 border border-gray-100 px-2.5 py-1.5 rounded-lg text-sm">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <FaUser className="h-3 w-3 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{taskDetail.assigned_to_name}</span>
              </div>
            )}

            {/* Deadline */}
            {taskDeadline && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium ${
                  overdueStatus
                    ? "bg-red-50 border border-red-200 text-red-600"
                    : "bg-white/80 border border-gray-100 text-gray-600"
                }`}
              >
                {overdueStatus ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <FaCalendarDays className="h-3.5 w-3.5" />
                )}
                <span>{formatDate(taskDeadline)}</span>
                {overdueStatus && (
                  <Badge
                    variant="destructive"
                    className="text-[10px] text-white px-1.5 py-0 h-4 ml-1"
                  >
                    OVERDUE
                  </Badge>
                )}
              </div>
            )}

            {/* Expand/Collapse Button */}
            {(hasDetails || hasMaterials) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`h-9 px-3 gap-1.5 rounded-lg transition-colors ${
                  isExpanded ? "bg-gray-100 text-gray-700" : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <span className="text-xs font-medium">{isExpanded ? "Less" : "Details"}</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Action Buttons - Change/Remove Task */}
            {(onChangeTask || onRemoveTask) && (
              <div className="flex items-center gap-1 ml-2 border-l border-gray-200 pl-3">
                {onChangeTask && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onChangeTask}
                        className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Change task</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {onRemoveTask && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRemoveTask}
                        className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove task</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expandable Details */}
        {(hasDetails || hasMaterials) && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleContent className="mt-4">
              <Separator className="mb-4" />
              <div className="space-y-4">
                {hasDetails && renderTaskDetails(taskDetail.description)}
                {hasMaterials && (
                  <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaFileLines className="h-3.5 w-3.5 text-blue-500" />
                      Reference Materials
                    </h4>
                    {renderMaterials(taskDetail.description)}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskInfoCard;
