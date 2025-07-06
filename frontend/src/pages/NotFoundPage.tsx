import { Ban } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center h-96 space-y-4">
      <div className="bg-base-100 rounded-full p-6">
        <Ban className="size-12" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold ">Page not found.</h3>
      </div>
    </div>
  );
}

export default NotFoundPage;
