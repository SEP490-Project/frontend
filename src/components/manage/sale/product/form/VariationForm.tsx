import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccordionContent } from "@radix-ui/react-accordion";
import { ImageUp } from "lucide-react";
import React from "react";

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

export const VariationsForm = ({ idx }: { idx: number }) => {
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
