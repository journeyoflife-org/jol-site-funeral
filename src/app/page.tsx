import type { Metadata } from "next";
import tenant from "@/fixtures/tenant.json";
import { resolveLocale, buildHreflang, buildCanonical } from "@/lib/resolve-locale";
import { buildChurchEntity, buildBreadcrumb } from "@/lib/json-ld";

const locales = ["lt", "en", "ru"] as const;

export function generateMetadata(): Metadata {
  const name = resolveLocale(tenant.name, "lt");
  return {
    title: `${name} — Funeral Services | ${tenant.slug}`,
    alternates: {
      canonical: buildCanonical(tenant.identity.domain),
      languages: buildHreflang(tenant.identity.domain, locales),
    },
  };
}

export default function FuneralPage() {
  const locale = "lt";
  const t = (obj: Record<string, string>) => resolveLocale(obj, locale);
  const churchEntity = buildChurchEntity({
    name: t(tenant.name),
    address: tenant.identity.address,
    phone: tenant.identity.phone,
    geo: { lat: 54.6872, lng: 25.2797 },
    parentOrganization: tenant.identity.jurisdiction || "",
    
  });
  const breadcrumb = buildBreadcrumb([
    { name: t(tenant.name), url: `https://${tenant.identity.domain}/` },
  ]);
  const page = tenant.pages[0];

  const hero = page.contentBlocks[0] as any;
  const kv = page.contentBlocks[1] as any;
  const stats = page.contentBlocks[2] as any;
  const cta = page.contentBlocks[3] as any;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(churchEntity) } }
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify(breadcrumb) } }
      />

      {/* Hero — calm, pastoral */}
      <section aria-label="Hero" className="bg-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t(hero.heading)}</h1>
          {hero.subheading && <p className="text-xl text-gray-700 mb-2">{t(hero.subheading)}</p>}
        </div>
      </section>

      {/* Contact — phone-first for bereaved */}
      <section aria-label="Immediate contact" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{t(kv.heading)}</h2>
          <dl className="space-y-2">
            {kv.items.map((item: any, i: number) => (
              <div key={i} className="flex gap-2">
                <dt className="font-medium text-gray-700 min-w-[120px]">{t(item.label)}:</dt>
                <dd className="text-gray-600">{item.value}</dd>
              </div>
            ))}
          </dl>
          <a href="tel:+37052105555" className="inline-block mt-6 px-8 py-4 bg-gray-800 text-white rounded-lg text-lg font-medium hover:bg-gray-700 transition-colors">
            Call now (24/7)
          </a>
        </div>
      </section>

      {/* Stats — experience */}
      <section aria-label="Experience" className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t(stats.heading)}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.items.map((item: any, i: number) => (
              <div key={i} className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-gray-700">{item.value}</div>
                <div className="text-sm text-gray-600 mt-1">{t(item.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-label="Quick links" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="flex flex-wrap gap-4 justify-center">
            {cta.links.map((link: any, i: number) => (
              <a key={i} href={link.href} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium">{t(link.label)}</a>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
