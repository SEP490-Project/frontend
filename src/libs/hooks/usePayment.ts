import { useState, useCallback } from "react";
import { managePayment } from "@/libs/services/managePayment";
import type {
  ContractPayment,
  ContractPaymentProfile,
  ContractPaymentDetail,
  PaymentProfileParams,
  PaymentLinkRequest,
  PaymentLinkResponse,
  ApiResponse,
} from "@/libs/types/payment";

interface UsePaymentReturn {
  // Profile data
  payments: ContractPayment[];
  paymentProfile: ContractPaymentProfile | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null;
  loading: boolean;
  error: string | null;

  // Detail data
  paymentDetail: ContractPaymentDetail | null;
  detailLoading: boolean;
  detailError: string | null;

  // Payment link data
  paymentLink: PaymentLinkResponse | null;
  linkLoading: boolean;
  linkError: string | null;

  // Methods
  fetchPaymentsProfile: (params?: PaymentProfileParams) => Promise<void>;
  fetchPaymentDetail: (paymentId: string) => Promise<void>;
  generatePaymentLink: (
    paymentId: string,
    request: PaymentLinkRequest,
  ) => Promise<PaymentLinkResponse | null>;
  clearPaymentDetail: () => void;
  clearPaymentLink: () => void;
  refreshPayments: () => Promise<void>;
}

export const usePayment = (): UsePaymentReturn => {
  // Profile state
  const [payments, setPayments] = useState<ContractPayment[]>([]);
  const [paymentProfile, setPaymentProfile] = useState<ContractPaymentProfile | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detail state
  const [paymentDetail, setPaymentDetail] = useState<ContractPaymentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Payment link state
  const [paymentLink, setPaymentLink] = useState<PaymentLinkResponse | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const fetchPaymentsProfile = useCallback(
    async (params: PaymentProfileParams = { page: 1, limit: 10 }) => {
      try {
        setLoading(true);
        setError(null);

        const response = await managePayment.getContractPaymentsProfile(params);
        const profileResponse = response.data as {
          success: boolean;
          data: ContractPayment[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            total_pages: number;
            has_next: boolean;
            has_prev: boolean;
          };
        };

        if (profileResponse.success) {
          setPayments(profileResponse.data || []);
          setPagination(profileResponse.pagination);

          // Calculate payment profile from the data
          const totalPayments = profileResponse.data.length;
          const totalAmount = profileResponse.data.reduce(
            (sum, payment) => sum + payment.amount,
            0,
          );
          const paidAmount = profileResponse.data
            .filter((payment) => payment.status === "PAID")
            .reduce((sum, payment) => sum + payment.amount, 0);
          const pendingAmount = profileResponse.data
            .filter((payment) => payment.status === "PENDING")
            .reduce((sum, payment) => sum + payment.amount, 0);
          const overdueAmount = profileResponse.data
            .filter((payment) => payment.status === "OVERDUE")
            .reduce((sum, payment) => sum + payment.amount, 0);

          setPaymentProfile({
            total_payments: totalPayments,
            total_amount: totalAmount,
            paid_amount: paidAmount,
            pending_amount: pendingAmount,
            overdue_amount: overdueAmount,
            currency: "VND", // Default currency
            payments: profileResponse.data,
          });
        } else {
          setError("Failed to fetch payment profile");
        }
      } catch (err) {
        console.error("Error fetching payment profile:", err);
        setError("Failed to fetch payment profile");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchPaymentDetail = async (paymentId: string) => {
    try {
      setDetailLoading(true);
      setDetailError(null);

      const response = await managePayment.getContractPaymentById(paymentId);
      const detailResponse = response.data as ApiResponse<ContractPayment>;

      if (detailResponse.success) {
        // Map ContractPayment to ContractPaymentDetail structure for consistency
        const detail: ContractPaymentDetail = {
          ...detailResponse.data,
          payment_number: detailResponse.data.contract_number,
          currency: "VND",
          description: detailResponse.data.note,
          contract: {
            id: detailResponse.data.contract_id,
            title: detailResponse.data.contract_title,
            contract_number: detailResponse.data.contract_number,
            brand_name: detailResponse.data.brand_name,
          },
        };
        setPaymentDetail(detail);
      } else {
        setDetailError("Failed to fetch payment detail");
      }
    } catch (err) {
      console.error("Error fetching payment detail:", err);
      setDetailError("Failed to fetch payment detail");
    } finally {
      setDetailLoading(false);
    }
  };

  const generatePaymentLink = async (
    paymentId: string,
    request: PaymentLinkRequest,
  ): Promise<PaymentLinkResponse | null> => {
    try {
      setLinkLoading(true);
      setLinkError(null);

      const response = await managePayment.generatePaymentLink(paymentId, request);
      const linkResponse = response.data as ApiResponse<PaymentLinkResponse>;

      if (linkResponse.success) {
        setPaymentLink(linkResponse.data);
        return linkResponse.data;
      } else {
        setLinkError("Failed to generate payment link");
        return null;
      }
    } catch (err) {
      console.error("Error generating payment link:", err);
      setLinkError("Failed to generate payment link");
      throw err;
    } finally {
      setLinkLoading(false);
    }
  };

  const clearPaymentDetail = () => {
    setPaymentDetail(null);
    setDetailError(null);
  };

  const clearPaymentLink = () => {
    setPaymentLink(null);
    setLinkError(null);
  };

  const refreshPayments = async () => {
    await fetchPaymentsProfile();
  };

  return {
    // Profile data
    payments,
    paymentProfile,
    pagination,
    loading,
    error,

    // Detail data
    paymentDetail,
    detailLoading,
    detailError,

    // Payment link data
    paymentLink,
    linkLoading,
    linkError,

    // Methods
    fetchPaymentsProfile,
    fetchPaymentDetail,
    generatePaymentLink,
    clearPaymentDetail,
    clearPaymentLink,
    refreshPayments,
  };
};
