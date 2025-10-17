import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const AddCategoryForm = () => {
  return (
    <>
      <form>
        <div>
          <Label className="mb-2 block">Category Name</Label>
          <Input type="text" placeholder="Category Name" className="mb-4" />
        </div>
        <div>
          <Label className="mb-2 block">Category Description</Label>
          <Input type="text" placeholder="Category Description" className="mb-4" />
        </div>
        <div>
          <Label className="mb-2 block">Parent Category</Label>
          <Input type="text" placeholder="Parent Category" className="mb-4" />
        </div>
      </form>
    </>
  );
};
