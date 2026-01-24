import { createSlice } from "@reduxjs/toolkit";
import {
  brandAffiliates,
  brandCampaigns,
  brandContent,
  brandContracts,
  brandRevenueTrend,
  brandTopProduct,
  brandTopRatingProducts,
  brandDashboard,
  brandContractStatusDistribution,
  brandTaskStatusDistribution,
  brandRevenueOverTime,
  brandRefundViolationStats,
  brandGrossIncome,
  brandNetIncome,
} from "./thunk";

interface stateType {
  loadingAffiliates: boolean;
  loadingCampaigns: boolean;
  loadingContent: boolean;
  loadingContracts: boolean;
  loadingRevenueTrend: boolean;
  loadingTopProducts: boolean;
  loadingTopRatingProducts: boolean;
  loadingDashboard: boolean;
  loadingContractStatus: boolean;
  loadingTaskStatus: boolean;
  loadingRevenueOverTime: boolean;
  loadingRefundViolation: boolean;
  loadingGrossIncome: boolean;
  loadingNetIncome: boolean;
  affiliates: any;
  campaigns: any;
  content: any;
  contracts: any;
  revenueTrend: any;
  topProducts: any;
  topRatingProducts: any;
  dashboard: any;
  contractStatusDistribution: any;
  taskStatusDistribution: any;
  revenueOverTime: any;
  refundViolationStats: any;
  grossIncome: any;
  netIncome: any;
  // Global Filter State
  selectedPeriod: string;
  customStartDate: string | null;
  customEndDate: string | null;
  trendGranularity: string;
}

const initialState: stateType = {
  loadingAffiliates: false,
  loadingCampaigns: false,
  loadingContent: false,
  loadingContracts: false,
  loadingRevenueTrend: false,
  loadingTopProducts: false,
  loadingTopRatingProducts: false,
  loadingDashboard: false,
  loadingContractStatus: false,
  loadingTaskStatus: false,
  loadingRevenueOverTime: false,
  loadingRefundViolation: false,
  loadingGrossIncome: false,
  loadingNetIncome: false,
  affiliates: null,
  campaigns: null,
  content: null,
  contracts: null,
  revenueTrend: null,
  topProducts: null,
  topRatingProducts: null,
  dashboard: null,
  contractStatusDistribution: null,
  taskStatusDistribution: null,
  revenueOverTime: null,
  refundViolationStats: null,
  grossIncome: null,
  netIncome: null,
  // Global Filter Defaults
  selectedPeriod: "THIS_YEAR",
  customStartDate: null,
  customEndDate: null,
  trendGranularity: "MONTH",
};

export const manageBrandAnalyticSlice = createSlice({
  name: "manageBrandAnalytic",
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
      .addCase(brandAffiliates.pending, (state) => {
        state.loadingAffiliates = true;
      })
      .addCase(brandAffiliates.fulfilled, (state, action) => {
        state.loadingAffiliates = false;
        state.affiliates = action.payload.data;
      })
      .addCase(brandAffiliates.rejected, (state) => {
        state.loadingAffiliates = false;
      })

      .addCase(brandCampaigns.pending, (state) => {
        state.loadingCampaigns = true;
      })
      .addCase(brandCampaigns.fulfilled, (state, action) => {
        state.loadingCampaigns = false;
        state.campaigns = action.payload.data;
      })
      .addCase(brandCampaigns.rejected, (state) => {
        state.loadingCampaigns = false;
      })

      .addCase(brandContent.pending, (state) => {
        state.loadingContent = true;
      })
      .addCase(brandContent.fulfilled, (state, action) => {
        state.loadingContent = false;
        state.content = action.payload.data;
      })
      .addCase(brandContent.rejected, (state) => {
        state.loadingContent = false;
      })

      .addCase(brandContracts.pending, (state) => {
        state.loadingContracts = true;
      })
      .addCase(brandContracts.fulfilled, (state, action) => {
        state.loadingContracts = false;
        state.contracts = action.payload.data;
      })
      .addCase(brandContracts.rejected, (state) => {
        state.loadingContracts = false;
      })

      .addCase(brandRevenueTrend.pending, (state) => {
        state.loadingRevenueTrend = true;
      })
      .addCase(brandRevenueTrend.fulfilled, (state, action) => {
        state.loadingRevenueTrend = false;
        state.revenueTrend = action.payload.data;
      })
      .addCase(brandRevenueTrend.rejected, (state) => {
        state.loadingRevenueTrend = false;
      })

      .addCase(brandTopProduct.pending, (state) => {
        state.loadingTopProducts = true;
      })
      .addCase(brandTopProduct.fulfilled, (state, action) => {
        state.loadingTopProducts = false;
        state.topProducts = action.payload.data;
      })
      .addCase(brandTopProduct.rejected, (state) => {
        state.loadingTopProducts = false;
      })

      .addCase(brandTopRatingProducts.pending, (state) => {
        state.loadingTopRatingProducts = true;
      })
      .addCase(brandTopRatingProducts.fulfilled, (state, action) => {
        state.loadingTopRatingProducts = false;
        state.topRatingProducts = action.payload.data;
      })
      .addCase(brandTopRatingProducts.rejected, (state) => {
        state.loadingTopRatingProducts = false;
      })

      .addCase(brandDashboard.pending, (state) => {
        state.loadingDashboard = true;
      })
      .addCase(brandDashboard.fulfilled, (state, action) => {
        state.loadingDashboard = false;
        state.dashboard = action.payload.data;
      })
      .addCase(brandDashboard.rejected, (state) => {
        state.loadingDashboard = false;
      })

      // New dashboard refactor reducers
      .addCase(brandContractStatusDistribution.pending, (state) => {
        state.loadingContractStatus = true;
      })
      .addCase(brandContractStatusDistribution.fulfilled, (state, action) => {
        state.loadingContractStatus = false;
        state.contractStatusDistribution = action.payload.data;
      })
      .addCase(brandContractStatusDistribution.rejected, (state) => {
        state.loadingContractStatus = false;
      })

      .addCase(brandTaskStatusDistribution.pending, (state) => {
        state.loadingTaskStatus = true;
      })
      .addCase(brandTaskStatusDistribution.fulfilled, (state, action) => {
        state.loadingTaskStatus = false;
        state.taskStatusDistribution = action.payload.data;
      })
      .addCase(brandTaskStatusDistribution.rejected, (state) => {
        state.loadingTaskStatus = false;
      })

      .addCase(brandRevenueOverTime.pending, (state) => {
        state.loadingRevenueOverTime = true;
      })
      .addCase(brandRevenueOverTime.fulfilled, (state, action) => {
        state.loadingRevenueOverTime = false;
        state.revenueOverTime = action.payload.data;
      })
      .addCase(brandRevenueOverTime.rejected, (state) => {
        state.loadingRevenueOverTime = false;
      })

      .addCase(brandRefundViolationStats.pending, (state) => {
        state.loadingRefundViolation = true;
      })
      .addCase(brandRefundViolationStats.fulfilled, (state, action) => {
        state.loadingRefundViolation = false;
        state.refundViolationStats = action.payload.data;
      })
      .addCase(brandRefundViolationStats.rejected, (state) => {
        state.loadingRefundViolation = false;
      })

      .addCase(brandGrossIncome.pending, (state) => {
        state.loadingGrossIncome = true;
      })
      .addCase(brandGrossIncome.fulfilled, (state, action) => {
        state.loadingGrossIncome = false;
        state.grossIncome = action.payload.data;
      })
      .addCase(brandGrossIncome.rejected, (state) => {
        state.loadingGrossIncome = false;
      })

      .addCase(brandNetIncome.pending, (state) => {
        state.loadingNetIncome = true;
      })
      .addCase(brandNetIncome.fulfilled, (state, action) => {
        state.loadingNetIncome = false;
        state.netIncome = action.payload.data;
      })
      .addCase(brandNetIncome.rejected, (state) => {
        state.loadingNetIncome = false;
      });
  },
});

export const { setPeriod, setCustomDateRange, setTrendGranularity } =
  manageBrandAnalyticSlice.actions;

export const { reducer: manageBrandAnalyticReducer, actions: manageBrandAnalyticActions } =
  manageBrandAnalyticSlice;
