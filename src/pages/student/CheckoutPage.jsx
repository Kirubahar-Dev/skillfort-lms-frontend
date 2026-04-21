import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { createOrder, confirmOrder } from "../../services/commerceService";
import { fetchCourseBySlug } from "../../services/courseService";
import { useAuth } from "../../context/AuthContext";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const slug = state?.courseSlug || state?.courseId;
    if (!slug) { navigate("/courses"); return; }
    fetchCourseBySlug(slug)
      .then(setCourse)
      .catch(() => toast.error("Unable to load course"))
      .finally(() => setPageLoading(false));
  }, [state]);

  const handlePay = async () => {
    if (!course) return;
    setLoading(true);
    try {
      const rzpLoaded = await loadRazorpay();
      if (!rzpLoaded) { toast.error("Payment gateway failed to load. Check internet."); return; }

      const amount = Math.round((course.discountPrice || course.price || 0) * 100); // paise
      const created = await createOrder({ course_id: course.id, amount });

      const keyId = created.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID;
      const isDemo = !created.razorpay_order_id || created.razorpay_order_id.startsWith("demo_");

      // Test mode: backend has no Razorpay keys configured — auto-enroll
      if (isDemo || !keyId || !window.Razorpay) {
        const confirmed = await confirmOrder({
          order_id: created.order_id,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: "demo_signature",
        });
        toast.success("Enrolled successfully! (Test mode)");
        navigate("/my-courses");
        return;
      }

      const options = {
        key: keyId,
        amount,
        currency: "INR",
        name: "Skillfort Institute",
        description: course.title,
        order_id: created.razorpay_order_id,
        prefill: {
          name: user?.full_name || "",
          email: user?.email || "",
        },
        theme: { color: "#6366f1" },
        handler: async (response) => {
          try {
            await confirmOrder({
              order_id: created.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! You are now enrolled.");
            navigate("/my-courses");
          } catch {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => { setLoading(false); toast("Payment cancelled."); },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (res) => {
        toast.error(res.error?.description || "Payment failed.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Unable to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
    </div>
  );

  if (!course) return (
    <div className="container-wide py-12 text-center">
      <p className="text-rose-500">Course not found.</p>
      <Link to="/courses" className="mt-3 inline-block text-brand-primary hover:underline">Browse Courses</Link>
    </div>
  );

  const discount = course.price > course.discountPrice
    ? Math.round(((course.price - course.discountPrice) / course.price) * 100)
    : 0;

  return (
    <div className="container-wide py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-bold">Complete Enrollment</h1>
        <p className="mt-1 text-sm text-slate-500">You're one step away from starting your journey.</p>

        <div className="mt-6 rounded-2xl border dark:border-white/10 overflow-hidden">
          {/* Course summary */}
          <div className="flex gap-4 p-5 border-b dark:border-white/10">
            <img
              src={course.thumbnail || "/images/student-learning.png"}
              alt={course.title}
              className="h-20 w-20 rounded-xl object-cover flex-shrink-0"
              onError={e => { e.target.src = "/images/student-learning.png"; }}
            />
            <div>
              <span className="inline-block rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-medium text-brand-primary">{course.category}</span>
              <h2 className="mt-1 font-semibold text-lg leading-snug">{course.title}</h2>
              <p className="text-sm text-slate-500">{course.lessonsCount} lessons · {Math.round((course.durationMinutes || 0) / 60)} hours</p>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Original Price</span>
              <span>{inr(course.price)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discount}% off)</span>
                <span>- {inr(course.price - course.discountPrice)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-3 dark:border-white/10">
              <span className="font-bold text-base">Total</span>
              <span className="font-bold text-xl text-brand-primary">{inr(course.discountPrice || course.price)}</span>
            </div>
          </div>

          {/* Student info */}
          <div className="px-5 pb-5">
            <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-4">
              <p className="text-xs text-slate-500 mb-1">Enrolling as</p>
              <p className="font-semibold">{user?.full_name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          {/* Pay button */}
          <div className="px-5 pb-5">
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full rounded-xl bg-brand-primary py-3.5 font-bold text-slate-900 shadow-lg transition hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Pay {inr(course.discountPrice || course.price)} &amp; Enroll
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">Secured by Razorpay · 256-bit SSL encryption</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to={`/courses/${course.slug}`} className="text-sm text-slate-500 hover:text-brand-primary">← Back to course</Link>
        </div>
      </div>
    </div>
  );
}
