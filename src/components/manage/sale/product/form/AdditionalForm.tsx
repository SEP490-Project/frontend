import { Input } from "@/components/ui/input";

export const AdditionalInfoForm = () => {
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
            min={0}
            placeholder="Input"
            className="col-span-3"
            autoComplete="off"
            defaultValue={"1"}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-7">
          <label
            htmlFor="maxStock"
            className="text-sm font-medium text-gray-700 text-right items-center flex justify-start md:justify-end"
          >
            <span className="text-red-600">*</span>
            Max Stock
          </label>
          <Input
            id="maxStock"
            type="number"
            min={0}
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
