import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { removeItem } from "@/libs/local-storage";

const DoneStep = () => {
  const navigate = useNavigate();
  const { setIsDisabled, setOnSubmitStep } = useOutletContext<{
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    setOnSubmitStep: React.Dispatch<React.SetStateAction<null | (() => Promise<void>)>>;
  }>();

  useEffect(() => {
    // Enable the finish button
    setIsDisabled(false);

    // Set up the finish action
    setOnSubmitStep(() => async () => {
      // Clear the localStorage
      removeItem("currentProduct");
      removeItem("currentProductVariants");
      // Navigate to product list
      navigate("/manage/sale/product");
    });

    // Cleanup localStorage when this component mounts (product creation is done)
    return () => {
      // Only clean if user navigates away without clicking finish
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/manage/sale/product/create")) {
        removeItem("currentProduct");
        removeItem("currentProductVariants");
      }
    };
  }, [navigate, setIsDisabled, setOnSubmitStep]);
  return (
    <div className="bg-white p-6 rounded-lg mt-6 shadow-md">
      <Card className="border-none shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-6">
            <CheckCircle2 className="w-24 h-24 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Created Successfully!</h2>
          <p className="text-gray-600 text-center mb-8 max-w-md">
            Your product has been created and all variants have been added. You can now manage your
            product from the product list.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                removeItem("currentProduct");
                removeItem("currentProductVariants");
                navigate("/manage/sale/product");
              }}
            >
              View Product List
            </Button>
            <Button
              onClick={() => {
                removeItem("currentProduct");
                removeItem("currentProductVariants");
                navigate("/manage/sale/product/create", {
                  state: {
                    formType: "CREATE",
                    productType: "STANDARD",
                  },
                });
              }}
            >
              Create Another Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoneStep;
