import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useAppDispatch } from "@/libs/stores";

const OrderTracking = () => {
  //   const dispatch = useAppDispatch();

  const handleTrackOrder = () => {
    // Dispatch action to track order
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white">
      <div className="w-full flex flex-col items-center">
        <div className="w-full text-center space-y-4 p-6">
          <h1 className="text-6xl font-bold text-gray-800 w-full">Order Tracking</h1>
          <p className="text-2xl">Enter your GHN Order ID in the field below.</p>
        </div>
        <div className="w-full p-6 flex-col md:flex-row flex items-center justify-center">
          <Input
            type="text"
            placeholder="Enter GHN Id"
            className="md:rounded-r-none h-16 md:w-[50%] md:text-xl mb-4 md:mb-0 placeholder:text-xl"
            style={{}}
          />
          <Button
            onClick={handleTrackOrder}
            className="md:rounded-l-none h-16 md:w-[10%] text-xl font-medium"
          >
            Track Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
