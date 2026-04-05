import { supabase } from "./supabase";
import { fillTemplate } from "./template-engine";

export async function getPageData(locationSlug: string, serviceSlug: string) {
  // Get location by matching slug against a generated slug from location name
  const { data: locations } = await supabase
    .from("locations")
    .select("id, name, phone, address, region")
    .eq("is_active", true);

  const location = (locations || []).find((l) => {
    const slug = l.name
      .toLowerCase()
      .replace(/^lawn squad\s*(of)?\s*/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return slug === locationSlug;
  });

  if (!location) return null;

  // Get theme
  const { data: theme } = await supabase
    .from("lp_service_themes")
    .select("*")
    .eq("slug", serviceSlug)
    .eq("is_active", true)
    .single();

  if (!theme) return null;

  // Get page content
  const { data: page } = await supabase
    .from("lp_pages")
    .select("*")
    .eq("location_id", location.id)
    .eq("theme_id", theme.id)
    .in("status", ["ready", "approved", "published"])
    .eq("variant", "A")
    .single();

  if (!page) return null;

  // Parse city/state from location name
  const city = location.name.replace(/^Lawn Squad\s*(of)?\s*/i, "").trim();
  const addressParts = (location.address || "").split(",");
  const state =
    addressParts.length >= 3
      ? addressParts[addressParts.length - 2]?.trim()?.split(" ")[0] || ""
      : "";

  const vars = {
    city,
    state,
    brand: "Lawn Squad",
    phone: location.phone || "",
  };

  return {
    location,
    theme,
    page,
    // Resolved content (overrides > AI generated > template)
    h1: page.h1_override || fillTemplate(theme.h1_template, vars),
    metaTitle:
      page.meta_title_override || fillTemplate(theme.meta_title_template, vars),
    metaDescription:
      page.meta_description_override ||
      fillTemplate(theme.meta_description_template, vars),
    heroHeadline:
      page.hero_headline || fillTemplate(theme.hero_headline_template, vars),
    heroSubheadline:
      page.hero_subheadline ||
      fillTemplate(theme.hero_subheadline_template, vars),
    serviceDescription: page.service_description || "",
    introP: page.intro_paragraph || "",
    processSteps: page.process_steps || [],
    benefits: page.benefits || [],
    faq: page.faq || [],
    testimonials: page.testimonials || [],
    ctaText: theme.cta_text || "Get Your Free Quote",
    priceStarting: page.price_starting_at,
    priceNote: page.price_note,
    city,
    state,
    phone: location.phone || "",
  };
}

export async function getAllPaths() {
  const { data: pages } = await supabase
    .from("lp_pages")
    .select("location_id, theme_id, locations(name), lp_service_themes(slug)")
    .in("status", ["ready", "approved", "published"])
    .eq("is_active", true);

  return (pages || [])
    .map((p: Record<string, unknown>) => {
      const loc = p.locations as Record<string, string> | null;
      const theme = p.lp_service_themes as Record<string, string> | null;
      const locName = loc?.name || "";
      const locSlug = locName
        .toLowerCase()
        .replace(/^lawn squad\s*(of)?\s*/i, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return {
        location: locSlug,
        service: theme?.slug || "",
      };
    })
    .filter((p) => p.location && p.service);
}
