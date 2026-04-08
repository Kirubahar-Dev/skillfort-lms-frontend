import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { coupons, courses, starterOrders } from "../data/mockData";
import { BillingDetails, CartItem, CouponInfo, Course, Order } from "../types";

interface CouponState {
  coupon?: CouponInfo;
  message?: string;
  isError?: boolean;
}

interface LmsStoreValue {
  courseCatalog: Course[];
  cart: CartItem[];
  orders: Order[];
  enrolledCourseIds: string[];
  wishlistIds: string[];
  couponState: CouponState;
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  toggleWishlist: (courseId: string) => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  clearCoupon: () => void;
  clearCart: () => void;
  createOrder: (billing: BillingDetails, paymentMethod: Order["paymentMethod"]) => Order | null;
  setOrderStatus: (orderId: string, status: Order["paymentStatus"]) => void;
  getCourseById: (courseId: string) => Course | undefined;
  getOrderById: (orderId: string) => Order | undefined;
}

const LmsStore = createContext<LmsStoreValue | undefined>(undefined);

const defaultEnrolled = ["c-102"];
const defaultWishlist = ["c-103", "c-104"];

export function LmsStoreProvider({ children }: { children: ReactNode }) {
  const courseCatalog = courses;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(starterOrders);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(defaultEnrolled);
  const [wishlistIds, setWishlistIds] = useState<string[]>(defaultWishlist);
  const [couponState, setCouponState] = useState<CouponState>({});

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const discountAmount = useMemo(() => {
    if (!couponState.coupon) {
      return 0;
    }

    if (couponState.coupon.type === "percent") {
      return Math.round((subtotal * couponState.coupon.value) / 100);
    }

    return Math.min(couponState.coupon.value, subtotal);
  }, [couponState.coupon, subtotal]);

  const finalAmount = Math.max(subtotal - discountAmount, 0);

  const addToCart = (course: Course) => {
    setCart((existing) => {
      const found = existing.find((item) => item.courseId === course.id);
      if (found) {
        return existing.map((item) =>
          item.courseId === course.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...existing,
        {
          courseId: course.id,
          title: course.title,
          price: course.price,
          thumbnail: course.thumbnail,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (courseId: string) => {
    setCart((existing) => existing.filter((item) => item.courseId !== courseId));
  };

  const updateQuantity = (courseId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(courseId);
      return;
    }

    setCart((existing) =>
      existing.map((item) => (item.courseId === courseId ? { ...item, quantity } : item)),
    );
  };

  const toggleWishlist = (courseId: string) => {
    setWishlistIds((existing) =>
      existing.includes(courseId) ? existing.filter((id) => id !== courseId) : [...existing, courseId],
    );
  };

  const applyCoupon = (code: string): { ok: boolean; message: string } => {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      const message = "Enter a coupon code.";
      setCouponState({ message, isError: true });
      return { ok: false, message };
    }

    const matched = coupons.find((item) => item.code === normalizedCode);

    if (!matched) {
      const message = "Invalid coupon. Please verify the code.";
      setCouponState({ message, isError: true });
      return { ok: false, message };
    }

    const message = `${matched.code} applied successfully.`;
    setCouponState({ coupon: matched, message, isError: false });
    return { ok: true, message };
  };

  const clearCoupon = () => {
    setCouponState({});
  };

  const clearCart = () => {
    setCart([]);
    clearCoupon();
  };

  const createOrder = (billing: BillingDetails, paymentMethod: Order["paymentMethod"]): Order | null => {
    if (!cart.length) {
      return null;
    }

    const orderId = `SF-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      userId: "stu-1001",
      courses: cart.map((item) => ({ ...item })),
      totalAmount: subtotal,
      discount: discountAmount,
      finalAmount,
      couponCode: couponState.coupon?.code,
      paymentStatus: "PENDING",
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    setOrders((existing) => [newOrder, ...existing]);

    // Keep billing reference for upcoming backend integration.
    void billing;

    return newOrder;
  };

  const setOrderStatus = (orderId: string, status: Order["paymentStatus"]) => {
    let successfulCourseIds: string[] = [];

    setOrders((existing) =>
      existing.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        if (status === "SUCCESS") {
          successfulCourseIds = order.courses.map((item) => item.courseId);
        }

        return { ...order, paymentStatus: status };
      }),
    );

    if (status === "SUCCESS") {
      setEnrolledCourseIds((existing) => {
        const merged = new Set(existing);
        successfulCourseIds.forEach((id) => merged.add(id));
        return Array.from(merged);
      });
      clearCart();
    }
  };

  const getCourseById = (courseId: string) => courseCatalog.find((course) => course.id === courseId);
  const getOrderById = (orderId: string) => orders.find((order) => order.id === orderId);

  const value: LmsStoreValue = {
    courseCatalog,
    cart,
    orders,
    enrolledCourseIds,
    wishlistIds,
    couponState,
    subtotal,
    discountAmount,
    finalAmount,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    applyCoupon,
    clearCoupon,
    clearCart,
    createOrder,
    setOrderStatus,
    getCourseById,
    getOrderById,
  };

  return <LmsStore.Provider value={value}>{children}</LmsStore.Provider>;
}

export function useLmsStore(): LmsStoreValue {
  const context = useContext(LmsStore);
  if (!context) {
    throw new Error("useLmsStore must be used inside LmsStoreProvider");
  }
  return context;
}
