import * as yup from "yup";

const contractSchema = yup.object({
  // Basic fields - snake_case
  brand_id: yup.string().required("Please select a brand"),
  // contract_number: yup.string().required("Please enter a contract number"),
  type: yup.string().required("Please select a contract type"),
  signed_location: yup.string().required("Please enter the signing location"),
  title: yup
    .string()
    .required("Contract title is required")
    .min(5, "Contract title must be at least 5 characters long")
    .max(200, "Contract title must not exceed 200 characters"),

  // Date validations - use string format for dates from inputs
  start_date: yup
    .string()
    .required("Please select a start date")
    .test("is-valid-date", "Please enter a valid start date", function (value) {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),

  end_date: yup
    .string()
    .required("Please select an end date")
    .test("is-valid-date", "Please enter a valid end date", function (value) {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test("after-start", "End date must be after the start date", function (value) {
      if (!value) return true;

      const parentData = this.parent || this.options?.context || {};
      const start_date = parentData.start_date;

      if (!start_date) return true;

      const endDate = new Date(value);
      const startDateObj = new Date(start_date);
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

  signed_date: yup
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

        const parentData = this.parent || this.options?.context || {};
        const { start_date, end_date } = parentData;

        if (!start_date || !end_date) return true;

        const signed = new Date(value);
        const start = new Date(start_date);
        const end = new Date(end_date);

        signed.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // Cannot be between start and end date (inclusive)
        if (signed > start && signed <= end) {
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

  // Representative fields - snake_case
  brand_representative_name: yup.string().required("Please enter the brand representative's name"),
  brand_representative_email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please enter the brand representative's email"),
  representative_name: yup.string().required("Please enter the web representative's name"),
  representative_email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please enter the web representative's email"),

  // Scope of work - snake_case
  scope_of_work: yup.object({
    description: yup.string().required("Please provide a project description"),
  }),

  // Financial terms based on contract type - snake_case
  financial_terms: yup
    .object()
    .when("type", {
      is: (type: string) => ["ADVERTISING", "BRAND_AMBASSADOR"].includes(type),
      then: (schema) =>
        schema.shape({
          total_cost: yup
            .number()
            .typeError("Please enter a valid amount")
            .min(1, "Total cost must be greater than 0")
            .required("Please enter the total cost"),
          schedule: yup
            .array()
            .min(1, "Please add at least one payment schedule item")
            .test("schedule-total-match", "Schedule total must match total cost", function (value) {
              const parentData = this.parent || {};
              const total_cost = parentData.total_cost || 0;
              if (!value || value.length === 0) return true;

              const scheduleTotal = value.reduce(
                (sum: number, item: any) => sum + (item.amount || 0),
                0,
              );
              return Math.abs(total_cost - scheduleTotal) < 0.01;
            }),
        }),
    })
    .when("type", {
      is: "AFFILIATE",
      then: (schema) =>
        schema.shape({
          base_per_click: yup
            .number()
            .typeError("Please enter a valid amount")
            .min(0.01, "Base per click must be at least 0.01")
            .required("Please enter the base per click amount"),
          payment_cycle: yup.string().required("Please select a payment cycle"),
          levels: yup
            .array()
            .min(1, "Please add at least one commission level")
            .test("valid-levels", "All levels must have valid values", function (value) {
              if (!value || value.length === 0) return true;
              return value.every(
                (level: any) => level.level > 0 && level.min_clicks >= 0 && level.multiplier > 0,
              );
            }),
          schedule: yup.array().min(1, "Please add at least one payment schedule item"),
        }),
    })
    .when("type", {
      is: "CO_PRODUCING",
      then: (schema) =>
        schema.shape({
          capital_contribution: yup.object({
            company: yup.object({
              description: yup.string().required("Please enter company contribution description"),
              value: yup
                .number()
                .typeError("Please enter a valid amount")
                .min(1, "Company contribution must be greater than 0")
                .required("Please enter company contribution value"),
            }),
            kol: yup.object({
              description: yup.string().required("Please enter KOL contribution description"),
              value: yup
                .number()
                .typeError("Please enter a valid amount")
                .min(1, "KOL contribution must be greater than 0")
                .required("Please enter KOL contribution value"),
            }),
          }),
          profit_split_company_percent: yup
            .number()
            .typeError("Please enter a valid percentage")
            .min(0, "Company profit share cannot be negative")
            .max(100, "Company profit share cannot exceed 100%")
            .required("Please enter the company's profit share percentage"),
          profit_split_kol_percent: yup
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
                const companyPercent = parentData.profit_split_company_percent || 0;
                return companyPercent + (value || 0) === 100;
              },
            ),
          schedule: yup.array().min(1, "Please add at least one payment schedule item"),
        }),
    }),

  // Legal terms - snake_case
  legal_terms: yup.object({
    compensation_percent: yup
      .number()
      .typeError("Please enter a valid percentage")
      .min(0, "Compensation percentage cannot be negative")
      .max(100, "Compensation percentage cannot exceed 100%")
      .required("Please enter the compensation percentage"),
  }),

  // File upload validation - snake_case
  contract_files: yup
    .array()
    .min(1, "Please upload at least one contract file")
    .required("Contract files are required"),
  proposal_files: yup
    .array()
    .min(1, "Please upload at least one proposal file")
    .required("Proposal files are required"),
});

// Real-time field validation
export const validateField = async (fieldPath: string, value: any, formData: any) => {
  try {
    // Handle nested paths properly
    const pathParts = fieldPath.split(".");
    let schema: yup.AnySchema = contractSchema;

    // Navigate to the nested schema
    for (const part of pathParts) {
      if ((schema as any).fields && ((schema as any).fields as Record<string, any>)[part]) {
        schema = ((schema as any).fields as Record<string, any>)[part];
      } else {
        // If we can't find the field, try to reach it using yup.reach
        try {
          schema = yup.reach(contractSchema, fieldPath) as yup.AnySchema;
          break;
        } catch {
          // Field doesn't exist in schema, skip validation
          return { isValid: true, error: null };
        }
      }
    }

    if (schema && typeof schema.validate === "function") {
      // Pass formData as context to make it available in validation tests
      await schema.validate(value, { context: formData });
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
        // Handle nested paths like 'financial_terms.total_cost'
        const pathParts = err.path.split(".");
        if (pathParts.length === 1) {
          errors[pathParts[0]] = err.message;
        } else if (pathParts.length === 2) {
          if (!errors[pathParts[0]]) errors[pathParts[0]] = {};
          errors[pathParts[0]][pathParts[1]] = err.message;
        } else if (pathParts.length === 3) {
          if (!errors[pathParts[0]]) errors[pathParts[0]] = {};
          if (!errors[pathParts[0]][pathParts[1]]) errors[pathParts[0]][pathParts[1]] = {};
          errors[pathParts[0]][pathParts[1]][pathParts[2]] = err.message;
        }
      }
    });
    return { isValid: false, errors };
  }
};
