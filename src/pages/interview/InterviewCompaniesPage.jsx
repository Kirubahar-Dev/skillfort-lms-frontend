export default function InterviewCompaniesPage() {
  const companies = ["Google", "Amazon", "Microsoft", "TCS", "Infosys", "Wipro", "Zoho", "Freshworks", "Cognizant"];
  return (
    <div className="container-wide py-12">
      <h1 className="font-heading text-4xl font-bold">Company-Wise Questions</h1>
      <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {companies.map((c) => <div key={c} className="rounded-2xl border p-6 text-center dark:border-white/10">{c}</div>)}
      </div>
    </div>
  );
}
