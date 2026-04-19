import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { confirmOrder, createOrder } from "../../services/commerceService";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onPay = async () => {
    setLoading(true);
    try {
      const created = await createOrder({ course_id: 1, amount: 2499900 });
      const confirmed = await confirmOrder({
        order_id: created.order_id,
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_signature: "demo_signature",
      });
      toast.success("Payment successful");
      navigate("/order-success", { state: confirmed });
    } catch {
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-heading text-4xl">Checkout</h1>
      <div className="mt-4 rounded-xl border p-4 dark:border-white/10">
        <p>Course: Full Stack Web Development Mastery</p>
        <p className="mt-1">Amount: ?24,999</p>
        <button className="mt-4 rounded-lg bg-brand-primary px-4 py-2 text-white" onClick={onPay} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
