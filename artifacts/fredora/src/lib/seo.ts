import { useEffect } from "react";

interface SEOConfig {
  title: string;
  description: string;
  imageUrl?: string | null;
  type?: "website" | "article";
  canonical?: string;
  noindex?: boolean;
  structuredData?: object | object[];
}

function setMeta(property: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

const LD_ATTR = "data-seo-ld";

function injectStructuredData(data: object | object[]) {
  document.querySelectorAll(`script[${LD_ATTR}]`).forEach((el) => el.remove());
  const items = Array.isArray(data) ? data : [data];
  items.forEach((item, i) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(LD_ATTR, String(i));
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  });
}

function removeStructuredData() {
  document.querySelectorAll(`script[${LD_ATTR}]`).forEach((el) => el.remove());
}

export function useSEO({
  title,
  description,
  imageUrl,
  type = "website",
  canonical,
  noindex = false,
  structuredData,
}: SEOConfig) {
  const sdJson = structuredData ? JSON.stringify(structuredData) : null;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const siteName = "Fredora Multiconcept";
    const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
    const canonicalUrl = canonical ?? window.location.href;
    const resolvedImage = imageUrl
      ? imageUrl.startsWith("/objects/")
        ? `${window.location.origin}/api/storage${imageUrl}`
        : imageUrl.startsWith("http")
          ? imageUrl
          : `${window.location.origin}${imageUrl}`
      : `${window.location.origin}/opengraph.jpg`;

    document.title = fullTitle;

    setMeta("description", description);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");

    setMeta("og:type", type, "property");
    setMeta("og:site_name", siteName, "property");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:image", resolvedImage, "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", resolvedImage);

    setCanonical(canonicalUrl);

    if (sdJson) injectStructuredData(JSON.parse(sdJson));

    return () => {
      removeStructuredData();
    };
  }, [title, description, imageUrl, type, canonical, noindex, sdJson]);
}
