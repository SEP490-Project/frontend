import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/date-picker";
import { NumberInput } from "@/components/number-input";
import { DataSelector } from "@/components/global";
import { useAppDispatch } from "@/libs/stores";
import { useContract } from "@/libs/hooks/useContract";
import { contract } from "@/libs/stores/contractManager/thunk";
import { useDebounce } from "@/libs/hooks/useDebounce";
import type { ContractBase } from "@/libs/types/contract";

interface CampaignData {
  name: string;
  type: string;
  description: string;
  start_date: string;
  end_date: string;
  contract_id: string;
  budget_projected: string | number;
}

interface CreateCampaignProps {
  campaignData: CampaignData;
  setCampaignData: React.Dispatch<React.SetStateAction<CampaignData>>;
  campaignTypes: { value: string; label: string }[];
  isCampaignValid: boolean;
  onNext: () => void;
  onReset: () => void;
  onContractSelect: (contract: ContractBase | null) => void;
}

// Helper component for contract item display
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
  isCampaignValid,
  onNext,
  onReset,
  onContractSelect,
}) => {
  // Contract selection state & hooks
  const dispatch = useAppDispatch();
  const { contracts, loading, pagination } = useContract();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [allContracts, setAllContracts] = useState<ContractBase[]>([]);

  // Reset contracts when search changes
  useEffect(() => {
    setAllContracts([]);
    setPage(1);
  }, [debouncedSearch]);

  // Fetch contracts
  useEffect(() => {
    dispatch(
      contract({
        page,
        limit: 10,
        sort_by: "created_at",
        order: "desc",
        ...(debouncedSearch ? { keyword: debouncedSearch } : {}),
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  // Update allContracts when contracts change
  useEffect(() => {
    if (page === 1) setAllContracts(contracts);
    else setAllContracts((prev) => [...prev, ...contracts]);
  }, [contracts, page]);

  // Load more contracts
  const loadMore = useCallback(() => {
    if (pagination?.has_next && !loading) setPage((p) => p + 1);
  }, [pagination, loading]);

  // Helper function to format date from ISO to YYYY-MM-DD
  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // Get YYYY-MM-DD format
    } catch {
      return "";
    }
  };

  // Handle contract selection and auto-populate type and dates
  const handleContractSelect = (contractId: string | null) => {
    const selectedContract = allContracts.find((c) => c.id === contractId);
    setCampaignData((s) => ({
      ...s,
      contract_id: contractId || "",
      type: selectedContract?.type || "",
      // Auto-populate start and end dates from contract
      start_date: selectedContract ? formatDateForInput(selectedContract.start_date) : s.start_date,
      end_date: selectedContract ? formatDateForInput(selectedContract.end_date) : s.end_date,
    }));

    // Pass selected contract to parent
    onContractSelect(selectedContract || null);
  };

  // Handle budget change using the same format as FinancialTerms
  const handleBudgetChange = (value: number) => {
    setCampaignData((s) => ({ ...s, budget_projected: value }));
  };

  // Handle date changes
  const handleStartDateChange = (date: string) => {
    setCampaignData((s) => ({ ...s, start_date: date }));
  };

  const handleEndDateChange = (date: string) => {
    setCampaignData((s) => ({ ...s, end_date: date }));
  };

  // Get selected contract for displaying type
  const selectedContract = allContracts.find((c) => c.id === campaignData.contract_id);

  return (
    <div className="pt-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Contract & Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                Select Contract *
              </Label>
              <DataSelector
                data={allContracts}
                selectedId={campaignData.contract_id}
                onSelect={handleContractSelect}
                renderItem={(contract) => <ContractItem contract={contract} />}
                getLabel={(contract) => contract.title}
                title="Contracts"
                placeholder="Choose a contract to set up workflow"
                onSearch={setSearch}
                searchValue={search}
                onScrollEnd={pagination?.has_next ? loadMore : undefined}
                loading={loading}
              />
            </div>

            <div>
              <Label className="text-sm">Campaign Type</Label>
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
                <p className="text-xs text-gray-500 mt-1">
                  Type automatically set from selected contract
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput
              label="Projected Budget"
              value={campaignData.budget_projected}
              onChange={handleBudgetChange}
              placeholder="10.000.000"
              currency="VND"
            />
            <div className="text-xs text-gray-500">
              <p>Enter the projected budget for this campaign</p>
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
                <Label className="text-sm">Campaign Name *</Label>
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
                  onChange={(e) => setCampaignData((s) => ({ ...s, description: e.target.value }))}
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
              <DatePicker
                label="Start Date"
                value={campaignData.start_date}
                onChange={handleStartDateChange}
                placeholder="Pick start date"
                required={true}
              />
              {selectedContract && (
                <p className="text-xs text-gray-500 mt-1">
                  Auto-filled from contract (can be modified)
                </p>
              )}

              <DatePicker
                label="End Date"
                value={campaignData.end_date}
                onChange={handleEndDateChange}
                placeholder="Pick end date"
                required={true}
              />
              {selectedContract && (
                <p className="text-xs text-gray-500 mt-1">
                  Auto-filled from contract (can be modified)
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
        <div className="flex gap-3">
          <Button onClick={onNext} disabled={!isCampaignValid}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
