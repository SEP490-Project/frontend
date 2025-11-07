import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { DataSelector } from "@/components/global";
import { useAppDispatch } from "@/libs/stores";
import { useContract } from "@/libs/hooks/useContract";
import { contract } from "@/libs/stores/contractManager/thunk";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { format, parseISO } from "date-fns";
import type { ContractBase } from "@/libs/types/contract";

interface CampaignData {
  name: string;
  type: string;
  description: string;
  start_date: string;
  end_date: string;
  contract_id: string;
}

interface CreateCampaignProps {
  campaignData: CampaignData;
  setCampaignData: React.Dispatch<React.SetStateAction<CampaignData>>;
  campaignTypes: { value: string; label: string }[];
  campaignMode: "contract" | "internal";
  setCampaignMode: React.Dispatch<React.SetStateAction<"contract" | "internal">>;
  isCampaignValid: boolean;
  onNext: () => void;
  onReset: () => void;
  onContractSelect: (contract: ContractBase | null) => void;
}

const ContractItem = ({ contract }: { contract: any }) => (
  <div className="flex items-center justify-between w-full p-2">
    <div>
      <span className="font-medium">{contract.title}</span>
    </div>
    <Badge variant="secondary" className="capitalize">
      {contract.type.toLowerCase().replace("_", " ")}
    </Badge>
  </div>
);

const CreateCampaign: React.FC<CreateCampaignProps> = ({
  campaignData,
  setCampaignData,
  campaignTypes,
  campaignMode,
  setCampaignMode,
  isCampaignValid,
  onNext,
  onReset,
  onContractSelect,
}) => {
  const dispatch = useAppDispatch();
  const { contracts, loading, pagination } = useContract();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [allContracts, setAllContracts] = useState<ContractBase[]>([]);

  useEffect(() => {
    setAllContracts([]);
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(
      contract({
        page,
        limit: 10,
        sort_by: "created_at",
        // status: "ACTIVE",
        sort_order: "desc",
        ...(debouncedSearch ? { keyword: debouncedSearch } : {}),
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  useEffect(() => {
    if (page === 1) setAllContracts(contracts);
    else setAllContracts((prev) => [...prev, ...contracts]);
  }, [contracts, page]);

  const loadMore = useCallback(() => {
    if (pagination?.has_next && !loading) setPage((p) => p + 1);
  }, [pagination, loading]);

  const formatDateForInput = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  const handleContractSelect = (contractId: string | null) => {
    const selectedContract = allContracts.find((c) => c.id === contractId);
    setCampaignData((s) => ({
      ...s,
      contract_id: contractId || "",
      type: selectedContract?.type || s.type,
      start_date: selectedContract ? formatDateForInput(selectedContract.start_date) : s.start_date,
      end_date: selectedContract ? formatDateForInput(selectedContract.end_date) : s.end_date,
    }));
    onContractSelect(selectedContract || null);
  };

  const handleStartDateChange = (date: string) => {
    setCampaignData((s) => ({ ...s, start_date: date }));
  };

  const handleEndDateChange = (date: string) => {
    setCampaignData((s) => ({ ...s, end_date: date }));
  };

  const selectedContract = allContracts.find((c) => c.id === campaignData.contract_id);

  const minDate = selectedContract ? formatDateForInput(selectedContract.start_date) : undefined;
  const maxDate = selectedContract ? formatDateForInput(selectedContract.end_date) : undefined;

  return (
    <div className="pt-8 space-y-8">
      {/* STEP 0: CAMPAIGN MODE */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
        <CardHeader>
          <div>
            <CardTitle className="text-lg font-semibold text-blue-900">Campaign Type</CardTitle>
            <CardDescription>Choose how you want to create your campaign.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={campaignMode}
            onValueChange={(value) => {
              const newMode = value as "contract" | "internal";
              setCampaignMode(newMode);

              // Reset relevant fields when switching modes
              setCampaignData((prev) => ({
                name: prev.name,
                description: prev.description,
                // Reset type and contract fields based on mode
                type: newMode === "internal" ? prev.type : "",
                contract_id: newMode === "contract" ? "" : "",
                // Keep dates but allow them to be overridden
                start_date: prev.start_date,
                end_date: prev.end_date,
              }));

              // Clear selected contract
              onContractSelect(null);
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50 transition-colors">
              <RadioGroupItem value="contract" id="contract" />
              <div className="flex-1">
                <Label htmlFor="contract" className="text-sm font-medium cursor-pointer">
                  Contract-based Campaign
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Create a campaign based on an existing contract with predefined terms and
                  milestones.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50 transition-colors">
              <RadioGroupItem value="internal" id="internal" />
              <div className="flex-1">
                <Label htmlFor="internal" className="text-sm font-medium cursor-pointer">
                  Internal Campaign
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Create a custom campaign with flexible settings and manually defined milestones.
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* STEP 1: CONTRACT OR CAMPAIGN TYPE */}
      {campaignMode === "contract" ? (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div>
              <CardTitle className="text-lg font-semibold">1. Select Contract</CardTitle>
              <CardDescription>Choose an active contract to base your campaign on.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Contract *</Label>
              <DataSelector
                data={allContracts}
                selectedId={campaignData.contract_id}
                onSelect={handleContractSelect}
                renderItem={(contract) => <ContractItem contract={contract} />}
                getLabel={(contract) => contract.title}
                title="Contracts"
                placeholder="Select an active contract"
                onSearch={setSearch}
                searchValue={search}
                onScrollEnd={pagination?.has_next ? loadMore : undefined}
                loading={loading}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Campaign Type</Label>
              <Input
                value={
                  selectedContract
                    ? selectedContract.type
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    : "Select a contract first"
                }
                readOnly
                className="h-11 bg-gray-50 text-gray-500"
              />
              {selectedContract && (
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically set based on the selected contract.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div>
              <CardTitle className="text-lg font-semibold">1. Campaign Type</CardTitle>
              <CardDescription>
                Select the type of internal campaign you want to create.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Campaign Type *</Label>
              <Select
                value={campaignData.type || undefined}
                onValueChange={(value) => setCampaignData((s) => ({ ...s, type: value }))}
              >
                <SelectTrigger className="h-11">
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
          </CardContent>
        </Card>
      )}

      {/* STEP 2: INFO */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div>
            <CardTitle className="text-lg font-semibold">2. Campaign Information</CardTitle>
            <CardDescription>Provide basic details about your campaign.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-sm font-medium">Campaign Name *</Label>
            <Input
              placeholder="e.g. Summer Sale Campaign"
              value={campaignData.name}
              onChange={(e) => setCampaignData((s) => ({ ...s, name: e.target.value }))}
              className="h-11"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Description</Label>
            <Textarea
              placeholder="Briefly describe your campaign goal or content..."
              value={campaignData.description}
              onChange={(e) => setCampaignData((s) => ({ ...s, description: e.target.value }))}
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* STEP 3: TIMELINE */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div>
            <CardTitle className="text-lg font-semibold">3. Timeline</CardTitle>
            <CardDescription>
              Select start and end dates (must be within the contract period).
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <DatePicker
              label="Start Date"
              value={campaignData.start_date}
              onChange={handleStartDateChange}
              placeholder="Select start date"
              required
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
          <div className="space-y-2">
            <DatePicker
              label="End Date"
              value={campaignData.end_date}
              onChange={handleEndDateChange}
              placeholder="Select end date"
              required
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        </CardContent>
      </Card>

      {/* ACTIONS */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
        <Button onClick={onNext} disabled={!isCampaignValid}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default CreateCampaign;
