import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";
import React from "react";

//Form for user to input proposals for new products
export const ImportProductForm = ({
  onImportData,
}: {
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [progress, setProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const simulateUpload = () => {
    setIsUploading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          return 100;
        }

        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 200);
  };

  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <p className="mb-2 text-gray-700 text-sm">
        <span className="text-red-600">*</span>This is an important step for the system to
        initialize the number of products. So please make sure your file (.xlsx, .csv) is valid
        before uploading.
      </p>
      <p className="mb-4 text-gray-700 text-sm">
        <span className="text-red-600">*</span>You can install the template file 'template.xlsx'
      </p>
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed border-primary p-6 rounded-lg cursor-pointer hover:bg-primary/10 transition relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          if (files.length > 0 && !isUploading) {
            const event = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
            onImportData(event);
            setFileName(files[0].name);
            simulateUpload();
          }
        }}
      >
        <Upload className="text-primary h-10 w-10" />
        <p className="mt-4 text-center text-gray-600">
          Drag and drop your product file here, or{" "}
          <span className="text-primary font-medium underline">browse</span> to select a file.
        </p>
        <Input
          ref={inputRef}
          type="file"
          className={`mt-2 absolute h-full inset-0 opacity-0 cursor-pointer ${isUploading ? "cursor-not-allowed hidden" : "cursor-pointer"}`}
          disabled={isUploading}
          onChange={(e) => {
            if (!isUploading && e.target.files && e.target.files.length > 0) {
              onImportData(e);
              setFileName(e.target.files[0].name);
              simulateUpload();
            }
          }}
        />
      </div>
      {progress > 0 && (
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 mt-2 text-center">
            {progress < 100
              ? `Uploading... ${Math.round(progress)}%`
              : `Upload complete${fileName ? `: ${fileName}` : ""}`}
          </p>
        </div>
      )}
    </div>
  );
};

export const BasicInfosForm = () => {
  return <div>Basic Information Form</div>;
};

// Additional information form is only for Limited Products
export const AdditionalInfosForm = () => {
  return <div>Additional Information Form</div>;
};

export const VariationsForm = () => {
  return <div>Variations Form</div>;
};

export const VariationList = () => {
  return <div>Variation List</div>;
};
