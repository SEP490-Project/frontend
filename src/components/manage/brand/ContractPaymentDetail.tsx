import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePayment } from "@/libs/hooks/usePayment";

const ContractPaymentDetail = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const { paymentDetail, detailLoading, detailError, fetchPaymentDetail, clearPaymentDetail } =
    usePayment();

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetail(paymentId);
    }

    return () => {
      clearPaymentDetail();
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, label: "Pending" },
      PAID: { variant: "default" as const, label: "Paid" },
      OVERDUE: { variant: "destructive" as const, label: "Overdue" },
      CANCELLED: { variant: "outline" as const, label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "outline" as const,
      label: status,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (detailLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (detailError || !paymentDetail) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Payment Detail</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Not Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {detailError || "The payment you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={handleBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Payment Detail</h1>
          <p className="text-muted-foreground">View and manage contract payment information</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Payment Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {paymentDetail.contract_number}
                </CardTitle>
                <CardDescription>{paymentDetail.contract_title}</CardDescription>
              </div>
              {getStatusBadge(paymentDetail.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Amount</span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(paymentDetail.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Installment</span>
                  <span className="text-sm">{paymentDetail.installment_percentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Payment Method</span>
                  <span className="text-sm">{paymentDetail.payment_method}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Due Date</span>
                  <span className="text-sm">{formatDate(paymentDetail.due_date)}</span>
                </div>
                {paymentDetail.paid_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Paid Date</span>
                    <span className="text-sm">{formatDate(paymentDetail.paid_date)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Created</span>
                  <span className="text-sm">{formatDateTime(paymentDetail.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Updated</span>
                  <span className="text-sm">{formatDateTime(paymentDetail.updated_at)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contract Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Contract Number</span>
                  <span className="text-sm font-semibold">{paymentDetail.contract_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Contract Title</span>
                  <span className="text-sm">{paymentDetail.contract_title}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Brand Name</span>
                  <span className="text-sm font-semibold">{paymentDetail.brand_name}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Notes */}
        {paymentDetail.note && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Payment Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{paymentDetail.note}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContractPaymentDetail;
