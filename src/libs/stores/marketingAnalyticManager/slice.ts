import { createSlice } from "@reduxjs/toolkit";
import {
  marketingDashboard,
  marketingActiveBrand,
  marketingActiveCampaign,
  marketingDraftCampaign,
  marketingMonthlyRevenue,
  marketingRevenueType,
  marketingTopBrand,
  marketingUpcomingDeadline,
  marketingContractStatusDistribution,
  marketingTaskStatusDistribution,
  marketingRevenueOverTime,
  marketingRefundViolationStats,
  marketingGrossRevenue,
  marketingNetRevenue,
  marketingContractRevenueBreakdown,
} from "./thunk";

interface stateType {
  loading: boolean;
  loadingKPI: boolean;
  loadingRevenue: boolean;
  loadingTopBrands: boolean;
  loadingDeadlines: boolean;
  loadingContractStatus: boolean;
  loadingTaskStatus: boolean;
  loadingRevenueOverTime: boolean;
  loadingRefundViolation: boolean;
  loadingGrossRevenue: boolean;
  loadingNetRevenue: boolean;
  loadingContractRevenueBreakdown: boolean;
  dashboard: any;
  activeBrands: any;
  activeCampaigns: any;
  draftCampaigns: any;
  monthlyRevenue: any;
  revenueByType: any;
  topBrands: any;
  upcomingDeadlines: any;
  contractStatusDistribution: any;
  taskStatusDistribution: any;
  revenueOverTime: any;
  refundViolationStats: any;
  grossRevenue: any;
  netRevenue: any;
  contractRevenueBreakdown: any;
  // Global Filter State
  selectedPeriod: string;
  customStartDate: string | null;
  customEndDate: string | null;
  trendGranularity: string;
}

const initialState: stateType = {
  loading: false,
  loadingKPI: false,
  loadingRevenue: false,
  loadingTopBrands: false,
  loadingDeadlines: false,
  loadingContractStatus: false,
  loadingTaskStatus: false,
  loadingRevenueOverTime: false,
  loadingRefundViolation: false,
  loadingGrossRevenue: false,
  loadingNetRevenue: false,
  loadingContractRevenueBreakdown: false,
  dashboard: [],
  activeBrands: null,
  activeCampaigns: null,
  draftCampaigns: null,
  monthlyRevenue: null,
  revenueByType: null,
  topBrands: null,
  upcomingDeadlines: null,
  contractStatusDistribution: null,
  taskStatusDistribution: null,
  revenueOverTime: null,
  refundViolationStats: null,
  grossRevenue: null,
  netRevenue: null,
  contractRevenueBreakdown: null,
  // Global Filter Defaults
  selectedPeriod: "THIS_MONTH",
  customStartDate: null,
  customEndDate: null,
  trendGranularity: "DAY",
};

export const manageMarketingAnalyticSlice = createSlice({
  name: "manageMarketingAnalytic",
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
    setCustomDateRange: (state, action) => {
      state.customStartDate = action.payload.startDate;
      state.customEndDate = action.payload.endDate;
    },
    setTrendGranularity: (state, action) => {
      state.trendGranularity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(marketingDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(marketingDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data;
      })
      .addCase(marketingDashboard.rejected, (state) => {
        state.loading = false;
      })

      .addCase(marketingActiveBrand.pending, (state) => {
        state.loadingKPI = true;
      })
      .addCase(marketingActiveBrand.fulfilled, (state, action) => {
        state.loadingKPI = false;
        state.activeBrands = action.payload.data;
      })
      .addCase(marketingActiveBrand.rejected, (state) => {
        state.loadingKPI = false;
      })

      .addCase(marketingActiveCampaign.pending, (state) => {
        state.loadingKPI = true;
      })
      .addCase(marketingActiveCampaign.fulfilled, (state, action) => {
        state.loadingKPI = false;
        state.activeCampaigns = action.payload.data;
      })
      .addCase(marketingActiveCampaign.rejected, (state) => {
        state.loadingKPI = false;
      })

      .addCase(marketingDraftCampaign.pending, (state) => {
        state.loadingKPI = true;
      })
      .addCase(marketingDraftCampaign.fulfilled, (state, action) => {
        state.loadingKPI = false;
        state.draftCampaigns = action.payload.data;
      })
      .addCase(marketingDraftCampaign.rejected, (state) => {
        state.loadingKPI = false;
      })

      .addCase(marketingMonthlyRevenue.pending, (state) => {
        state.loadingKPI = true;
      })
      .addCase(marketingMonthlyRevenue.fulfilled, (state, action) => {
        state.loadingKPI = false;
        state.monthlyRevenue = action.payload.data;
      })
      .addCase(marketingMonthlyRevenue.rejected, (state) => {
        state.loadingKPI = false;
      })

      .addCase(marketingRevenueType.pending, (state) => {
        state.loadingRevenue = true;
      })
      .addCase(marketingRevenueType.fulfilled, (state, action) => {
        state.loadingRevenue = false;
        state.revenueByType = action.payload.data;
      })
      .addCase(marketingRevenueType.rejected, (state) => {
        state.loadingRevenue = false;
      })

      .addCase(marketingTopBrand.pending, (state) => {
        state.loadingTopBrands = true;
      })
      .addCase(marketingTopBrand.fulfilled, (state, action) => {
        state.loadingTopBrands = false;
        state.topBrands = action.payload.data;
      })
      .addCase(marketingTopBrand.rejected, (state) => {
        state.loadingTopBrands = false;
      })

      .addCase(marketingUpcomingDeadline.pending, (state) => {
        state.loadingDeadlines = true;
      })
      .addCase(marketingUpcomingDeadline.fulfilled, (state, action) => {
        state.loadingDeadlines = false;
        state.upcomingDeadlines = action.payload.data;
      })
      .addCase(marketingUpcomingDeadline.rejected, (state) => {
        state.loadingDeadlines = false;
      })

      // New dashboard refactor reducers
      .addCase(marketingContractStatusDistribution.pending, (state) => {
        state.loadingContractStatus = true;
      })
      .addCase(marketingContractStatusDistribution.fulfilled, (state, action) => {
        state.loadingContractStatus = false;
        state.contractStatusDistribution = action.payload.data;
      })
      .addCase(marketingContractStatusDistribution.rejected, (state) => {
        state.loadingContractStatus = false;
      })

      .addCase(marketingTaskStatusDistribution.pending, (state) => {
        state.loadingTaskStatus = true;
      })
      .addCase(marketingTaskStatusDistribution.fulfilled, (state, action) => {
        state.loadingTaskStatus = false;
        state.taskStatusDistribution = action.payload.data;
      })
      .addCase(marketingTaskStatusDistribution.rejected, (state) => {
        state.loadingTaskStatus = false;
      })

      .addCase(marketingRevenueOverTime.pending, (state) => {
        state.loadingRevenueOverTime = true;
      })
      .addCase(marketingRevenueOverTime.fulfilled, (state, action) => {
        state.loadingRevenueOverTime = false;
        state.revenueOverTime = action.payload.data;
      })
      .addCase(marketingRevenueOverTime.rejected, (state) => {
        state.loadingRevenueOverTime = false;
      })

      .addCase(marketingRefundViolationStats.pending, (state) => {
        state.loadingRefundViolation = true;
      })
      .addCase(marketingRefundViolationStats.fulfilled, (state, action) => {
        state.loadingRefundViolation = false;
        state.refundViolationStats = action.payload.data;
      })
      .addCase(marketingRefundViolationStats.rejected, (state) => {
        state.loadingRefundViolation = false;
      })

      // Gross Revenue
      .addCase(marketingGrossRevenue.pending, (state) => {
        state.loadingGrossRevenue = true;
      })
      .addCase(marketingGrossRevenue.fulfilled, (state, action) => {
        state.loadingGrossRevenue = false;
        state.grossRevenue = action.payload.data;
      })
      .addCase(marketingGrossRevenue.rejected, (state) => {
        state.loadingGrossRevenue = false;
      })

      // Net Revenue
      .addCase(marketingNetRevenue.pending, (state) => {
        state.loadingNetRevenue = true;
      })
      .addCase(marketingNetRevenue.fulfilled, (state, action) => {
        state.loadingNetRevenue = false;
        state.netRevenue = action.payload.data;
      })
      .addCase(marketingNetRevenue.rejected, (state) => {
        state.loadingNetRevenue = false;
      })

      // Contract Revenue Breakdown
      .addCase(marketingContractRevenueBreakdown.pending, (state) => {
        state.loadingContractRevenueBreakdown = true;
      })
      .addCase(marketingContractRevenueBreakdown.fulfilled, (state, action) => {
        state.loadingContractRevenueBreakdown = false;
        state.contractRevenueBreakdown = action.payload.data;
      })
      .addCase(marketingContractRevenueBreakdown.rejected, (state) => {
        state.loadingContractRevenueBreakdown = false;
      });
  },
});

export const { setPeriod, setCustomDateRange, setTrendGranularity } =
  manageMarketingAnalyticSlice.actions;

export const { reducer: manageMarketingAnalyticReducer, actions: manageMarketingAnalyticActions } =
  manageMarketingAnalyticSlice;
