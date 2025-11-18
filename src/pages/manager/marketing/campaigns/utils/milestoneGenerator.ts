import { format } from "date-fns";

export interface GeneratedMilestone {
  id: string;
  description: string;
  due_date: string;
  tasks: any[];
}

// Helper function to normalize date to 00:00:00.000
const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Generate milestones from contract payment schedule
export const generateMilestonesFromContract = (
  contractData: any,
  campaignStartDate: string,
  campaignEndDate: string,
): GeneratedMilestone[] => {
  if (!contractData?.financial_terms) return [];

  const start = normalizeDate(new Date(campaignStartDate));
  const end = normalizeDate(new Date(campaignEndDate));
  const milestones: GeneratedMilestone[] = [];

  const { financial_terms } = contractData;

  // For CO_PRODUCING
  if (contractData.type === "CO_PRODUCING" && financial_terms.profit_distribution_cycle) {
    const cycle = financial_terms.profit_distribution_cycle;
    const dateValue = financial_terms.profit_distribution_date;

    const dates = generatePaymentDates(cycle, dateValue, start, end);

    dates.forEach((date, index) => {
      const isLastPayment = index === dates.length - 1 && date.getTime() === end.getTime();
      milestones.push({
        id: `milestone-${Date.now()}-${index}`,
        description: isLastPayment
          ? "Final Profit Distribution"
          : `Profit Distribution ${index + 1}`,
        due_date: format(date, "yyyy-MM-dd"),
        tasks: [],
      });
    });
  }

  // For AFFILIATE
  if (contractData.type === "AFFILIATE" && financial_terms.payment_cycle) {
    const cycle = financial_terms.payment_cycle;
    const dateValue = financial_terms.payment_date;

    const dates = generatePaymentDates(cycle, dateValue, start, end);

    dates.forEach((date, index) => {
      const isLastPayment = index === dates.length - 1 && date.getTime() === end.getTime();
      milestones.push({
        id: `milestone-${Date.now()}-${index}`,
        description: isLastPayment ? "Final Commission Payment" : `Commission Payment ${index + 1}`,
        due_date: format(date, "yyyy-MM-dd"),
        tasks: [],
      });
    });
  }

  return milestones;
};

// Generate payment dates based on cycle and value (similar to PaymentDateSelector logic)
const generatePaymentDates = (
  cycle: "MONTHLY" | "QUARTERLY" | "ANNUALLY",
  value: any,
  start: Date,
  end: Date,
): Date[] => {
  const dates: Date[] = [];

  if (cycle === "MONTHLY" && typeof value === "string") {
    const day = parseInt(value, 10);

    let current = normalizeDate(new Date(start.getFullYear(), start.getMonth(), 1));
    const firstPaymentDay = Math.min(
      day,
      new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate(),
    );
    let firstPaymentDate = normalizeDate(
      new Date(current.getFullYear(), current.getMonth(), firstPaymentDay),
    );

    if (firstPaymentDate < start) {
      firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
      firstPaymentDate = normalizeDate(firstPaymentDate);
    }

    current = firstPaymentDate;

    if (current > end) return dates;

    while (current <= end) {
      dates.push(new Date(current));

      let nextMonth = current.getMonth() + 1;
      let nextYear = current.getFullYear();
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
      }

      const maxDayInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
      const actualDayForNextMonth = Math.min(day, maxDayInNextMonth);

      current = normalizeDate(new Date(nextYear, nextMonth, actualDayForNextMonth));
    }
  }

  if (cycle === "QUARTERLY" && Array.isArray(value)) {
    // For QUARTERLY, value is already an array of objects with {id, day, month, year}
    value.forEach((item) => {
      const date = normalizeDate(new Date(item.year, item.month - 1, item.day));
      if (date >= start && date <= end) {
        dates.push(date);
      }
    });
  } else if (cycle === "QUARTERLY" && typeof value === "string") {
    // Handle string format for QUARTERLY (from selector)
    try {
      const { day: selectedDay, month: selectedMonth1Indexed } = JSON.parse(value);

      let currentYear = start.getFullYear();
      let currentMonth0Indexed = selectedMonth1Indexed - 1;

      let firstPaymentDateCandidate: Date;
      do {
        const tempDate = new Date(currentYear, currentMonth0Indexed, 1);
        const maxDayInCurrentMonth = new Date(
          tempDate.getFullYear(),
          tempDate.getMonth() + 1,
          0,
        ).getDate();
        const actualDay = Math.min(selectedDay, maxDayInCurrentMonth);
        firstPaymentDateCandidate = normalizeDate(
          new Date(currentYear, currentMonth0Indexed, actualDay),
        );

        if (firstPaymentDateCandidate < start) {
          currentMonth0Indexed += 3;
          if (currentMonth0Indexed > 11) {
            currentMonth0Indexed -= 12;
            currentYear++;
          }
        }
      } while (firstPaymentDateCandidate < start);

      if (firstPaymentDateCandidate <= end) {
        dates.push(firstPaymentDateCandidate);
        let currentQuarterDate = new Date(firstPaymentDateCandidate);

        while (true) {
          let nextPaymentMonth = currentQuarterDate.getMonth() + 3;
          let nextPaymentYear = currentQuarterDate.getFullYear();

          if (nextPaymentMonth > 11) {
            nextPaymentMonth -= 12;
            nextPaymentYear++;
          }

          const tempNextDate = new Date(nextPaymentYear, nextPaymentMonth, 1);
          const maxDayInNextQuarterMonth = new Date(
            tempNextDate.getFullYear(),
            tempNextDate.getMonth() + 1,
            0,
          ).getDate();
          const actualDayForNextQuarter = Math.min(selectedDay, maxDayInNextQuarterMonth);

          currentQuarterDate = normalizeDate(
            new Date(nextPaymentYear, nextPaymentMonth, actualDayForNextQuarter),
          );

          if (currentQuarterDate > end) break;
          dates.push(new Date(currentQuarterDate));
        }
      }
    } catch (e) {
      console.error("Error parsing quarterly value:", e);
    }
  }

  if (cycle === "ANNUALLY" && typeof value === "string") {
    const selectedDateFromValue = normalizeDate(new Date(value));
    const selectedMonth = selectedDateFromValue.getMonth();
    const selectedDay = selectedDateFromValue.getDate();

    const startYear = start.getFullYear();
    const oneYearAfterStart = new Date(start);
    oneYearAfterStart.setFullYear(oneYearAfterStart.getFullYear() + 1);

    const maxFirstPayment = end < oneYearAfterStart ? end : oneYearAfterStart;

    let currentYear = selectedDateFromValue.getFullYear();
    let firstPossiblePaymentDate = normalizeDate(new Date(currentYear, selectedMonth, selectedDay));

    if (firstPossiblePaymentDate < start || firstPossiblePaymentDate > maxFirstPayment) {
      firstPossiblePaymentDate = normalizeDate(new Date(startYear, selectedMonth, selectedDay));
      if (firstPossiblePaymentDate < start) {
        firstPossiblePaymentDate = start;
      }
    }

    currentYear = firstPossiblePaymentDate.getFullYear();
    while (true) {
      const maxDayInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
      const actualDay = Math.min(selectedDay, maxDayInMonth);
      const annualDate = normalizeDate(new Date(currentYear, selectedMonth, actualDay));

      if (annualDate > end) break;
      if (annualDate >= start && !dates.some((d) => d.getTime() === annualDate.getTime())) {
        dates.push(new Date(annualDate));
      }
      currentYear++;
    }
  }

  // Add contract end date as final payment if not already included
  if (end >= start && !dates.some((d) => d.getTime() === end.getTime())) {
    dates.push(new Date(end));
  }

  // Sort dates
  dates.sort((a, b) => a.getTime() - b.getTime());

  return dates;
};
