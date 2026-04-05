import { getPageData, getAllPaths } from "@/lib/get-page-data";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// ISR: revalidate every 60 seconds so approved pages go live quickly
export const revalidate = 60;

export async function generateStaticParams() {
  const paths = await getAllPaths();
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string; service: string }>;
}): Promise<Metadata> {
  const { location, service } = await params;
  const data = await getPageData(location, service);
  if (!data) return {};
  return { title: data.metaTitle, description: data.metaDescription };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ location: string; service: string }>;
}) {
  const { location, service } = await params;
  const data = await getPageData(location, service);
  if (!data) notFound();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1B4332] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              {data.heroHeadline}
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8">
              {data.heroSubheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#quote"
                className="inline-block bg-[#FF7300] hover:bg-[#FF9640] text-white font-bold py-4 px-8 rounded-lg text-lg text-center transition-colors"
              >
                {data.ctaText}
              </a>
              {data.phone && (
                <a
                  href={`tel:${data.phone.replace(/\D/g, "")}`}
                  className="inline-block border-2 border-white hover:bg-white/10 text-white font-bold py-4 px-8 rounded-lg text-lg text-center transition-colors"
                >
                  Call {data.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">&#9733;&#9733;&#9733;&#9733;&#9733;</span>{" "}
              4.9/5 Rating
            </span>
            <span>&#10003; Licensed &amp; Insured</span>
            <span>&#10003; Free Estimates</span>
            <span>&#10003; Satisfaction Guaranteed</span>
          </div>
        </div>
      </section>

      {/* Intro + Form */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-5 gap-12">
          <div className="md:col-span-3">
            {data.introP && (
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {data.introP}
              </p>
            )}
            {data.serviceDescription && (
              <div
                className="prose prose-lg text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: data.serviceDescription.replace(/\n/g, "<br/>"),
                }}
              />
            )}
            {data.priceStarting && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
                <div className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-1">
                  Starting At
                </div>
                <div className="text-3xl font-extrabold text-green-800">
                  {data.priceStarting}
                </div>
                {data.priceNote && (
                  <div className="text-sm text-green-600 mt-1">
                    {data.priceNote}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="md:col-span-2" id="quote">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Get Your Free Quote
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                No obligation. Takes less than a minute.
              </p>
              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="w-full bg-[#FF7300] hover:bg-[#FF9640] text-white font-bold py-4 rounded-lg text-lg transition-colors"
                >
                  {data.ctaText}
                </button>
              </form>
              {data.phone && (
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">
                    or call us directly
                  </span>
                  <a
                    href={`tel:${data.phone.replace(/\D/g, "")}`}
                    className="block text-xl font-bold text-[#1B4332] mt-1"
                  >
                    {data.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      {data.processSteps.length > 0 && (
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {data.processSteps.map(
                (step: { title: string; description: string }, i: number) => (
                  <div key={i} className="text-center">
                    <div className="w-14 h-14 bg-[#1B4332] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {i + 1}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {data.benefits.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Lawn Squad
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.benefits.map(
              (b: { title: string; description: string }, i: number) => (
                <div key={i} className="flex gap-4 p-6 bg-green-50 rounded-xl">
                  <div className="text-2xl text-green-600 flex-shrink-0">
                    &#10003;
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
                    <p className="text-gray-600 text-sm">{b.description}</p>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-[#FF7300] py-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready for a Healthier Lawn?
          </h2>
          <p className="text-white/80 mb-6">
            Get your free, no-obligation quote today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#quote"
              className="bg-white text-[#FF7300] font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
            >
              Get Your Free Quote
            </a>
            {data.phone && (
              <a
                href={`tel:${data.phone.replace(/\D/g, "")}`}
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-white/10 transition-colors"
              >
                Call {data.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.testimonials.map(
              (
                t: {
                  rating?: number;
                  text: string;
                  name: string;
                  city?: string;
                },
                i: number,
              ) => (
                <div
                  key={i}
                  className="bg-white border rounded-xl p-6 shadow-sm"
                >
                  <div className="text-yellow-400 mb-3">
                    {"★".repeat(t.rating || 5)}
                  </div>
                  <p className="text-gray-700 italic mb-4">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  {t.city && (
                    <div className="text-sm text-gray-500">{t.city}</div>
                  )}
                </div>
              ),
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faq.length > 0 && (
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {data.faq.map(
                (f: { question: string; answer: string }, i: number) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2">
                      {f.question}
                    </h3>
                    <p className="text-gray-600">{f.answer}</p>
                  </div>
                ),
              )}
            </div>
          </div>
          {/* JSON-LD FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: data.faq.map(
                  (f: { question: string; answer: string }) => ({
                    "@type": "Question",
                    name: f.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: f.answer,
                    },
                  }),
                ),
              }),
            }}
          />
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#1B4332] text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Lawn Squad</h3>
              <p className="text-green-200 text-sm">
                Professional lawn care services for {data.city} and surrounding
                areas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              {data.phone && (
                <p className="text-green-200">
                  <a
                    href={`tel:${data.phone.replace(/\D/g, "")}`}
                    className="hover:text-white"
                  >
                    {data.phone}
                  </a>
                </p>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-3">Service Area</h4>
              <p className="text-green-200 text-sm">
                {data.city}, {data.state} and surrounding communities
              </p>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-6 text-center text-sm text-green-300">
            &copy; {new Date().getFullYear()} Lawn Squad. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
