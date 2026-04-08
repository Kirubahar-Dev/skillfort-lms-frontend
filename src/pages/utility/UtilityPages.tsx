import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { AnimatedPage } from "../../components/common/AnimatedPage";
import { PageHero } from "../../components/common/PageHero";
import { useLmsStore } from "../../context/LmsStore";

export function SearchResultsPage() {
  const [params] = useSearchParams();
  const { courseCatalog } = useLmsStore();
  const query = (params.get("q") ?? "").trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) {
      return [];
    }
    return courseCatalog.filter((course) => {
      return (
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.summary.toLowerCase().includes(query)
      );
    });
  }, [courseCatalog, query]);

  return (
    <AnimatedPage>
      <PageHero
        kicker="Search"
        title="Search results"
        description={query ? `Showing results for "${query}"` : "Use query parameter ?q=... to search."}
      />

      <section className="panel space-y-3">
        {results.length ? (
          results.map((course) => (
            <article key={course.id} className="rounded-xl border bg-white p-3">
              <p className="font-semibold">{course.title}</p>
              <p className="text-sm text-sf-muted">{course.summary}</p>
              <Link className="mt-2 inline-block text-sm text-sf-goldStrong underline" to={`/courses/${course.slug}`}>
                Open course
              </Link>
            </article>
          ))
        ) : (
          <p className="text-sm text-sf-muted">No matching results found.</p>
        )}
      </section>
    </AnimatedPage>
  );
}

export function UtilityNotificationsPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="Utility"
        title="Notifications"
        description="Central notification center for system and learning updates."
      />

      <section className="panel space-y-2 text-sm text-sf-muted">
        <article className="rounded-xl border bg-white p-3">System update scheduled for Sunday 10:00 PM.</article>
        <article className="rounded-xl border bg-white p-3">New recorded batch released for Python Full Stack.</article>
        <article className="rounded-xl border bg-white p-3">Your invoice export archive is ready to download.</article>
      </section>
    </AnimatedPage>
  );
}

export function NotFoundPage() {
  return (
    <AnimatedPage>
      <PageHero
        kicker="404"
        title="Page not found"
        description="The page you requested is not available in this frontend build."
        actions={
          <>
            <Link to="/" className="btn-primary">
              Go Home
            </Link>
            <Link to="/courses" className="btn-secondary">
              Browse Courses
            </Link>
          </>
        }
      />
    </AnimatedPage>
  );
}