import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch } from "@/libs/stores";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCampaignById,
  approveCampaign,
  rejectCampaign,
} from "@/libs/stores/campaignManager/thunk";
import { Schedule } from "./component/detail";
import { useCampaign } from "@/libs/hooks/useCampaign";
import type { MetricsItem } from "@/libs/types/campaign";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import {
  FaCalendarDays,
  FaFileContract,
  FaBuilding,
  FaChartLine,
  FaArrowLeft,
  FaClock,
  FaCircleCheck,
  FaCircleXmark,
  FaListCheck,
  FaFlag,
  FaClipboardCheck,
  FaArrowRight,
  FaPencil,
  FaBullseye,
  FaEye,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaArrowPointer,
  FaCartShopping,
  FaUsers,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import { formatDate } from "@/libs/helper/helper";

import RejectCampaignModal from "@/components/modal/RejectCampaignModal";

// Status and type mappings
const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  RUNNING: "Running",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
  DRAFT: "Draft",
  PAUSED: "Paused",
};

const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  ADVERTISING: "Advertising",
  AFFILIATE: "Affiliate",
  BRAND_AMBASSADOR: "Brand Ambassador",
  CO_PRODUCING: "Co-Producing",
};

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  CANCELED: "bg-red-100 text-red-800 border-red-200",
  RUNNING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
  PAUSED: "bg-orange-100 text-orange-800 border-orange-200",
};

const CAMPAIGN_TYPE_COLORS: Record<string, string> = {
  ADVERTISING: "bg-orange-100 text-orange-800 border-orange-200",
  AFFILIATE: "bg-blue-100 text-blue-800 border-blue-200",
  BRAND_AMBASSADOR: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CO_PRODUCING: "bg-violet-100 text-violet-800 border-violet-200",
};

const MILESTONE_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  ON_GOING: "On Going",
  NOT_STARTED: "Not Started",
  COMPLETED: "Completed",
  OVERDUE: "Overdue",
};

const MILESTONE_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-800 border-gray-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  ON_GOING: "bg-blue-100 text-blue-800 border-blue-200",
  NOT_STARTED: "bg-gray-100 text-gray-800 border-gray-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  OVERDUE: "bg-red-100 text-red-800 border-red-200",
};

const METRICS_CONFIG: Record<string, { label: string; icon: React.ComponentType<any> }> = {
  reach: { label: "Reach", icon: FaEye },
  likes: { label: "Likes", icon: FaThumbsUp },
  comments: { label: "Comments", icon: FaComment },
  shares: { label: "Shares", icon: FaShare },
  click_through: { label: "Click Through", icon: FaArrowPointer },
  units_sold: { label: "Units Sold", icon: FaCartShopping },
  event_participation: { label: "Event Participation", icon: FaUsers },
};

interface CampaignDetailPageProps {
  userRole?: "marketing" | "brand";
}

const CampaignDetailPage: React.FC<CampaignDetailPageProps> = ({ userRole = "marketing" }) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { campaignDetail, detailLoading } = useCampaign();
  console.log("Campaign Detail:", campaignDetail);

  // Campaign action states
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch campaign details
  useEffect(() => {
    if (id) {
      dispatch(getCampaignById(id));
    }
  }, [dispatch, id]);

  const handleGoBack = () => {
    const basePath = userRole === "brand" ? "/manage/brand" : "/manage/marketing";
    navigate(`${basePath}/campaigns`);
  };

  // Campaign action handlers
  const handleApproveCampaign = async () => {
    setIsSubmitting(true);
    try {
      if (!id) {
        console.error("No campaign ID available to approve.");
        setShowApproveDialog(false);
        return;
      }

      await dispatch(approveCampaign(id));
      setShowApproveDialog(false);
      if (id) {
        dispatch(getCampaignById(id));
      }
    } catch (error) {
      console.error("Failed to approve campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectCampaign = async (reason: string) => {
    setIsSubmitting(true);
    try {
      if (!id) {
        console.error("No campaign ID available to reject.");
        setShowRejectModal(false);
        return;
      }

      await dispatch(rejectCampaign({ id, reason }));
      setShowRejectModal(false);
      if (id) {
        dispatch(getCampaignById(id));
      }
    } catch (error) {
      console.error("Failed to reject campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const sortedMilestones = useMemo(() => {
    const ms = campaignDetail?.milestones ?? [];

    return [...ms].sort((a, b) => {
      const ta = a.due_date ? Date.parse(a.due_date) : Infinity;
      const tb = b.due_date ? Date.parse(b.due_date) : Infinity;

      return ta - tb;
    });
  }, [campaignDetail?.milestones]);

  if (detailLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (!campaignDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign not found</h2>
          <p className="text-gray-600 mb-4">The campaign you're looking for doesn't exist.</p>
          <Button onClick={handleGoBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-fit p-4 sm:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleGoBack} className="flex items-center">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Return
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Campaign Details
              </h1>
              <p className="text-gray-600">Campaign name: {campaignDetail?.name || "—"}</p>
            </div>
          </div>

          {/* Brand Action Buttons */}
          {userRole === "brand" && campaignDetail?.status === "DRAFT" && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50 flex items-center gap-2"
                onClick={() => setShowRejectModal(true)}
                disabled={isSubmitting}
              >
                <FaCircleXmark className="w-4 h-4" />
                Reject Campaign
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                onClick={() => setShowApproveDialog(true)}
                disabled={isSubmitting}
              >
                <FaCircleCheck className="w-4 h-4" />
                Approve Campaign
              </Button>
            </div>
          )}

          {/* Edit Button */}
          {userRole !== "brand" && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate(`/manage/marketing/campaigns/edit/${id}`)}
            >
              <FaPencil className="w-4 h-4" />
              Edit Campaign
            </Button>
          )}
        </motion.div>

        {/* Campaign Overview Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaChartLine className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge
                    className={`border ${STATUS_COLORS[campaignDetail.status] || ""} text-xs font-medium px-2 py-1`}
                  >
                    {CAMPAIGN_STATUS_LABELS[campaignDetail.status] || campaignDetail.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaListCheck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Type</p>
                  <Badge
                    className={`border ${CAMPAIGN_TYPE_COLORS[campaignDetail.type] || ""} text-xs font-medium px-2 py-1`}
                  >
                    {CAMPAIGN_TYPE_LABELS[campaignDetail.type] || campaignDetail.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaCalendarDays className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Duration</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {Math.ceil(
                      (new Date(campaignDetail.end_date).getTime() -
                        new Date(campaignDetail.start_date).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FaClock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Created</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(campaignDetail.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Campaign Details */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCalendarDays className="h-5 w-5 text-blue-600" />
                Campaign Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaignDetail.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-900 mt-1">{campaignDetail.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Date</label>
                  <p className="text-gray-900 mt-1">{formatDate(campaignDetail.start_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">End Date</label>
                  <p className="text-gray-900 mt-1">{formatDate(campaignDetail.end_date)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Campaign ID</label>
                <p className="text-gray-900 mt-1 font-mono">{campaignDetail.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contract Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FaFileContract className="h-5 w-5 text-green-600" />
                Contract Information
              </CardTitle>

              {/* Nút nằm chung dòng với tiêu đề */}
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() =>
                  navigate(`/manage/marketing/contracts/${campaignDetail.contract_id}`)
                }
              >
                View Detail
                <FaArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Contract Number</label>
                <p className="text-gray-900 mt-1 font-mono">{campaignDetail.contract_number}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Contract Title</label>
                <p className="text-gray-900 mt-1">{campaignDetail.contract_title}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Campaign Type</label>
                <div className="flex items-center gap-2 mt-1">
                  <FaBuilding className="h-4 w-4 text-gray-500" />
                  <Badge
                    className={`border ${
                      CAMPAIGN_TYPE_COLORS[campaignDetail.type] || ""
                    } text-xs font-medium px-2 py-1`}
                  >
                    {CAMPAIGN_TYPE_LABELS[campaignDetail.type] || campaignDetail.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Milestones Section */}
        {sortedMilestones && sortedMilestones.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaFlag className="h-5 w-5 text-purple-600" />
                  Campaign Milestones
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {sortedMilestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">Milestone {index + 1}</h4>

                          <Badge
                            className={`border text-xs font-medium px-2 py-1 ${
                              MILESTONE_STATUS_COLORS[milestone.status] ||
                              "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            {MILESTONE_STATUS_LABELS[milestone.status] || milestone.status}
                          </Badge>

                          {milestone.behind_schedule && (
                            <Badge className="bg-red-100 text-red-800 border-red-200 text-xs font-medium px-2 py-1">
                              Behind Schedule
                            </Badge>
                          )}
                        </div>

                        <p className="text-gray-700 mb-2">{milestone.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Due Date:</span>
                            <p className="font-medium">{formatDate(milestone.due_date)}</p>
                          </div>

                          {milestone.completed_at && (
                            <div>
                              <span className="text-gray-600">Completed:</span>
                              <p className="font-medium text-green-600">
                                {formatDate(milestone.completed_at)}
                              </p>
                            </div>
                          )}

                          <div>
                            <span className="text-gray-600">Tasks:</span>
                            <p className="font-medium">{milestone.number_of_tasks}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Progress: {milestone.percentage_completed}%
                        </span>
                        <FaClipboardCheck className="h-4 w-4 text-gray-400" />
                      </div>

                      <Progress value={milestone.percentage_completed} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Campaign Overview Stats */}
        {(campaignDetail?.number_of_tasks ||
          campaignDetail?.percentage_completed !== undefined) && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaChartLine className="h-5 w-5 text-indigo-600" />
                  Campaign Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {campaignDetail.number_of_tasks && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FaClipboardCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                        <p className="text-xl font-bold text-gray-900">
                          {campaignDetail.number_of_tasks}
                        </p>
                      </div>
                    </div>
                  )}

                  {campaignDetail.percentage_completed !== undefined && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FaChartLine className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">Overall Completion</p>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={campaignDetail.percentage_completed}
                            className="flex-1 h-2"
                          />
                          <span className="text-sm font-bold text-gray-900">
                            {campaignDetail.percentage_completed}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Metrics Comparison */}
        {campaignDetail?.metrics_comparison && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaBullseye className="h-5 w-5 text-purple-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Metrics Summary */}
                {campaignDetail.metrics_comparison?.expected_metrics &&
                  Object.keys(campaignDetail.metrics_comparison.expected_metrics).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Overall Campaign Metrics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(campaignDetail.metrics_comparison.expected_metrics).map(
                          ([metric, expectedValue]) => {
                            const realisticValue =
                              campaignDetail.metrics_comparison?.realistic_metrics?.[metric] ?? 0;
                            const config = METRICS_CONFIG[metric];
                            const IconComponent = config?.icon || FaBullseye;

                            return (
                              <div
                                key={metric}
                                className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <IconComponent className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {config?.label || metric}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Target:</span>
                                    <span className="font-semibold text-gray-900">
                                      {typeof expectedValue === "number"
                                        ? expectedValue.toLocaleString()
                                        : expectedValue}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Current:</span>
                                    <span className="font-semibold text-blue-600">
                                      {typeof realisticValue === "number"
                                        ? realisticValue.toLocaleString()
                                        : realisticValue}
                                    </span>
                                  </div>
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                      <span>Progress</span>
                                      <span>
                                        {expectedValue > 0
                                          ? Math.round(
                                              (Number(realisticValue) / Number(expectedValue)) *
                                                100,
                                            )
                                          : 0}
                                        %
                                      </span>
                                    </div>
                                    <Progress
                                      value={
                                        expectedValue > 0
                                          ? Math.min(
                                              (Number(realisticValue) / Number(expectedValue)) *
                                                100,
                                              100,
                                            )
                                          : 0
                                      }
                                      className="h-1.5"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}

                {/* Individual Items Metrics */}
                {campaignDetail.metrics_comparison?.items &&
                  campaignDetail.metrics_comparison.items.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Item-specific Metrics</h4>
                      <div className="space-y-4">
                        {(campaignDetail.metrics_comparison.items as MetricsItem[]).map((item) => (
                          <div key={item.item_id} className="border rounded-lg p-4 bg-gray-50">
                            <h5 className="font-medium text-gray-800 mb-3">{item.item_name}</h5>

                            {item.expected_metrics && item.expected_metrics.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {item.expected_metrics.map((metricData, index) => {
                                  const config = METRICS_CONFIG[metricData.metric];
                                  const IconComponent = config?.icon || FaBullseye;
                                  const realisticValue =
                                    item.realistic_metrics?.[metricData.metric] || 0;

                                  return (
                                    <div key={index} className="p-3 bg-white rounded border">
                                      <div className="flex items-center gap-2 mb-2">
                                        <IconComponent className="h-3 w-3 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-600">
                                          {config?.label || metricData.metric}
                                        </span>
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                          <span className="text-gray-500">Target:</span>
                                          <span className="font-medium text-gray-800">
                                            {typeof metricData.target === "string"
                                              ? Number(metricData.target).toLocaleString()
                                              : metricData.target}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                          <span className="text-gray-500">Current:</span>
                                          <span className="font-medium text-blue-600">
                                            {typeof realisticValue === "number"
                                              ? realisticValue.toLocaleString()
                                              : realisticValue}
                                          </span>
                                        </div>
                                        <Progress
                                          value={
                                            Number(metricData.target) > 0
                                              ? Math.min(
                                                  (Number(realisticValue) /
                                                    Number(metricData.target)) *
                                                    100,
                                                  100,
                                                )
                                              : 0
                                          }
                                          className="h-1 mt-2"
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Schedule Component */}
        <motion.div variants={itemVariants}>
          <Schedule campaignId={id} />
        </motion.div>
      </motion.div>

      {/* Approve Campaign Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <FaCircleCheck className="h-5 w-5 text-green-600" />
              </div>
              Approve Campaign
            </DialogTitle>
            <DialogDescription className="text-left">
              Are you sure you want to approve the campaign{" "}
              <strong>"{campaignDetail?.name}"</strong>?
              <br />
              <br />
              This action will allow the marketing team to proceed with the campaign execution.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApproveCampaign}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (
                <FaCircleCheck className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? "Approving..." : "Approve Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Campaign Modal */}
      <RejectCampaignModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectCampaign}
        campaignName={campaignDetail?.name || ""}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default CampaignDetailPage;
