import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppDispatch } from "@/libs/stores";
import { getCampaignById } from "@/libs/stores/campaignManager/thunk";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useCampaign } from "@/libs/hooks/useCampaign";
import { format } from "date-fns";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const campaignTypes = [
  { value: "ADVERTISING", label: "Advertising" },
  { value: "AFFILIATE", label: "Affiliate" },
  { value: "BRAND_AMBASSADOR", label: "Brand Ambassador" },
  { value: "CO_PRODUCING", label: "Co-Producing" },
];

const EditCampaignPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contractInfo, setContractInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { campaignDetail, detailLoading } = useCampaign();

  // Load campaign data
  useEffect(() => {
    if (id) {
      dispatch(getCampaignById(id));
    }
  }, [dispatch, id]);

  // Populate form when campaign data loads
  useEffect(() => {
    if (campaignDetail && !detailLoading) {
      setCampaignName(campaignDetail.name || "");
      setCampaignType(campaignDetail.type || "");
      setDescription(campaignDetail.description || "");
      setStartDate(
        campaignDetail.start_date ? format(new Date(campaignDetail.start_date), "yyyy-MM-dd") : "",
      );
      setEndDate(
        campaignDetail.end_date ? format(new Date(campaignDetail.end_date), "yyyy-MM-dd") : "",
      );

      // Set contract info if available
      if (campaignDetail.contract_id) {
        setContractInfo({
          id: campaignDetail.contract_id,
          title: campaignDetail.contract_title || "N/A",
          type: campaignDetail.type || "",
        });
      }

      setIsLoading(false);
    }
  }, [campaignDetail, detailLoading]);

  const handleSubmit = async () => {
    if (!campaignName || !startDate || !endDate) {
      return;
    }

    // TODO: Implement update campaign API call
    const payload = {
      name: campaignName,
      type: campaignType,
      description: description,
      start_date: startDate ? new Date(startDate).toISOString() : "",
      end_date: endDate ? new Date(endDate).toISOString() : "",
    };

    console.log("Campaign update payload:", payload);

    // Simulate success
    setTimeout(() => {
      navigate(`/manage/marketing/campaigns/${id}`);
    }, 500);
  };

  const handleGoBack = () => {
    navigate(`/manage/marketing/campaigns/${id}`);
  };

  // Animation variants
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

  if (isLoading || detailLoading) {
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
          <p className="text-gray-600 mb-4">The campaign you're trying to edit doesn't exist.</p>
          <Button onClick={() => navigate("/manage/marketing/campaigns")}>Go to Campaigns</Button>
        </div>
      </div>
    );
  }

  const isValid = !!campaignName && !!startDate && !!endDate && !!campaignType;

  return (
    <div className="min-h-fit p-4 sm:p-6 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleGoBack} className="flex items-center">
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Return
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Edit Campaign
              </h1>
              <p className="text-gray-600">Update your campaign details</p>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={!isValid}>
            <FaSave className="mr-2" />
            Save Changes
          </Button>
        </motion.div>

        {/* Contract Information (Read-only) */}
        {contractInfo && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Contract Information</CardTitle>
                <CardDescription>This campaign is linked to a contract (read-only)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Contract Title</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm font-medium">{contractInfo.title}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Contract Type</Label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="capitalize">
                      {contractInfo.type.replace(/_/g, " ").toLowerCase()}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Contract information cannot be changed. Campaign type is
                    automatically set based on the contract.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Campaign Details */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Campaign Details</CardTitle>
              <CardDescription>Update your campaign basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-sm font-medium">Campaign Name *</Label>
                <Input
                  placeholder="e.g. Summer Sale Campaign"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="h-11 mt-1"
                />
              </div>

              {!contractInfo && (
                <div>
                  <Label className="text-sm font-medium">Campaign Type *</Label>
                  <Select value={campaignType} onValueChange={setCampaignType}>
                    <SelectTrigger className="h-11 mt-1">
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {contractInfo && (
                <div>
                  <Label className="text-sm font-medium">Campaign Type</Label>
                  <Input
                    value={
                      campaignTypes.find((t) => t.value === campaignType)?.label || campaignType
                    }
                    readOnly
                    className="h-11 mt-1 bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Type is set by the contract and cannot be changed.
                  </p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <Textarea
                  placeholder="Briefly describe your campaign goal or content..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Campaign Timeline</CardTitle>
              <CardDescription>Set the duration for your campaign</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <DatePicker
                  label="Start Date *"
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Select start date"
                  required
                />
              </div>
              <div className="space-y-2">
                <DatePicker
                  label="End Date *"
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="Select end date"
                  required
                  minDate={startDate}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Milestones Summary (Read-only) */}
        {campaignDetail.milestones && campaignDetail.milestones.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Campaign Milestones</CardTitle>
                <CardDescription>
                  {campaignDetail.milestones.length} milestone(s) defined for this campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaignDetail.milestones.map((milestone: any, index: number) => (
                    <div key={milestone.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">Milestone {index + 1}</Badge>
                            <span className="text-xs text-gray-500">
                              {milestone.due_date
                                ? format(new Date(milestone.due_date), "MMM dd, yyyy")
                                : "No date"}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {milestone.description || "No description"}
                          </p>
                          {milestone.tasks && milestone.tasks.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {milestone.tasks.length} task(s)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Milestones and tasks cannot be edited here. Please manage
                    them in the Campaign Detail page's Schedule tab.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleGoBack}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            <FaSave className="mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EditCampaignPage;
