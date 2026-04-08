import type { TechTrack } from "../data/questionBank";

type TrackSidebarProps = {
  tracks: TechTrack[];
  activeSlug: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectTrack: (slug: string) => void;
};

export function TrackSidebar({ tracks, activeSlug, searchValue, onSearchChange, onSelectTrack }: TrackSidebarProps) {
  const grouped = tracks.reduce<Record<string, TechTrack[]>>((acc, track) => {
    if (!acc[track.category]) {
      acc[track.category] = [];
    }
    acc[track.category].push(track);
    return acc;
  }, {});

  return (
    <aside className="track-sidebar" aria-label="Technology modules">
      <div className="panel-headline">Tech Roadmap</div>
      <p className="panel-copy">Search any track and switch modules instantly.</p>
      <label className="search-wrap" htmlFor="track-search">
        <span>Find tech</span>
        <input
          id="track-search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="python, django, react, sql..."
        />
      </label>
      {tracks.length === 0 ? (
        <p className="panel-copy">No tracks found for this search.</p>
      ) : (
        <div className="track-groups">
          {Object.entries(grouped).map(([category, categoryTracks]) => (
            <section key={category} className="track-group">
              <h3>{category}</h3>
              <div className="track-list" role="listbox" aria-label={category}>
                {categoryTracks.map((track) => {
                  const active = track.slug === activeSlug;
                  return (
                    <button
                      key={track.slug}
                      type="button"
                      className={active ? "track-btn active" : "track-btn"}
                      onClick={() => onSelectTrack(track.slug)}
                      aria-pressed={active}
                    >
                      <span>{track.title}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </aside>
  );
}
