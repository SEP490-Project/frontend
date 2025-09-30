import * as yup from "yup";

const contractSchema = yup.object({
  // Basic fields
  brandId: yup.string().required("Brand selection is required"),
  contractNumber: yup.string().required("Contract number is required"),
  type: yup.string().required("Contract type is required"),
  signedLocation: yup.string().required("Signed location is required"),

  // Date validations
  startDate: yup.date().required("Start date is required"),

  endDate: yup
    .date()
    .required("End date is required")
    .min(yup.ref("startDate"), "End date must be after start date")
    .test("not-today", "End date cannot be today", function (value) {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(value);
      endDate.setHours(0, 0, 0, 0);
      return endDate.getTime() !== today.getTime();
    }),

  signedDate: yup
    .date()
    .nullable()
    .test(
      "signed-date-validation",
      "Signed date cannot be between start and end date, or after end date",
      function (value) {
        if (!value) return true;
        const { startDate, endDate } = this.parent;
        if (!startDate || !endDate) return true;

        const signed = new Date(value);
        const start = new Date(startDate);
        const end = new Date(endDate);

        signed.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // Cannot be between start and end date (inclusive)
        if (signed >= start && signed <= end) return false;
        // Cannot be after end date
        if (signed > end) return false;

        return true;
      },
    ),

  // Representative fields
  brandRepresentativeName: yup.string().required("Brand representative name is required"),
  webRepresentativeName: yup.string().required("Web representative name is required"),

  // Scope of work
  scopeOfWork: yup.object({
    description: yup.string().required("Project description is required"),
  }),

  // Financial terms based on contract type
  financialTerms: yup
    .object()
    .when("type", {
      is: (type: string) => ["ADVERTISING", "BRAND_AMBASSADOR"].includes(type),
      then: (schema) =>
        schema.shape({
          paymentMethod: yup.string().required("Payment method is required"),
          totalCost: yup
            .number()
            .min(1, "Total cost must be greater than 0")
            .required("Total cost is required"),
        }),
    })
    .when("type", {
      is: "AFFILIATE",
      then: (schema) =>
        schema.shape({
          basePerClick: yup
            .number()
            .min(1, "Base per click must be greater than 0")
            .required("Base per click is required"),
          paymentCycle: yup.string().required("Payment cycle is required"),
        }),
    })
    .when("type", {
      is: "CO_PRODUCING",
      then: (schema) =>
        schema.shape({
          profitSplitCompanyPercent: yup
            .number()
            .min(0, "Company profit share must be at least 0%")
            .max(100, "Company profit share cannot exceed 100%")
            .required("Company profit share is required"),
          profitSplitKolPercent: yup
            .number()
            .min(0, "KOL profit share must be at least 0%")
            .max(100, "KOL profit share cannot exceed 100%")
            .required("KOL profit share is required")
            .test("total-100", "Total profit share must equal 100%", function (value) {
              const companyPercent = this.parent.profitSplitCompanyPercent || 0;
              return companyPercent + (value || 0) === 100;
            }),
        }),
    }),
});

// Real-time field validation
export const validateField = async (fieldPath: string, value: any, formData: any) => {
  try {
    const fieldSchema = yup.reach(contractSchema, fieldPath);
    if ("validate" in fieldSchema && typeof fieldSchema.validate === "function") {
      await fieldSchema.validate(value, { context: formData });
    } else {
      // If it's a Reference, skip validation or handle as needed
      return { isValid: true, error: null };
    }
    return { isValid: true, error: null };
  } catch (error: any) {
    return { isValid: false, error: error.message };
  }
};

// Validate entire form
export const validateContract = async (formData: any) => {
  try {
    await contractSchema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error: any) {
    const errors: any = {};
    error.inner?.forEach((err: any) => {
      if (err.path) {
        // Handle nested paths like 'financialTerms.totalCost'
        const pathParts = err.path.split(".");
        if (pathParts.length === 1) {
          errors[pathParts[0]] = err.message;
        } else {
          if (!errors[pathParts[0]]) errors[pathParts[0]] = {};
          errors[pathParts[0]][pathParts[1]] = err.message;
        }
      }
    });
    return { isValid: false, errors };
  }
};
