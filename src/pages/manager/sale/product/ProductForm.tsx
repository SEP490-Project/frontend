import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageUp, Upload } from "lucide-react";
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

export const BasicInfosSection = () => {
  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
      <form>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="productName"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Product Name
          </label>
          <Input id="productName" placeholder="Input" className="col-span-3" autoComplete="off" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="productCategory"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Category
          </label>
          <Input
            id="productCategory"
            placeholder="Input"
            className="col-span-3"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="productSubCategory"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            Sub Category
          </label>
          <Input
            id="productSubCategory"
            placeholder="Input"
            className="col-span-3"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="productBrand"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Brand
          </label>
          <Input id="productBrand" placeholder="Input" className="col-span-3" autoComplete="off" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="productSKU"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Is Limited Product
          </label>
          <RadioGroup className="col-span-3 flex space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="limitedProductYes" />
              <Label htmlFor="limitedProductYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="limitedProductNo" />
              <Label htmlFor="limitedProductNo">No</Label>
            </div>
          </RadioGroup>
        </div>
      </form>
    </div>
  );
};

// Additional information form is only for Limited Products
export const AdditionalInfosSection = () => {
  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
      <form>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="premiereDate"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Premiere Date
          </label>
          <Input
            id="premiereDate"
            type="date"
            placeholder="Input"
            className="col-span-3"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="startSaleDate"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Start Sale Date
          </label>
          <Input
            id="startSaleDate"
            type="date"
            placeholder="Input"
            className="col-span-3"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="endSaleDate"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            End Sale Date
          </label>
          <Input
            id="endSaleDate"
            type="date"
            placeholder="Input"
            className="col-span-3"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="purchaseLimit"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Purchase Limit
          </label>
          <Input
            id="purchaseLimit"
            type="number"
            placeholder="Input"
            className="col-span-3"
            autoComplete="off"
            defaultValue={"1"}
          />
        </div>
      </form>
    </div>
  );
};

export const VariationsSection = () => {
  const [numberOfVariations, setNumberOfVariations] = React.useState(0);

  React.useEffect(() => {
    // Reset number of variations when component mounts
    setNumberOfVariations(1);
  }, []);

  const renderVariations = () => {
    const variations = [];
    for (let i = 1; i < numberOfVariations; i++) {
      variations.push(
        <AccordionItem
          value={`variation-${i}`}
          key={i}
          className="bg-gray-200 px-3 rounded-lg mb-3"
        >
          <VariationsForm idx={i} />
        </AccordionItem>,
      );
    }
    return variations;
  };

  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Sale Information</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
        <label className="text-sm font-medium text-gray-700 text-right items-start flex justify-start md:justify-end">
          <span className="text-red-600">*</span>
          Product Variations
        </label>
        <div className="col-span-3">
          <Accordion type="single" collapsible defaultValue="variation-1" className="w-full mb-4">
            {renderVariations()}
          </Accordion>
          <div className="bg-gray-200 p-3 rounded-lg">
            <Button
              size="sm"
              variant="outline"
              className="bg-white"
              onClick={() => setNumberOfVariations((prev) => prev + 1)}
            >
              Add Variation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VariationsForm = ({ idx }: { idx: number }) => {
  return (
    <>
      <AccordionTrigger className="mb-4 border-b border-gray-300">
        <h4 className="font-semibold">Variation {idx}</h4>
      </AccordionTrigger>
      <AccordionContent>
        <form>
          <div className="">
            <label htmlFor="variationImage" className="mb-2">
              <span className="text-red-600">*</span>Variation Image
            </label>
            <div className="border relative border-dashed border-primary rounded-lg h-24 w-24 cursor-pointer bg-white hover:bg-primary/10 transition">
              <div className="flex items-center justify-center w-full h-24">
                <ImageUp className="h-6 w-6 text-primary" />
              </div>
              <Input
                id="variationImage"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer h-full"
              />
            </div>
          </div>
        </form>
      </AccordionContent>
    </>
  );
};

// const VariationList = () => {
//   return <div>Variation List</div>;
// };
