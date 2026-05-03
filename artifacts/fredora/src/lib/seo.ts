import { useEffect } from "react";

interface SEOConfig {
  title: string;
  description: string;
  imageUrl?: string | null;
  type?: "website" | "article";
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

export function useSEO({ title, description, imageUrl, type = "website" }: SEOConfig) {
  useEffect(() => {
    const siteName = "Fredora Multiconcept";
    const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
    const canonicalUrl = window.location.href;
    const resolvedImage = imageUrl
      ? imageUrl.startsWith("/objects/")
        ? `${window.location.origin}/api/storage${imageUrl}`
        : imageUrl.startsWith("http")
          ? imageUrl
          : `${window.location.origin}${imageUrl}`
      : `${window.location.origin}/favicon.svg`;

    document.title = fullTitle;

    setMeta("description", description);

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
  }, [title, description, imageUrl, type]);
}
