import "./font";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Montserrat",
    fontSize: 11,
    paddingTop: 35,
    paddingLeft: 35,
    paddingRight: 35,
    paddingBottom: 65,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: 1,
    borderBottomColor: "#666",
    paddingBottom: 10,
  },
  logo: {
    height: 120,
    marginBottom: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
    color: "#333",
  },
  contractTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    fontStyle: "italic",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    textDecoration: "underline",
    color: "#333",
  },
  subHeading: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    color: "#555",
    textDecoration: "underline",
  },
  textBlock: {
    marginBottom: 4,
    fontSize: 10,
    color: "#333",
    lineHeight: 1.4,
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 2,
    fontSize: 10,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
  },
  financialHighlight: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  splitSection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderTop: 1,
    borderBottom: 1,
    borderColor: "#ccc",
  },
  deliverableSection: {
    marginBottom: 15,
    paddingLeft: 10,
    borderLeft: 2,
    borderLeftColor: "#3b82f6",
  },
  deliverableTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  penaltySection: {
    padding: 8,
    marginBottom: 6,
  },
  penaltyTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: 3,
  },
  signatureSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: 1,
    borderTopColor: "#666",
  },
  signatureGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  signatureColumn: {
    width: "45%",
    textAlign: "center",
  },
  signatureName: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
    textTransform: "uppercase",
  },
  signatureRole: {
    fontSize: 10,
    color: "#555",
    marginTop: 2,
  },
});

// PDF Document Component
export const ContractPDF = ({ data }: { data: any }) => {
  // Helper functions
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
    const currency = data.currency || "VND";
    if (amount === undefined || amount === null) return `0 ${currency}`;
    try {
      return `${Number(amount).toLocaleString("vi-VN", {
        minimumFractionDigits: 0,
      })} ${currency}`;
    } catch {
      return `${amount} ${currency}`;
    }
  };

  // Render scope of work based on contract type
  const renderScopeOfWork = () => {
    const deliverables = data.scope_of_work?.deliverables ?? {};
    const events = deliverables.events ?? [];
    const concepts = deliverables.concepts ?? [];
    const products = deliverables.products ?? [];
    const advertised_items = deliverables.advertised_items ?? [];
    const platforms = deliverables.platform ?? [];

    switch (data.type) {
      case "BRAND_AMBASSADOR":
        return events.map((event: any, i: number) => (
          <View key={i} style={styles.deliverableSection}>
            <Text style={styles.deliverableTitle}>
              {i + 1}. {event.name} - Event #{i + 1}
            </Text>
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Location:</Text> {event.location || "N/A"}
            </Text>
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Date & Duration:</Text>{" "}
              {formatDateTime(event.date || event.date_time || event.date_time_iso)} (Expected
              duration: {event.expected_duration || "N/A"})
            </Text>

            {(event.activities ?? []).length > 0 && (
              <View>
                <Text style={styles.subHeading}>Activities:</Text>
                {(event.activities ?? []).map((activity: string, j: number) => (
                  <Text key={j} style={styles.listItem}>
                    • {activity}
                  </Text>
                ))}
              </View>
            )}

            {(event.representation_rules ?? []).length > 0 && (
              <View>
                <Text style={styles.subHeading}>Representation Rules:</Text>
                {(event.representation_rules ?? []).map((rule: string, j: number) => (
                  <Text key={j} style={styles.listItem}>
                    • {rule}
                  </Text>
                ))}
              </View>
            )}

            {(event.kpis ?? []).length > 0 && (
              <View>
                <Text style={styles.subHeading}>Key Performance Indicators (KPIs):</Text>
                {(event.kpis ?? []).map((kpi: any, j: number) => (
                  <Text key={j} style={styles.listItem}>
                    •{" "}
                    <Text style={styles.bold}>
                      {(kpi.metric || "").toString().replace(/_/g, " ")}
                    </Text>
                    : {kpi.target || "To be confirmed"}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ));

      case "CO_PRODUCING":
        return (
          <View>
            <Text style={styles.sectionTitle}>1. Product Concepts and Creation</Text>
            {concepts.map((concept: any, i: number) => (
              <View key={i} style={styles.deliverableSection}>
                <Text style={styles.deliverableTitle}>
                  Concept #{i + 1}: {concept.name || `Concept ${i + 1}`}
                </Text>
                <Text style={styles.textBlock}>
                  <Text style={styles.bold}>Description:</Text> {concept.description || "N/A"}
                </Text>
                <Text style={styles.textBlock}>
                  <Text style={styles.bold}>Platform:</Text> {concept.platform || "N/A"} |{" "}
                  <Text style={styles.bold}>Tagline:</Text> {concept.tagline || "N/A"}
                </Text>
                {(concept.hash_tag ?? []).length > 0 && (
                  <Text style={styles.textBlock}>
                    <Text style={styles.bold}>Hashtags:</Text> {(concept.hash_tag ?? []).join(", ")}
                  </Text>
                )}
                {concept.creative_notes && (
                  <Text style={styles.textBlock}>
                    <Text style={styles.bold}>Creative Notes:</Text> {concept.creative_notes}
                  </Text>
                )}
                {(concept.content_requirements ?? []).length > 0 && (
                  <View>
                    <Text style={styles.subHeading}>Content Requirements:</Text>
                    {(concept.content_requirements ?? []).map((req: string, j: number) => (
                      <Text key={j} style={styles.listItem}>
                        • {req}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}

            <Text style={styles.sectionTitle}>2. Products Under Agreement</Text>
            {products.map((product: any, i: number) => (
              <View key={i}>
                <Text style={styles.textBlock}>
                  <Text style={styles.bold}>Product #{i + 1}:</Text> {product.name || "N/A"}
                </Text>
                <Text style={styles.textBlock}>
                  <Text style={styles.bold}>Description:</Text> {product.description || "N/A"}
                </Text>
                {(product.kpis ?? []).length > 0 && (
                  <View>
                    <Text style={styles.subHeading}>KPIs:</Text>
                    {(product.kpis ?? []).map((kpi: any, j: number) => (
                      <Text key={j} style={styles.listItem}>
                        • <Text style={styles.bold}>{(kpi.metric || "").replace(/_/g, " ")}</Text>:{" "}
                        {kpi.target || "N/A"}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        );

      case "AFFILIATE":
        return (
          <View>
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Target Platform(s):</Text>{" "}
              {platforms?.length > 0 ? platforms.join(", ") : "N/A"}
            </Text>

            {deliverables?.tracking_link && (
              <Text style={styles.textBlock}>
                <Text style={styles.bold}>Tracking Link:</Text> {deliverables.tracking_link}
              </Text>
            )}

            <Text style={styles.sectionTitle}>Advertised Items and Content</Text>

            {advertised_items.length > 0 ? (
              advertised_items.map((item: any, i: number) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <Text
                    style={[
                      styles.textBlock,
                      styles.bold,
                      { fontSize: 12, textTransform: "uppercase" },
                    ]}
                  >
                    {i + 1}. {item.name || `[Unnamed Item ${i + 1}]`}
                  </Text>

                  <Text style={styles.listItem}>
                    • <Text style={styles.bold}>Description:</Text>{" "}
                    {item.description || "Not specified."}
                  </Text>
                  <Text style={styles.listItem}>
                    • <Text style={styles.bold}>Platform:</Text> {item.platform || "Not specified."}
                  </Text>
                  <Text style={styles.listItem}>
                    • <Text style={styles.bold}>Tagline:</Text> {item.tagline || "Not specified."}
                  </Text>

                  {item.hash_tag?.length > 0 && (
                    <Text style={styles.listItem}>
                      • <Text style={styles.bold}>Associated Hashtags:</Text>{" "}
                      {item.hash_tag.join(", ")}
                    </Text>
                  )}

                  {(item.content_requirements ?? []).length > 0 && (
                    <View style={{ marginLeft: 20, marginTop: 4 }}>
                      <Text style={styles.listItem}>
                        • <Text style={styles.bold}>Content Requirements:</Text>
                      </Text>
                      {(item.content_requirements ?? []).map((req: string, j: number) => (
                        <Text key={j} style={[styles.listItem, { marginLeft: 35 }]}>
                          ○ {req}
                        </Text>
                      ))}
                    </View>
                  )}

                  {item.creative_notes && (
                    <Text style={styles.listItem}>
                      • <Text style={styles.bold}>Creative Notes:</Text> {item.creative_notes}
                    </Text>
                  )}

                  {(item.kpis ?? []).length > 0 && (
                    <View style={{ marginLeft: 20, marginTop: 4 }}>
                      <Text style={styles.listItem}>
                        • <Text style={styles.bold}>Key Performance Indicators (KPIs):</Text>
                      </Text>
                      {(item.kpis ?? []).map((kpi: any, j: number) => (
                        <Text key={j} style={[styles.listItem, { marginLeft: 35 }]}>
                          ○ <Text style={styles.bold}>{kpi.metric || "Metric"}:</Text>{" "}
                          {kpi.target ? `${kpi.target}` : "No target specified"}{" "}
                          {kpi.description && (
                            <Text style={{ fontStyle: "italic" }}>({kpi.description})</Text>
                          )}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={[styles.textBlock, { fontStyle: "italic", color: "#999" }]}>
                No advertised items listed.
              </Text>
            )}
          </View>
        );

      case "ADVERTISING":
      default:
        if (advertised_items.length > 0) {
          return advertised_items.map((item: any, i: number) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text
                style={[
                  styles.textBlock,
                  styles.bold,
                  { fontSize: 12, textTransform: "uppercase" },
                ]}
              >
                {i + 1}. {item.name || `[Unnamed Item ${i + 1}]`}
              </Text>

              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Description:</Text>{" "}
                {item.description || "Not specified."}
              </Text>
              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Platform:</Text> {item.platform || "Not specified."}
              </Text>
              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Tagline:</Text> {item.tagline || "Not specified."}
              </Text>

              {item.hash_tag?.length > 0 && (
                <Text style={styles.listItem}>
                  • <Text style={styles.bold}>Associated Hashtags:</Text> {item.hash_tag.join(", ")}
                </Text>
              )}

              {(item.content_requirements ?? []).length > 0 && (
                <View style={{ marginLeft: 20, marginTop: 4 }}>
                  <Text style={styles.listItem}>
                    • <Text style={styles.bold}>Content Requirements:</Text>
                  </Text>
                  {(item.content_requirements ?? []).map((req: string, j: number) => (
                    <Text key={j} style={[styles.listItem, { marginLeft: 35 }]}>
                      ○ {req}
                    </Text>
                  ))}
                </View>
              )}

              {item.creative_notes && (
                <Text style={styles.listItem}>
                  • <Text style={styles.bold}>Creative Notes:</Text> {item.creative_notes}
                </Text>
              )}

              {(item.kpis ?? []).length > 0 && (
                <View style={{ marginLeft: 20, marginTop: 4 }}>
                  <Text style={styles.listItem}>
                    • <Text style={styles.bold}>Key Performance Indicators (KPIs):</Text>
                  </Text>
                  {(item.kpis ?? []).map((kpi: any, j: number) => (
                    <Text key={j} style={[styles.listItem, { marginLeft: 35 }]}>
                      ○ <Text style={styles.bold}>{kpi.metric || "Metric"}:</Text>{" "}
                      {kpi.target ? `${kpi.target}` : "No target specified"}{" "}
                      {kpi.description && (
                        <Text style={{ fontStyle: "italic" }}>({kpi.description})</Text>
                      )}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ));
        }
        return null;
    }
  };

  // Render financial terms based on contract type
  const renderFinancialTerms = () => {
    const financial = data.financial_terms ?? {};

    switch (data.type) {
      case "CO_PRODUCING":
        return (
          <View>
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Payment Model:</Text>{" "}
              <Text style={styles.bold}>{financial.model || "N/A"}</Text> (Revenue Share)
            </Text>
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Distribution Cycle:</Text>{" "}
              {financial.profit_distribution_cycle || "N/A"} (
              <Text style={styles.bold}>{financial.profit_distribution_date || "N/A"}th</Text> of
              each cycle)
            </Text>
            <View style={styles.splitSection}>
              <Text style={[styles.textBlock, styles.bold, { fontSize: 12 }]}>
                Profit Distribution Split
              </Text>
              <Text style={styles.textBlock}>
                <Text style={styles.bold}>Party A (Brand) Share:</Text>{" "}
                <Text style={styles.bold}>{financial.profit_split_company_percent ?? 0}%</Text>
              </Text>
              <Text style={styles.textBlock}>
                <Text style={styles.bold}>Party B (KOL) Share:</Text>{" "}
                <Text style={styles.bold}>{financial.profit_split_kol_percent ?? 0}%</Text>
              </Text>
            </View>
          </View>
        );

      case "AFFILIATE":
        return (
          <View>
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Payment Model:</Text>{" "}
              <Text style={styles.bold}>{financial.model || "N/A"}</Text>
            </Text>
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Payment Cycle:</Text> {financial.payment_cycle || "N/A"} (on
              the <Text style={styles.bold}>{financial.payment_date || "N/A"}th</Text> of each
              cycle)
            </Text>
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Base Per Click Rate:</Text>{" "}
              <Text style={styles.bold}>{formatMoney(financial.base_per_click)}</Text>
            </Text>
            {(financial.levels ?? []).length > 0 && (
              <View>
                <Text style={styles.subHeading}>Performance Levels (Tiered Payout):</Text>
                {(financial.levels ?? []).map((level: any, i: number) => (
                  <Text key={i} style={styles.listItem}>
                    • <Text style={styles.bold}>Level {level.level}</Text>: Up to {level.max_clicks}{" "}
                    clicks, Multiplier: <Text style={styles.bold}>{level.multiplier}x</Text>
                  </Text>
                ))}
              </View>
            )}
            {financial.tax_withholding && (
              <View>
                <Text style={styles.subHeading}>Tax Withholding:</Text>
                <Text style={styles.textBlock}>
                  A tax rate of{" "}
                  <Text style={styles.bold}>{financial.tax_withholding.rate_percent}%</Text> will be
                  withheld for earnings exceeding{" "}
                  <Text style={styles.bold}>
                    {formatMoney(financial.tax_withholding.threshold)}
                  </Text>
                  .
                </Text>
              </View>
            )}
          </View>
        );

      case "BRAND_AMBASSADOR":
      case "ADVERTISING":
      default:
        return (
          <View>
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Payment Model:</Text>{" "}
              <Text style={styles.bold}>{financial.model || "N/A"}</Text>
            </Text>
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Payment Method:</Text>{" "}
              {(financial.payment_method || "").toString().replace(/_/g, " ")}
            </Text>
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Total Contract Value:</Text>{" "}
              <Text style={styles.financialHighlight}>{formatMoney(financial.total_cost)}</Text>
            </Text>
            {financial.cost_breakdown && (
              <View>
                <Text style={styles.subHeading}>Cost Breakdown:</Text>
                {Object.entries(financial.cost_breakdown || {}).map(
                  ([key, value]: [string, any], i: number) => (
                    <Text key={i} style={styles.listItem}>
                      • <Text style={styles.bold}>{key.replace(/_/g, " ")}</Text>:{" "}
                      {formatMoney(value)}
                    </Text>
                  ),
                )}
              </View>
            )}
            {(financial.schedule ?? []).length > 0 && (
              <View>
                <Text style={styles.subHeading}>Payment Schedule Milestones:</Text>
                {(financial.schedule ?? []).map((item: any, i: number) => (
                  <Text key={i} style={styles.listItem}>
                    {i + 1}. <Text style={styles.bold}>{item.milestone}</Text>:{" "}
                    <Text style={styles.bold}>{formatMoney(item.amount)}</Text> ({item.percent}%)
                    due by <Text style={styles.bold}>{formatDate(item.due_date)}</Text>
                  </Text>
                ))}
              </View>
            )}
          </View>
        );
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/pink.png" />
          <Text style={styles.title}>Contract Agreement</Text>
          <Text style={styles.subtitle}>
            <Text style={styles.bold}>{(data.type || "").toString().replace(/_/g, " ")}</Text>{" "}
            Service Contract | Contract No. <Text style={styles.bold}>{data.contract_number}</Text>
          </Text>
          <Text style={styles.contractTitle}>{data.title}</Text>
        </View>

        {/* Article 1: Parties */}
        <View>
          <Text style={styles.sectionHeader}>ARTICLE 1: PARTIES INVOLVED</Text>
          <Text style={styles.textBlock}>
            This Agreement is hereby executed on{" "}
            <Text style={styles.bold}>{formatDate(data.signed_date)}</Text> at{" "}
            <Text style={styles.bold}>{data.signed_location || "N/A"}</Text>, effective from the{" "}
            <Text style={styles.bold}>{formatDate(data.start_date)}</Text> until{" "}
            <Text style={styles.bold}>{formatDate(data.end_date)}</Text>, by and between:
          </Text>

          <Text style={styles.sectionTitle}>Party A (The Brand/Company)</Text>
          <Text style={styles.textBlock}>
            <Text style={styles.bold}>Company Name:</Text> {data.brand?.name || "N/A"}
          </Text>
          <Text style={styles.textBlock}>
            <Text style={styles.bold}>Representative:</Text>{" "}
            {data.brand?.representative_name || data.brand?.contact_name || "N/A"},{" "}
            {data.brand?.representative_role || "N/A"}
          </Text>
          <Text style={styles.textBlock}>
            <Text style={styles.bold}>Address:</Text> {data.brand?.address || "N/A"}
          </Text>
          <Text style={styles.textBlock}>
            <Text style={styles.bold}>Tax ID:</Text> {data.brand?.tax_number || "N/A"}
          </Text>
          <Text style={styles.textBlock}>
            <Text style={styles.bold}>Bank Account:</Text>{" "}
            {data.brand?.bank_account_number || "N/A"} ({data.brand?.bank_account_holder || "N/A"} -{" "}
            {data.brand?.bank_name || "N/A"})
          </Text>

          <Text style={styles.sectionTitle}>Party B (The Service Provider/KOL)</Text>
          <Text style={styles.textBlock}>
            <Text style={styles.bold}>Name:</Text> {data.representative_name || "N/A"}
          </Text>
          <Text style={styles.textBlock}>
            <Text style={styles.bold}>Role/Title:</Text> {data.representative_role || "N/A"}
          </Text>
          <Text style={styles.textBlock}>
            <Text style={styles.bold}>Tax ID:</Text> {data.representative_tax_number || "N/A"}
          </Text>
          <Text style={styles.textBlock}>
            <Text style={styles.bold}>Bank Account:</Text>{" "}
            {data.representative_bank_account_number || "N/A"} (
            {data.representative_bank_account_holder || "N/A"} -{" "}
            {data.representative_bank_name || "N/A"})
          </Text>
        </View>

        {/* Article 2: Scope of Work */}
        <View>
          <Text style={styles.sectionHeader}>ARTICLE 2: SCOPE OF WORK AND DELIVERABLES</Text>
          {renderScopeOfWork()}
          {(data.scope_of_work?.general_requirements ?? []).length > 0 && (
            <View>
              <Text style={styles.subHeading}>General Obligations of Party B:</Text>
              {(data.scope_of_work?.general_requirements ?? []).map((r: string, i: number) => (
                <Text key={i} style={styles.listItem}>
                  • {r}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Article 3: Financial Terms */}
        <View>
          <Text style={styles.sectionHeader}>ARTICLE 3: FINANCIAL TERMS AND PAYMENT</Text>
          {data.deposit_amount && (
            <Text style={styles.textBlock}>
              <Text style={styles.bold}>Security Deposit:</Text> A deposit of{" "}
              <Text style={styles.bold}>{formatMoney(data.deposit_amount)}</Text> (representing{" "}
              <Text style={styles.bold}>{data.deposit_percent ?? "N/A"}%</Text> of the total) shall
              be paid by Party A upon execution of this contract.
            </Text>
          )}
          {renderFinancialTerms()}
        </View>

        {/* Article 4: Breach and Termination */}
        <View>
          <Text style={styles.sectionHeader}>ARTICLE 4: BREACH AND TERMINATION</Text>
          <Text style={styles.sectionTitle}>Penalties for Breach of Contract:</Text>
          {(data.legal_terms?.breach_of_contract?.items ?? []).map((item: any, i: number) => (
            <View key={i} style={styles.penaltySection}>
              <Text style={styles.penaltyTitle}>{item.title}</Text>
              {(item.details ?? []).map((d: string, j: number) => (
                <Text key={j} style={styles.listItem}>
                  • {d}
                </Text>
              ))}
            </View>
          ))}
        </View>

        {/* Article 5: Standard Legal Terms */}
        <View>
          <Text style={styles.sectionHeader}>ARTICLE 5: STANDARD LEGAL TERMS</Text>
          {(data.legal_terms?.standard_terms?.items ?? []).map((term: any, i: number) => (
            <View key={i} style={{ marginBottom: 6 }}>
              <Text style={[styles.textBlock, styles.bold, { textDecoration: "underline" }]}>
                {i + 1}. {term.title}:
              </Text>
              <Text style={[styles.textBlock, { marginLeft: 10 }]}>{term.description}</Text>
            </View>
          ))}
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <Text
            style={[
              styles.textBlock,
              styles.bold,
              { textAlign: "center", fontSize: 12, marginBottom: 15 },
            ]}
          >
            IN WITNESS WHEREOF, the Parties have executed this Agreement on the date first written
            above.
          </Text>
          <View style={styles.signatureGrid}>
            <View style={styles.signatureColumn}>
              <Text style={[styles.textBlock, styles.bold]}>
                For and on behalf of Party A (The Brand)
              </Text>
              <Text style={styles.signatureName}>{data.brand?.representative_name || "N/A"}</Text>
              <Text style={styles.signatureRole}>{data.brand?.representative_role || "N/A"}</Text>
            </View>
            <View style={styles.signatureColumn}>
              <Text style={[styles.textBlock, styles.bold]}>
                For and on behalf of Party B (The Service Provider)
              </Text>
              <Text style={styles.signatureName}>{data.representative_name || "N/A"}</Text>
              <Text style={styles.signatureRole}>{data.representative_role || "N/A"}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Main Component
export const ContractPreview = ({ contractData }: { contractData: any }) => {
  if (!contractData) return null;
  const data = contractData.data ?? contractData;
  if (!data) return null;

  return (
    <div className="bg-gray-100 py-10 px-4 min-h-screen">
      {/* Download Button */}
      <div className="flex justify-center mb-4 sticky top-4 z-10">
        <PDFDownloadLink
          document={<ContractPDF data={data} />}
          fileName={`${data.title || "contract"}.pdf`}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-xl hover:bg-red-700 transition duration-150 ease-in-out font-semibold text-lg no-underline"
        >
          {({ loading }) => (loading ? "⏳ Generating PDF..." : "⬇️ Download Contract PDF")}
        </PDFDownloadLink>
      </div>

      {/* Preview Section - keeping the existing HTML for browser preview */}
      <div className="bg-white text-gray-900 max-w-4xl mx-auto p-12 shadow-2xl leading-relaxed min-h-[1100px]">
        {/* Contract Header & Title */}
        <header className="text-center mb-10 border-b border-gray-400 pb-4">
          <div className="flex justify-center mb-4">
            <img src="/pink.png" alt="Platform Logo" className="h-36 w-auto object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 uppercase tracking-widest">
            Contract Agreement
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            <span className="font-semibold">{(data.type || "").toString().replace(/_/g, " ")}</span>{" "}
            Service Contract | Contract No.{" "}
            <span className="font-semibold">{data.contract_number}</span>
          </p>
          <p className="text-xl font-bold mt-4 text-gray-800 italic">{data.title}</p>
        </header>

        <div className="text-center text-gray-600 mt-8">
          <p className="text-lg font-semibold">📄 Contract Preview</p>
          <p className="text-sm">
            Click "Download Contract PDF" above to generate the full PDF document
          </p>
        </div>
      </div>
    </div>
  );
};
