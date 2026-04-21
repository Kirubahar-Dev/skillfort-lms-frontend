export default function CartPage() {
  return (
    <div className="container-wide py-12">
      <h1 className="font-heading text-4xl font-bold">Your Cart</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          <article className="rounded-2xl border p-4 dark:border-white/10">Full Stack Web Development Mastery - ?24,999</article>
        </section>
        <aside className="rounded-2xl border p-4 dark:border-white/10">
          <h2 className="font-semibold">Order Summary</h2>
          <p className="mt-2 text-sm">Subtotal: ?24,999</p>
          <input className="mt-3 w-full rounded-lg border p-2 bg-transparent" placeholder="Coupon code" />
          <button className="mt-3 w-full rounded-lg border py-2">Apply</button>
          <button className="mt-3 w-full rounded-lg bg-brand-primary py-2 text-slate-900">Proceed to Checkout</button>
        </aside>
      </div>
    </div>
  );
}
