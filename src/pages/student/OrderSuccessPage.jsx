import { useLocation } from "react-router-dom";

export default function OrderSuccessPage() {
  const location = useLocation();
  const data = location.state;
  return (
    <div>
      <h1 className="font-heading text-4xl">Order Success</h1>
      <div className="mt-4 rounded-xl border p-4 dark:border-white/10">
        <p>Order has been confirmed.</p>
        <p className="mt-2 text-sm">Order ID: {data?.order_id || "N/A"}</p>
        <p className="mt-2 text-sm">Status: {data?.status || "paid"}</p>
        <p className="mt-2 text-sm break-all">Certificate: {data?.certificate || "Generated"}</p>
      </div>
    </div>
  );
}
