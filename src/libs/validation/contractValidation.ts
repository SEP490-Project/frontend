import * as yup from "yup";

const contractSchema = yup.object({
  // Basic fields
  brandId: yup.string().required("Please select a brand"),
  contractNumber: yup.string().required("Please enter a contract number"),
  type: yup.string().required("Please select a contract type"),
  signedLocation: yup.string().required("Please enter the signing location"),

  // Date validations - use string format for dates from inputs
  startDate: yup
    .string()
    .required("Please select a start date")
    .test("is-valid-date", "Please enter a valid start date", function (value) {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),

  endDate: yup
    .string()
    .required("Please select an end date")
    .test("is-valid-date", "Please enter a valid end date", function (value) {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test("after-start", "End date must be after the start date", function (value) {
      if (!value) return true;

      // Handle both this.parent and this.options.context for different validation contexts
      const parentData = this.parent || this.options?.context || {};
      const startDate = parentData.startDate;

      if (!startDate) return true;

      const endDate = new Date(value);
      const startDateObj = new Date(startDate);
      return endDate > startDateObj;
    })
    .test("not-today", "End date cannot be today's date", function (value) {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(value);
      endDate.setHours(0, 0, 0, 0);
      return endDate.getTime() !== today.getTime();
    }),

  signedDate: yup
    .string()
    .nullable()
    .test("is-valid-date", "Please enter a valid signed date", function (value) {
      if (!value) return true; // nullable field
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test(
      "signed-date-validation",
      "Signed date must be before the contract start date",
      function (value) {
        if (!value) return true;

        // Handle both this.parent and this.options.context for different validation contexts
        const parentData = this.parent || this.options?.context || {};
        const { startDate, endDate } = parentData;

        if (!startDate || !endDate) return true;

        const signed = new Date(value);
        const start = new Date(startDate);
        const end = new Date(endDate);

        signed.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // Cannot be between start and end date (inclusive)
        if (signed >= start && signed <= end) {
          return this.createError({
            message: "Signed date cannot be during the contract period",
          });
        }
        // Cannot be after end date
        if (signed > end) {
          return this.createError({
            message: "Signed date cannot be after the contract ends",
          });
        }

        return true;
      },
    ),

  // Representative fields
  brandRepresentativeName: yup.string().required("Please enter the brand representative's name"),
  webRepresentativeName: yup.string().required("Please enter the web representative's name"),

  // Scope of work
  scopeOfWork: yup.object({
    description: yup.string().required("Please provide a project description"),
  }),

  // Financial terms based on contract type
  financialTerms: yup
    .object()
    .when("type", {
      is: (type: string) => ["ADVERTISING", "BRAND_AMBASSADOR"].includes(type),
      then: (schema) =>
        schema.shape({
          paymentMethod: yup.string().required("Please select a payment method"),
          totalCost: yup
            .number()
            .typeError("Please enter a valid amount")
            .min(1, "Total cost must be greater than $0")
            .required("Please enter the total cost"),
        }),
    })
    .when("type", {
      is: "AFFILIATE",
      then: (schema) =>
        schema.shape({
          basePerClick: yup
            .number()
            .typeError("Please enter a valid amount")
            .min(0.01, "Base per click must be at least $0.01")
            .required("Please enter the base per click amount"),
          paymentCycle: yup.string().required("Please select a payment cycle"),
        }),
    })
    .when("type", {
      is: "CO_PRODUCING",
      then: (schema) =>
        schema.shape({
          profitSplitCompanyPercent: yup
            .number()
            .typeError("Please enter a valid percentage")
            .min(0, "Company profit share cannot be negative")
            .max(100, "Company profit share cannot exceed 100%")
            .required("Please enter the company's profit share percentage"),
          profitSplitKolPercent: yup
            .number()
            .typeError("Please enter a valid percentage")
            .min(0, "KOL profit share cannot be negative")
            .max(100, "KOL profit share cannot exceed 100%")
            .required("Please enter the KOL's profit share percentage")
            .test(
              "total-100",
              "The total profit share must equal 100%. Please adjust the percentages.",
              function (value) {
                const parentData = this.parent || {};
                const companyPercent = parentData.profitSplitCompanyPercent || 0;
                return companyPercent + (value || 0) === 100;
              },
            ),
        }),
    }),
});

// Real-time field validation
export const validateField = async (fieldPath: string, value: any, formData: any) => {
  try {
    const fieldSchema = yup.reach(contractSchema, fieldPath);
    if ("validate" in fieldSchema && typeof fieldSchema.validate === "function") {
      // Pass formData as context to make it available in validation tests
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
