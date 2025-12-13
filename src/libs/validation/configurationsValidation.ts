import * as yup from "yup";

// Value types that can be edited in AllConfigurations
export type EditableValueType = "NUMBER" | "STRING" | "ARRAY" | "BOOLEAN" | "TEXTAREA" | "JSON";

// Value types that should be skipped (edited on separate pages)
export const SKIP_VALUE_TYPES = ["TIPTAP_JSON"];

// Check if a config item should be editable in AllConfigurations
export const isEditableConfig = (valueType: string): boolean => {
  return !SKIP_VALUE_TYPES.includes(valueType);
};

// Base validation by value_type
const getBaseValidationByType = (valueType: EditableValueType) => {
  switch (valueType) {
    case "BOOLEAN":
      return yup.boolean().required("This field is required").typeError("Must be true or false");

    case "NUMBER":
      return yup.number().required("This field is required").typeError("Must be a valid number");

    case "STRING":
      return yup.string().required("This field is required").max(500, "Maximum 500 characters");

    case "TEXTAREA":
      return yup.string().required("This field is required").max(5000, "Maximum 5000 characters");

    case "ARRAY":
      return yup
        .string()
        .required("This field is required")
        .test("valid-array", "Must be comma-separated values", (value) => {
          if (!value) return false;
          // Allow comma-separated values (can be empty items filtered out later)
          return true;
        });

    case "JSON":
      return yup
        .string()
        .required("This field is required")
        .test("valid-json", "Must be valid JSON", (value) => {
          if (!value) return false;
          try {
            JSON.parse(value);
            return true;
          } catch {
            return false;
          }
        });

    default:
      return yup.string().required("This field is required");
  }
};

// Specific key validation rules
interface KeyValidationRule {
  validation: yup.AnySchema;
  inputType?: string;
  placeholder?: string;
}

const keySpecificValidation: Record<string, KeyValidationRule> = {
  // Representative - Email
  representative_email: {
    validation: yup.string().required("Email is required").email("Must be a valid email address"),
    inputType: "email",
    placeholder: "example@company.com",
  },

  // Representative - Phone
  representative_phone: {
    validation: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9+\-\s()]+$/, "Must be a valid phone number")
      .min(10, "Phone number must be at least 10 digits"),
    inputType: "tel",
    placeholder: "+84 123 456 789",
  },

  // Representative - Bank Account Number
  representative_bank_account_number: {
    validation: yup
      .string()
      .required("Bank account number is required")
      .matches(/^[0-9]+$/, "Must contain only numbers")
      .min(8, "Bank account must be at least 8 digits")
      .max(20, "Bank account must be at most 20 digits"),
    inputType: "text",
    placeholder: "1234567890",
  },

  // Representative - Tax Number
  representative_tax_number: {
    validation: yup
      .string()
      .required("Tax number is required")
      .matches(/^[0-9-]+$/, "Must contain only numbers and dashes")
      .min(10, "Tax number must be at least 10 characters"),
    inputType: "text",
    placeholder: "0123456789",
  },

  // Facebook Page ID
  facebook_page_id: {
    validation: yup
      .string()
      .required("Facebook Page ID is required")
      .matches(/^[0-9]+$/, "Must be a numeric ID"),
    inputType: "text",
    placeholder: "123456789012345",
  },

  // Facebook Access Token
  facebook_access_token: {
    validation: yup
      .string()
      .required("Access token is required")
      .min(20, "Access token seems too short"),
    inputType: "password",
    placeholder: "Enter access token",
  },

  // TikTok Access Token
  tik_tok_access_token: {
    validation: yup
      .string()
      .required("Access token is required")
      .min(20, "Access token seems too short"),
    inputType: "password",
    placeholder: "Enter access token",
  },

  // PayOS Client ID
  pay_os_client_id: {
    validation: yup.string().required("Client ID is required").min(5, "Client ID seems too short"),
    inputType: "text",
    placeholder: "Enter PayOS Client ID",
  },

  // PayOS API Key
  pay_os_api_key: {
    validation: yup.string().required("API Key is required").min(10, "API Key seems too short"),
    inputType: "password",
    placeholder: "Enter PayOS API Key",
  },

  // PayOS Checksum Key
  pay_os_checksum_key: {
    validation: yup
      .string()
      .required("Checksum Key is required")
      .min(10, "Checksum Key seems too short"),
    inputType: "password",
    placeholder: "Enter PayOS Checksum Key",
  },

  // Tracking URL patterns
  tracking_base_url: {
    validation: yup.string().required("URL is required").url("Must be a valid URL"),
    inputType: "url",
    placeholder: "https://example.com",
  },

  // Affiliate commission rate
  affiliate_commission_rate: {
    validation: yup
      .number()
      .required("Commission rate is required")
      .min(0, "Must be at least 0")
      .max(100, "Must be at most 100"),
    inputType: "number",
    placeholder: "10",
  },

  // CTR thresholds
  ctr_threshold: {
    validation: yup
      .number()
      .required("CTR threshold is required")
      .min(0, "Must be at least 0")
      .max(1, "Must be at most 1 (100%)"),
    inputType: "number",
    placeholder: "0.05",
  },

  // Bot detection threshold
  bot_detection_threshold: {
    validation: yup
      .number()
      .required("Threshold is required")
      .min(0, "Must be at least 0")
      .max(100, "Must be at most 100"),
    inputType: "number",
    placeholder: "50",
  },
};

// Get validation schema for a specific config item
export const getConfigValidation = (key: string, valueType: EditableValueType): yup.AnySchema => {
  // Check for key-specific validation first
  if (keySpecificValidation[key]) {
    return keySpecificValidation[key].validation;
  }

  // Fall back to base validation by type
  return getBaseValidationByType(valueType);
};

// Get input type for a specific config item
export const getInputType = (key: string, valueType: EditableValueType): string => {
  // Check for key-specific input type
  if (keySpecificValidation[key]?.inputType) {
    return keySpecificValidation[key].inputType;
  }

  // Default input types by value_type
  switch (valueType) {
    case "BOOLEAN":
      return "switch";
    case "NUMBER":
      return "number";
    case "TEXTAREA":
      return "textarea";
    case "ARRAY":
      return "array";
    case "JSON":
      return "json";
    case "STRING":
    default:
      return "text";
  }
};

// Get placeholder for a specific config item
export const getPlaceholder = (key: string, valueType: EditableValueType): string => {
  // Check for key-specific placeholder
  if (keySpecificValidation[key]?.placeholder) {
    return keySpecificValidation[key].placeholder;
  }

  // Default placeholders by value_type
  switch (valueType) {
    case "BOOLEAN":
      return "";
    case "NUMBER":
      return "Enter a number";
    case "TEXTAREA":
      return "Enter text...";
    case "ARRAY":
      return "value1, value2, value3";
    case "JSON":
      return '{"key": "value"}';
    case "STRING":
    default:
      return "Enter value";
  }
};

// Validate a single config value
export const validateConfigValue = async (
  key: string,
  value: any,
  valueType: EditableValueType,
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    const schema = getConfigValidation(key, valueType);
    await schema.validate(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { isValid: false, error: error.message };
    }
    return { isValid: false, error: "Validation failed" };
  }
};

// Create a dynamic schema for a section of configs
export const createSectionSchema = (
  items: Array<{ key: string; value_type: string }>,
): yup.ObjectSchema<any> => {
  const shape: Record<string, yup.AnySchema> = {};

  items.forEach((item) => {
    if (isEditableConfig(item.value_type)) {
      shape[item.key] = getConfigValidation(item.key, item.value_type as EditableValueType);
    }
  });

  return yup.object().shape(shape);
};

// Convert array string to actual array
export const parseArrayValue = (value: string): string[] => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

// Convert array to comma-separated string for display
export const stringifyArrayValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      }
    } catch {
      return value;
    }
  }
  return String(value);
};

// Prepare value for API submission
export const prepareValueForSubmit = (value: any, valueType: EditableValueType): string => {
  switch (valueType) {
    case "BOOLEAN":
      return String(value);
    case "NUMBER":
      return String(value);
    case "ARRAY": {
      // Convert comma-separated to JSON array
      const arrayValues = parseArrayValue(String(value));
      return JSON.stringify(arrayValues);
    }
    case "JSON":
      // Already JSON string or object
      return typeof value === "string" ? value : JSON.stringify(value);
    case "STRING":
    case "TEXTAREA":
    default:
      return String(value);
  }
};

// Parse value from API for editing
export const parseValueForEdit = (value: any, valueType: EditableValueType): any => {
  switch (valueType) {
    case "BOOLEAN":
      return value === "true" || value === true;
    case "NUMBER":
      return Number(value) || 0;
    case "ARRAY":
      return stringifyArrayValue(value);
    case "JSON":
      return typeof value === "string" ? value : JSON.stringify(value, null, 2);
    case "STRING":
    case "TEXTAREA":
    default:
      return String(value ?? "");
  }
};
