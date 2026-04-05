import { supabase } from "@/lib/supabase";

export default async function HomePage() {
  const { data: locations } = await supabase
    .from("locations")
    .select("id, name, region")
    .eq("is_active", true)
    .order("name");

  const { data: pages } = await supabase
    .from("lp_pages")
    .select("location_id, theme_id, lp_service_themes(slug, service_name)")
    .in("status", ["ready", "approved", "published"])
    .eq("is_active", true);

  // Group pages by location
  const pagesByLocation = new Map<
    string,
    { slug: string; service_name: string }[]
  >();
  for (const p of pages || []) {
    const theme = p.lp_service_themes as unknown as {
      slug: string;
      service_name: string;
    } | null;
    if (!theme) continue;
    const existing = pagesByLocation.get(p.location_id) || [];
    existing.push({ slug: theme.slug, service_name: theme.service_name });
    pagesByLocation.set(p.location_id, existing);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[#1B4332] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Lawn Squad Service Areas
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Professional lawn care services in your area. Select your location
            to get started.
          </p>
        </div>
      </section>

      {/* Location Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(locations || []).map((loc) => {
            const locSlug = loc.name
              .toLowerCase()
              .replace(/^lawn squad\s*(of)?\s*/i, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
            const services = pagesByLocation.get(loc.id) || [];
            const city = loc.name
              .replace(/^Lawn Squad\s*(of)?\s*/i, "")
              .trim();

            return (
              <div
                key={loc.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {city}
                </h2>
                {loc.region && (
                  <p className="text-sm text-gray-500 mb-4">{loc.region}</p>
                )}
                {services.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {services.map((s) => (
                      <a
                        key={s.slug}
                        href={`/${locSlug}/${s.slug}`}
                        className="inline-block text-sm bg-green-50 text-green-800 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        {s.service_name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Coming soon
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B4332] text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-green-300">
          &copy; {new Date().getFullYear()} Lawn Squad. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
