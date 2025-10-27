import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { DialogTrigger, Dialog, DialogContent } from "@/components/ui/dialog";
import { TaskDisplay } from "./TaskDisplay";
import { useNavigate } from "react-router";

export const SelectAddProductType = () => {
  const navigate = useNavigate();

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Card
            className="p-4 hover:shadow-lg cursor-pointer text-left"
            onClick={() =>
              navigate("create", { state: { formType: "CREATE", productType: "LIMITED" } })
            }
          >
            <CardTitle>Limited Product</CardTitle>
            <CardDescription className="mt-2">
              A product with a limited quantity available for sale.
            </CardDescription>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <TaskDisplay />
        </DialogContent>
      </Dialog>
      <Card
        className="p-4 hover:shadow-lg cursor-pointer text-left"
        onClick={() =>
          navigate("create", { state: { formType: "CREATE", productType: "STANDARD" } })
        }
      >
        <CardTitle>Standard Product</CardTitle>
        <CardDescription className="mt-2">
          A product with unlimited quantity available for sale.
        </CardDescription>
      </Card>
    </>
  );
};
