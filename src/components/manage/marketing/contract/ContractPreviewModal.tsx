import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContractPDF } from "./ContractPreview";
import { FaEye, FaFileArrowDown, FaCircleCheck } from "react-icons/fa6";
import { PDFDownloadLink } from "@react-pdf/renderer";

interface ContractPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractData: any;
  onConfirmCreate?: (e: React.FormEvent) => Promise<void>;
}

export const ContractPreviewModal: React.FC<ContractPreviewModalProps> = ({
  isOpen,
  onClose,
  contractData,
  onConfirmCreate,
}) => {
  if (!contractData) return null;

  const formatContractDataForPreview = (formData: any) => {
    const formatDateForPreview = (dateString: string): string => {
      if (!dateString) return "";
      if (dateString.includes("T")) return dateString;
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString();
    };

    // Check if this is existing contract data (from API) or form data (from create form)
    const isExistingContract = formData.brand && typeof formData.brand === "object";

    return {
      contract_number: formData.contract_number, // snake_case
      title: formData.title,
      type: formData.type,
      status: formData.status || "DRAFT",
      signed_date: formatDateForPreview(formData.signed_date), // snake_case
      signed_location: formData.signed_location, // snake_case
      start_date: formatDateForPreview(formData.start_date), // snake_case
      end_date: formatDateForPreview(formData.end_date), // snake_case
      currency: formData.currency || "VND",

      brand: isExistingContract
        ? {
            // For existing contract data from API
            name: formData.brand?.name || "Brand Name",
            representative_name: formData.brand?.representative_name,
            representative_role: formData.brand?.representative_role,
            contact_name: formData.brand?.representative_name || formData.brand?.contact_name,
            contact_email: formData.brand?.contact_email,
            contact_phone: formData.brand?.contact_phone,
            address: formData.brand?.address || "Brand Address",
            tax_number: formData.brand?.tax_number,
            bank_name: formData.brand?.bank_name,
            bank_account_number: formData.brand?.bank_account_number,
            bank_account_holder: formData.brand?.bank_account_holder,
          }
        : {
            // For form data from create contract
            name: formData.brand_name || "Brand Name", // snake_case
            representative_name: formData.brand_representative_name, // snake_case
            representative_role: formData.brand_representative_role, // snake_case
            contact_name: formData.brand_representative_name, // snake_case
            address: formData.brand_address || "Brand Address", // snake_case
            tax_number: formData.brand_tax_number, // snake_case
            bank_name: formData.brand_bank_name, // snake_case
            bank_account_number: formData.brand_bank_account_number, // snake_case
            bank_account_holder: formData.brand_bank_account_holder, // snake_case
          },

      representative_name: formData.representative_name, // snake_case
      representative_role: formData.representative_role, // snake_case
      representative_phone: formData.representative_phone, // snake_case
      representative_email: formData.representative_email, // snake_case
      representative_tax_number: formData.representative_tax_number, // snake_case
      representative_bank_name: formData.representative_bank_name, // snake_case
      representative_bank_account_number: formData.representative_bank_account_number, // snake_case
      representative_bank_account_holder: formData.representative_bank_account_holder, // snake_case

      deposit_percent: formData.deposit_percent ?? undefined,
      deposit_amount:
        formData.deposit_amount ??
        (formData.deposit_percent && formData.deposit_percent > 0
          ? (formData.financial_terms?.total_cost || 0) * (formData.deposit_percent / 100) // snake_case
          : undefined),
      is_deposit_paid: formData.is_deposit_paid,

      scope_of_work: formData.scope_of_work
        ? {
            // snake_case
            general_requirements: formData.scope_of_work?.general_requirements || [], // snake_case
            deliverables: formData.scope_of_work?.deliverables || {},
          }
        : {
            general_requirements: [],
            deliverables: {},
          },

      financial_terms: formData.financial_terms
        ? {
            // Copy existing financial_terms structure
            ...formData.financial_terms,
            // Ensure payment_method has a default
            payment_method: formData.financial_terms?.payment_method || "BANK_TRANSFER", // snake_case
          }
        : {
            // snake_case
            model:
              formData.type === "ADVERTISING" || formData.type === "BRAND_AMBASSADOR"
                ? "FIXED"
                : formData.type === "AFFILIATE"
                  ? "LEVELS"
                  : formData.type === "CO_PRODUCING"
                    ? "SHARE"
                    : "FIXED",
            payment_method: "BANK_TRANSFER", // snake_case
          },

      legal_terms: formData.legal_terms || {
        // snake_case
        breach_of_contract: {
          // snake_case
          label: "Breach of Contract", // snake_case
          items: [
            {
              title: "Party A (Brand) breaks the rules",
              details: ["Contract terminates immediately", "Party A forfeits the deposit"],
            },
            {
              title: "Party B (Service Provider) breaks the rules",
              details: [
                "Contract terminates immediately",
                "Party B must refund the deposit",
                "Party B pays additional 10% compensation", // snake_case
              ],
              compensation_percent: 10, // snake_case
            },
            {
              title: "Mutual agreement to terminate",
              details: [
                "Contract stops with no penalties",
                "No compensation required from either party",
              ],
            },
          ],
        },
        standard_terms: {
          // snake_case
          label: "Standard Terms", // snake_case
          items: [
            {
              title: "Confidentiality",
              description:
                "Both parties must keep all contract information confidential and cannot disclose to third parties without written consent",
            },
            {
              title: "Dispute Resolution",
              description:
                "Disputes will be resolved through negotiation first, then legal proceedings if necessary",
            },
            {
              title: "Contract Effectiveness",
              description:
                "Contract is effective from signature date until all obligations are fulfilled",
            },
            {
              title: "Force Majeure",
              description:
                "Neither party is liable for failure to perform due to circumstances beyond their control, including natural disasters or government actions",
            },
          ],
        },
      },
    };
  };

  const previewData = formatContractDataForPreview(contractData);

  // Helper functions for formatting (same as ContractPDF)
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const normalized = dateStr.replace(" ", "T");
    const d = new Date(normalized);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoney = (amount?: number | null) => {
    const currency = previewData.currency || "VND";
    if (amount === undefined || amount === null) return `0 ${currency}`;
    try {
      return `${Number(amount).toLocaleString("vi-VN", {
        minimumFractionDigits: 0,
      })} ${currency}`;
    } catch {
      return `${amount} ${currency}`;
    }
  };

  const formatPaymentDate = (cycle: string, date: any) => {
    if (!date) return "N/A";

    const getOrdinal = (n: number) => {
      if (n === 1) return "1st";
      if (n === 2) return "2nd";
      if (n === 3) return "3rd";
      return `${n}th`;
    };

    switch (cycle) {
      case "MONTHLY":
        return `Day ${date} of every month`;

      case "QUARTERLY":
        if (typeof date === "object" && date.day && date.month) {
          const monthInQuarter = ((date.month - 1) % 3) + 1;
          return `Day ${date.day} of the ${getOrdinal(monthInQuarter)} month of each quarter`;
        }
        return "N/A";

      case "ANNUALLY":
        if (typeof date === "string") {
          const d = new Date(date);
          if (!isNaN(d.getTime())) {
            return `Day ${d.getDate()} of ${d.toLocaleString("en-US", { month: "long" })} every year`;
          }
        }
        return "N/A";

      default:
        return date;
    }
  };

  // Render scope of work based on contract type
  const renderScopeOfWork = () => {
    const deliverables = previewData.scope_of_work?.deliverables ?? {};
    const events = deliverables.events ?? [];
    const concepts = deliverables.concepts ?? [];
    const products = deliverables.products ?? [];
    const advertised_items = deliverables.advertised_items ?? []; // snake_case
    const platforms = deliverables.platform ?? [];

    switch (previewData.type) {
      case "BRAND_AMBASSADOR":
        return events.map((event: any, i: number) => (
          <div key={i} className="mb-6 pl-4 border-l-2 border-blue-400">
            <h4 className="text-sm font-bold text-blue-900 mb-2">
              {i + 1}. {event.name} - Event #{i + 1}
            </h4>
            <p className="text-xs mb-1">
              <span className="font-semibold">Location:</span> {event.location || "N/A"}
            </p>
            <p className="text-xs mb-1">
              <span className="font-semibold">Date & Duration:</span>{" "}
              {formatDateTime(event.date || event.date_time || event.date_time_iso)} (Expected
              duration: {event.expected_duration || "N/A"}) {/* snake_case */}
            </p>

            {(event.activities ?? []).length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-xs text-gray-700 underline">Activities:</p>
                {(event.activities ?? []).map((activity: string, j: number) => (
                  <p key={j} className="ml-5 text-xs text-gray-600">
                    • {activity}
                  </p>
                ))}
              </div>
            )}

            {(event.representation_rules ?? []).length > 0 && ( // snake_case
              <div className="mt-2">
                <p className="font-semibold text-xs text-gray-700 underline">
                  Representation Rules:
                </p>
                {(event.representation_rules ?? []).map(
                  (
                    rule: string,
                    j: number, // snake_case
                  ) => (
                    <p key={j} className="ml-5 text-xs text-gray-600">
                      • {rule}
                    </p>
                  ),
                )}
              </div>
            )}

            {(event.kpis ?? []).length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-xs text-gray-700 underline">
                  Key Performance Indicators (KPIs):
                </p>
                {(event.kpis ?? []).map((kpi: any, j: number) => (
                  <p key={j} className="ml-5 text-xs text-gray-600">
                    •{" "}
                    <span className="font-semibold">
                      {(kpi.metric || "").toString().replace(/_/g, " ")}
                    </span>
                    : {kpi.target || "To be confirmed"}
                  </p>
                ))}
              </div>
            )}
          </div>
        ));

      case "CO_PRODUCING":
        return (
          <div>
            <h4 className="text-sm font-bold text-gray-900 underline mb-2">
              1. Product Concepts and Creation
            </h4>
            {concepts.map((concept: any, i: number) => (
              <div key={i} className="mb-4 pl-4 border-l-2 border-blue-400">
                <h5 className="text-sm font-bold text-blue-900 mb-1">
                  Concept #{i + 1}: {concept.name || `Concept ${i + 1}`}
                </h5>
                <p className="text-xs mb-1">
                  <span className="font-semibold">Description:</span> {concept.description || "N/A"}
                </p>
                <p className="text-xs mb-1">
                  <span className="font-semibold">Platform:</span> {concept.platform || "N/A"} |{" "}
                  <span className="font-semibold">Tagline:</span> {concept.tagline || "N/A"}
                </p>
                {(concept.hash_tag ?? []).length > 0 && ( // snake_case
                  <p className="text-xs mb-1">
                    <span className="font-semibold">Hashtags:</span>{" "}
                    {(concept.hash_tag ?? []).join(", ")} {/* snake_case */}
                  </p>
                )}
                {concept.creative_notes && ( // snake_case
                  <p className="text-xs mb-1">
                    <span className="font-semibold">Creative Notes:</span> {concept.creative_notes}{" "}
                    {/* snake_case */}
                  </p>
                )}
                {(concept.content_requirements ?? []).length > 0 && ( // snake_case
                  <div className="mt-2">
                    <p className="font-semibold text-xs text-gray-700 underline">
                      Content Requirements:
                    </p>
                    {(concept.content_requirements ?? []).map(
                      (
                        req: string,
                        j: number, // snake_case
                      ) => (
                        <p key={j} className="ml-5 text-xs text-gray-600">
                          • {req}
                        </p>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}

            <h4 className="text-sm font-bold text-gray-900 underline mb-2 mt-4">
              2. Products Under Agreement
            </h4>
            {products.map((product: any, i: number) => (
              <div key={i} className="mb-2">
                <p className="text-xs mb-1">
                  <span className="font-semibold">Product #{i + 1}:</span> {product.name || "N/A"}
                </p>
                <p className="text-xs mb-1">
                  <span className="font-semibold">Description:</span> {product.description || "N/A"}
                </p>
                {(product.kpis ?? []).length > 0 && (
                  <div className="mt-1">
                    <p className="font-semibold text-xs text-gray-700 underline">KPIs:</p>
                    {(product.kpis ?? []).map((kpi: any, j: number) => (
                      <p key={j} className="ml-5 text-xs text-gray-600">
                        •{" "}
                        <span className="font-semibold">
                          {(kpi.metric || "").replace(/_/g, " ")}
                        </span>
                        : {kpi.target || "N/A"}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "AFFILIATE":
        return (
          <div>
            <p className="text-xs mb-2">
              <span className="font-semibold">Target Platform(s):</span>{" "}
              {platforms?.length > 0 ? platforms.join(", ") : "N/A"}
            </p>

            {deliverables?.tracking_link && ( // snake_case
              <p className="text-xs mb-2">
                <span className="font-semibold">Tracking Link:</span> {deliverables.tracking_link}{" "}
                {/* snake_case */}
              </p>
            )}

            <h4 className="text-sm font-bold text-gray-900 underline mb-2">
              Advertised Items and Content
            </h4>

            {advertised_items.length > 0 ? ( // snake_case
              advertised_items.map(
                (
                  item: any,
                  i: number, // snake_case
                ) => (
                  <div key={i} className="mb-4">
                    <h5 className="text-sm font-bold text-gray-900 uppercase mb-1">
                      {i + 1}. {item.name || `[Unnamed Item ${i + 1}]`}
                    </h5>

                    <p className="ml-5 text-xs text-gray-600 mb-1">
                      • <span className="font-semibold">Description:</span>{" "}
                      {item.description || "Not specified."}
                    </p>
                    <p className="ml-5 text-xs text-gray-600 mb-1">
                      • <span className="font-semibold">Platform:</span>{" "}
                      {item.platform || "Not specified."}
                    </p>
                    <p className="ml-5 text-xs text-gray-600 mb-1">
                      • <span className="font-semibold">Tagline:</span>{" "}
                      {item.tagline || "Not specified."}
                    </p>

                    {item.hash_tag?.length > 0 && ( // snake_case
                      <p className="ml-5 text-xs text-gray-600 mb-1">
                        • <span className="font-semibold">Associated Hashtags:</span>{" "}
                        {item.hash_tag.join(", ")} {/* snake_case */}
                      </p>
                    )}

                    {(item.content_requirements ?? []).length > 0 && ( // snake_case
                      <div className="ml-5 text-xs text-gray-600 mb-1">
                        • <span className="font-semibold">Content Requirements:</span>
                        {item.content_requirements.map(
                          (
                            req: string,
                            j: number, // snake_case
                          ) => (
                            <p key={j} className="ml-4 text-xs text-gray-600">
                              ○ {req}
                            </p>
                          ),
                        )}
                      </div>
                    )}

                    {item.creative_notes && ( // snake_case
                      <p className="ml-5 text-xs text-gray-600 mb-1">
                        • <span className="font-semibold">Creative Notes:</span>{" "}
                        {item.creative_notes} {/* snake_case */}
                      </p>
                    )}

                    {(item.kpis ?? []).length > 0 && (
                      <div className="ml-5 text-xs text-gray-600 mb-1">
                        • <span className="font-semibold">Key Performance Indicators (KPIs):</span>
                        {item.kpis.map((kpi: any, j: number) => (
                          <p key={j} className="ml-4 text-xs text-gray-600">
                            ○ <span className="font-semibold">{kpi.metric || "Metric"}:</span>{" "}
                            {kpi.target ? `${kpi.target}` : "No target specified"}{" "}
                            {kpi.description && <span className="italic">({kpi.description})</span>}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              )
            ) : (
              <p className="text-xs italic text-gray-500">No advertised items listed.</p>
            )}
          </div>
        );

      case "ADVERTISING":
      default:
        if (advertised_items.length > 0) {
          // snake_case
          return advertised_items.map(
            (
              item: any,
              i: number, // snake_case
            ) => (
              <div key={i} className="mb-4">
                <h5 className="text-sm font-bold text-gray-900 uppercase mb-1">
                  {i + 1}. {item.name || `[Unnamed Item ${i + 1}]`}
                </h5>

                <p className="ml-5 text-xs text-gray-600 mb-1">
                  • <span className="font-semibold">Description:</span>{" "}
                  {item.description || "Not specified."}
                </p>
                <p className="ml-5 text-xs text-gray-600 mb-1">
                  • <span className="font-semibold">Platform:</span>{" "}
                  {item.platform || "Not specified."}
                </p>
                <p className="ml-5 text-xs text-gray-600 mb-1">
                  • <span className="font-semibold">Tagline:</span>{" "}
                  {item.tagline || "Not specified."}
                </p>

                {item.hash_tag?.length > 0 && ( // snake_case
                  <p className="ml-5 text-xs text-gray-600 mb-1">
                    • <span className="font-semibold">Associated Hashtags:</span>{" "}
                    {item.hash_tag.join(", ")} {/* snake_case */}
                  </p>
                )}

                {(item.content_requirements ?? []).length > 0 && ( // snake_case
                  <div className="ml-5 text-xs text-gray-600 mb-1">
                    • <span className="font-semibold">Content Requirements:</span>
                    {item.content_requirements.map(
                      (
                        req: string,
                        j: number, // snake_case
                      ) => (
                        <p key={j} className="ml-4 text-xs text-gray-600">
                          ○ {req}
                        </p>
                      ),
                    )}
                  </div>
                )}

                {item.creative_notes && ( // snake_case
                  <p className="ml-5 text-xs text-gray-600 mb-1">
                    • <span className="font-semibold">Creative Notes:</span> {item.creative_notes}{" "}
                    {/* snake_case */}
                  </p>
                )}

                {(item.kpis ?? []).length > 0 && (
                  <div className="ml-5 text-xs text-gray-600 mb-1">
                    • <span className="font-semibold">Key Performance Indicators (KPIs):</span>
                    {item.kpis.map((kpi: any, j: number) => (
                      <p key={j} className="ml-4 text-xs text-gray-600">
                        ○ <span className="font-semibold">{kpi.metric || "Metric"}:</span>{" "}
                        {kpi.target ? `${kpi.target}` : "No target specified"}{" "}
                        {kpi.description && <span className="italic">({kpi.description})</span>}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ),
          );
        }
        return null;
    }
  };

  // Render financial terms based on contract type
  const renderFinancialTerms = () => {
    const financial = previewData.financial_terms ?? {};

    switch (previewData.type) {
      case "CO_PRODUCING":
        return (
          <div>
            <p className="text-xs mb-1">
              <span className="font-semibold">Payment Model:</span>{" "}
              <span className="font-semibold">{financial.model || "N/A"}</span> (Revenue Share)
            </p>
            <p className="text-xs mb-1">
              <span className="font-semibold">Distribution Cycle:</span>{" "}
              {financial.profit_distribution_cycle || "N/A"} ( {/* snake_case */}
              <span className="font-semibold">
                {formatPaymentDate(
                  financial.profit_distribution_cycle, // snake_case
                  financial.profit_distribution_date, // snake_case
                )}
              </span>
              )
            </p>
            <div className="mt-2 p-2 bg-gray-100 border-t border-b border-gray-300">
              <p className="text-xs font-semibold mb-1">Profit Distribution Split</p>
              <p className="text-xs mb-1">
                <span className="font-semibold">Party A (Brand) Share:</span>{" "}
                <span className="font-semibold">
                  {financial.profit_split_company_percent ?? 0}% {/* snake_case */}
                </span>
              </p>
              <p className="text-xs">
                <span className="font-semibold">Party B (KOL) Share:</span>{" "}
                <span className="font-semibold">{financial.profit_split_kol_percent ?? 0}%</span>{" "}
                {/* snake_case */}
              </p>
            </div>
          </div>
        );

      case "AFFILIATE":
        return (
          <div>
            <p className="text-xs mb-1">
              <span className="font-semibold">Payment Model:</span>{" "}
              <span className="font-semibold">{financial.model || "N/A"}</span>
            </p>
            <p className="text-xs mb-1">
              <span className="font-semibold">Payment Cycle:</span>{" "}
              {financial.payment_cycle || "N/A"} (on {/* snake_case */}
              <span className="font-semibold">
                {formatPaymentDate(financial.payment_cycle, financial.payment_date)}{" "}
                {/* snake_case */}
              </span>
              )
            </p>
            <p className="text-xs mb-1">
              <span className="font-semibold">Base Per Click Rate:</span>{" "}
              <span className="font-semibold">{formatMoney(financial.base_per_click)}</span>{" "}
              {/* snake_case */}
            </p>
            {(financial.levels ?? []).length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-xs text-gray-700 underline mb-1">
                  Performance Levels (Tiered Payout):
                </p>
                {(financial.levels ?? []).map((level: any, i: number) => (
                  <p key={i} className="ml-5 text-xs text-gray-600">
                    • <span className="font-semibold">Level {level.level}</span>: Up to{" "}
                    {level.max_clicks} clicks, Multiplier: {/* snake_case */}
                    <span className="font-semibold">{level.multiplier}x</span>
                  </p>
                ))}
              </div>
            )}
            {financial.tax_withholding && ( // snake_case
              <div className="mt-2">
                <p className="font-semibold text-xs text-gray-700 underline mb-1">
                  Tax Withholding:
                </p>
                <p className="text-xs">
                  A tax rate of{" "}
                  <span className="font-semibold">{financial.tax_withholding.rate_percent}%</span>{" "}
                  {/* snake_case */}
                  will be withheld for earnings exceeding{" "}
                  <span className="font-semibold">
                    {formatMoney(financial.tax_withholding.threshold)} {/* snake_case */}
                  </span>
                  .
                </p>
              </div>
            )}
          </div>
        );

      case "BRAND_AMBASSADOR":
      case "ADVERTISING":
      default:
        return (
          <div>
            <p className="text-xs mb-1">
              <span className="font-semibold">Payment Model:</span>{" "}
              <span className="font-semibold">{financial.model || "N/A"}</span>
            </p>
            <p className="text-xs mb-1">
              <span className="font-semibold">Payment Method:</span>{" "}
              {(financial.payment_method || "").toString().replace(/_/g, " ")} {/* snake_case */}
            </p>
            <p className="text-xs mb-1">
              <span className="font-semibold">Total Contract Value:</span>{" "}
              <span className="text-lg font-bold">{formatMoney(financial.total_cost)}</span>{" "}
              {/* snake_case */}
            </p>
            {financial.cost_breakdown && ( // snake_case
              <div className="mt-2">
                <p className="font-semibold text-xs text-gray-700 underline mb-1">
                  Cost Breakdown:
                </p>
                {Object.entries(financial.cost_breakdown || {}).map(
                  // snake_case
                  ([key, value]: [string, any], i: number) => (
                    <p key={i} className="ml-5 text-xs text-gray-600">
                      • <span className="font-semibold">{key.replace(/_/g, " ")}</span>:{" "}
                      {formatMoney(value)}
                    </p>
                  ),
                )}
              </div>
            )}
            {(financial.schedule ?? []).length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-xs text-gray-700 underline mb-1">
                  Payment Schedule Milestones:
                </p>
                {(financial.schedule ?? []).map((item: any, i: number) => (
                  <p key={i} className="ml-5 text-xs text-gray-600">
                    {i + 1}. <span className="font-semibold">{item.milestone}</span>:{" "}
                    <span className="font-semibold">{formatMoney(item.amount)}</span> (
                    {item.percent}%) due by{" "}
                    <span className="font-semibold">{formatDate(item.due_date)}</span>{" "}
                    {/* snake_case */}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  // ADD: Handler để call onConfirmCreate với event
  const handleConfirmCreate = async () => {
    if (onConfirmCreate) {
      const syntheticEvent = new Event("submit") as any;
      await onConfirmCreate(syntheticEvent);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl p-0 flex flex-col">
        <DialogHeader className="px-6 py-4">
          <div className="flex items-center gap-2">
            <FaEye className="h-5 w-5 text-indigo-600" />
            <DialogTitle className="text-lg font-bold text-indigo-900 tracking-wide">
              Contract Preview
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Contract Content Preview */}
          <div className="bg-white text-gray-900 max-w-4xl mx-auto p-8 shadow-2xl leading-relaxed border rounded-lg">
            <header className="text-center mb-8 border-b border-gray-400 pb-4">
              <div className="flex justify-center mb-4">
                <img src="/pink.png" alt="Platform Logo" className="h-24 w-auto object-contain" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2 uppercase tracking-widest">
                Contract Agreement
              </h1>
              <p className="text-base text-gray-700 font-medium">
                <span className="font-semibold">
                  {(previewData.type || "").toString().replace(/_/g, " ")}
                </span>{" "}
                Service Contract | Contract No.{" "}
                <span className="font-semibold">{previewData.contract_number}</span>{" "}
                {/* snake_case */}
              </p>
              <p className="text-lg font-bold mt-3 text-gray-800 italic">{previewData.title}</p>
            </header>

            {/* Article 1: Parties */}
            <section className="mb-6">
              <h2 className="text-base font-bold uppercase mb-3 text-gray-900">
                ARTICLE 1: PARTIES INVOLVED
              </h2>
              <p className="text-xs mb-3">
                This Agreement is hereby executed on{" "}
                <span className="font-semibold">{formatDate(previewData.signed_date)}</span> at{" "}
                {/* snake_case */}
                <span className="font-semibold">{previewData.signed_location || "N/A"}</span>,{" "}
                {/* snake_case */}
                effective from the{" "}
                <span className="font-semibold">
                  {formatDate(previewData.start_date)}
                </span> until {/* snake_case */}
                <span className="font-semibold">{formatDate(previewData.end_date)}</span>, by and{" "}
                {/* snake_case */}
                between:
              </p>

              <h3 className="text-sm font-bold underline text-gray-800 mb-2">
                Party A (The Brand/Company)
              </h3>
              <p className="text-xs mb-1">
                <span className="font-semibold">Company Name:</span>{" "}
                {previewData.brand?.name || "N/A"}
              </p>
              <p className="text-xs mb-1">
                <span className="font-semibold">Representative:</span>{" "}
                {previewData.brand?.representative_name || previewData.brand?.contact_name || "N/A"}
                , {/* snake_case */}
                {previewData.brand?.representative_role || "N/A"} {/* snake_case */}
              </p>
              <p className="text-xs mb-1">
                <span className="font-semibold">Address:</span>{" "}
                {previewData.brand?.address || "N/A"}
              </p>
              <p className="text-xs mb-1">
                <span className="font-semibold">Tax ID:</span>{" "}
                {previewData.brand?.tax_number || "N/A"} {/* snake_case */}
              </p>
              <p className="text-xs mb-3">
                <span className="font-semibold">Bank Account:</span>{" "}
                {previewData.brand?.bank_account_number || "N/A"} ( {/* snake_case */}
                {previewData.brand?.bank_account_holder || "N/A"} - {/* snake_case */}
                {previewData.brand?.bank_name || "N/A"}) {/* snake_case */}
              </p>

              <h3 className="text-sm font-bold underline text-gray-800 mb-2">
                Party B (The Service Provider/KOL)
              </h3>
              <p className="text-xs mb-1">
                <span className="font-semibold">Name:</span>{" "}
                {previewData.representative_name || "N/A"} {/* snake_case */}
              </p>
              <p className="text-xs mb-1">
                <span className="font-semibold">Role/Title:</span>{" "}
                {previewData.representative_role || "N/A"} {/* snake_case */}
              </p>
              <p className="text-xs mb-1">
                <span className="font-semibold">Tax ID:</span>{" "}
                {previewData.representative_tax_number || "N/A"} {/* snake_case */}
              </p>
              <p className="text-xs mb-1">
                <span className="font-semibold">Bank Account:</span>{" "}
                {previewData.representative_bank_account_number || "N/A"} ( {/* snake_case */}
                {previewData.representative_bank_account_holder || "N/A"} - {/* snake_case */}
                {previewData.representative_bank_name || "N/A"}) {/* snake_case */}
              </p>
            </section>

            {/* Article 2: Scope of Work */}
            <section className="mb-6">
              <h2 className="text-base font-bold uppercase mb-3 text-gray-900">
                ARTICLE 2: SCOPE OF WORK AND DELIVERABLES
              </h2>
              {renderScopeOfWork()}
              {(previewData.scope_of_work?.general_requirements ?? []).length > 0 && ( // snake_case
                <div className="mt-3">
                  <p className="font-semibold text-xs text-gray-700 underline mb-1">
                    General Obligations of Party B:
                  </p>
                  {(previewData.scope_of_work?.general_requirements ?? []).map(
                    // snake_case
                    (r: string, i: number) => (
                      <p key={i} className="ml-5 text-xs text-gray-600">
                        • {r}
                      </p>
                    ),
                  )}
                </div>
              )}
            </section>

            {/* Article 3: Financial Terms */}
            <section className="mb-6">
              <h2 className="text-base font-bold uppercase mb-3 text-gray-900">
                ARTICLE 3: FINANCIAL TERMS AND PAYMENT
              </h2>
              {"deposit_amount" in previewData &&
                previewData.deposit_amount && ( // snake_case
                  <p className="text-xs mb-2">
                    <span className="font-semibold">Security Deposit:</span> A deposit of{" "}
                    <span className="font-semibold">{formatMoney(previewData.deposit_amount)}</span>{" "}
                    {/* snake_case */}
                    (representing{" "}
                    <span className="font-semibold">
                      {previewData.deposit_percent ?? "N/A"}%
                    </span>{" "}
                    of {/* snake_case */}
                    the total) shall be paid by Party A upon execution of this contract.
                  </p>
                )}
              {renderFinancialTerms()}
            </section>

            {/* Article 4: Breach and Termination */}
            <section className="mb-6">
              <h2 className="text-base font-bold uppercase mb-3 text-gray-900">
                ARTICLE 4: BREACH AND TERMINATION
              </h2>
              <h3 className="text-sm font-bold underline text-gray-800 mb-2">
                Penalties for Breach of Contract:
              </h3>
              {(previewData.legal_terms?.breach_of_contract?.items ?? []).map(
                // snake_case
                (item: any, i: number) => (
                  <div key={i} className="p-2 mb-2">
                    <p className="text-xs font-bold text-red-700 mb-1">{item.title}</p>
                    {(item.details ?? []).map((d: string, j: number) => (
                      <p key={j} className="ml-5 text-xs text-gray-600">
                        • {d}
                      </p>
                    ))}
                  </div>
                ),
              )}
            </section>

            {/* Article 5: Standard Legal Terms */}
            <section className="mb-6">
              <h2 className="text-base font-bold uppercase mb-3 text-gray-900">
                ARTICLE 5: STANDARD LEGAL TERMS
              </h2>
              {(previewData.legal_terms?.standard_terms?.items ?? []).map(
                // snake_case
                (term: any, i: number) => (
                  <div key={i} className="mb-3">
                    <p className="text-xs font-bold underline text-gray-800">
                      {i + 1}. {term.title}:
                    </p>
                    <p className="text-xs ml-3 text-gray-700">{term.description}</p>
                  </div>
                ),
              )}
            </section>

            <section className="mt-8 pt-6 border-t border-gray-600">
              <p className="text-xs font-bold text-center mb-4">
                IN WITNESS WHEREOF, the Parties have executed this Agreement on the date first
                written above.
              </p>
              <div className="flex justify-between mt-6">
                <div className="w-2/5 text-center">
                  <p className="text-xs font-bold mb-2">For and on behalf of Party A (The Brand)</p>
                  <p className="text-sm font-bold mt-8 uppercase">
                    {previewData.brand?.representative_name || "N/A"} {/* snake_case */}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {previewData.brand?.representative_role || "N/A"} {/* snake_case */}
                  </p>
                </div>
                <div className="w-2/5 text-center">
                  <p className="text-xs font-bold mb-2">
                    For and on behalf of Party B (The Service Provider)
                  </p>
                  <p className="text-sm font-bold mt-8 uppercase">
                    {previewData.representative_name || "N/A"} {/* snake_case */}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {previewData.representative_role || "N/A"} {/* snake_case */}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2 px-6 py-4">
          <PDFDownloadLink
            document={<ContractPDF data={previewData} />}
            fileName={`${previewData.title || "contract"}_preview.pdf`}
          >
            {({ loading }) => (
              <Button
                variant="outline"
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                disabled={loading}
              >
                <FaFileArrowDown className="h-4 w-4 mr-2" />
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>

          {onConfirmCreate && (
            <Button
              onClick={handleConfirmCreate}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FaCircleCheck className="h-4 w-4 mr-2" />
              Create Draft Contract
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
