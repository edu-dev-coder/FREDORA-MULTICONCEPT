import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { useSEO } from "@/lib/seo";

// Simple markdown → JSX renderer (no external deps)
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  function inlineFormat(line: string, key: string): React.ReactNode {
    // Process inline: **bold**, *italic*, [text](url)
    const parts: React.ReactNode[] = [];
    let last = 0;
    const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\))/g;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(line)) !== null) {
      if (m.index > last) parts.push(line.slice(last, m.index));
      if (m[2]) parts.push(<strong key={`b${m.index}`}>{m[2]}</strong>);
      else if (m[3]) parts.push(<em key={`i${m.index}`}>{m[3]}</em>);
      else if (m[4]) parts.push(<a key={`a${m.index}`} href={m[5]} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">{m[4]}</a>);
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(line.slice(last));
    return parts.length === 0 ? line : <span key={key}>{parts}</span>;
  }

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { nodes.push(<div key={`br${i}`} className="h-3" />); i++; continue; }
    if (/^---+$/.test(line.trim())) { nodes.push(<hr key={`hr${i}`} className="my-6 border-border" />); i++; continue; }
    if (line.startsWith("# ")) { nodes.push(<h1 key={`h1${i}`} className="text-3xl font-bold font-serif text-foreground mt-8 mb-4 leading-tight">{inlineFormat(line.slice(2), `h1c${i}`)}</h1>); i++; continue; }
    if (line.startsWith("## ")) { nodes.push(<h2 key={`h2${i}`} className="text-2xl font-bold font-serif text-foreground mt-7 mb-3 leading-tight">{inlineFormat(line.slice(3), `h2c${i}`)}</h2>); i++; continue; }
    if (line.startsWith("### ")) { nodes.push(<h3 key={`h3${i}`} className="text-xl font-bold text-foreground mt-6 mb-3">{inlineFormat(line.slice(4), `h3c${i}`)}</h3>); i++; continue; }

    // Blockquote
    if (line.startsWith("> ")) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        items.push(<p key={`bqi${i}`} className="mb-1 last:mb-0">{inlineFormat(lines[i].slice(2), `bqc${i}`)}</p>);
        i++;
      }
      nodes.push(<blockquote key={`bq${i}`} className="border-l-4 border-primary pl-5 my-5 italic text-muted-foreground bg-primary/5 py-3 pr-4 rounded-r-lg">{items}</blockquote>);
      continue;
    }

    // Bullet list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(<li key={`li${i}`} className="mb-1">{inlineFormat(lines[i].slice(2), `lic${i}`)}</li>);
        i++;
      }
      nodes.push(<ul key={`ul${i}`} className="list-disc list-outside pl-5 my-4 space-y-1">{items}</ul>);
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(<li key={`oli${i}`} className="mb-1">{inlineFormat(lines[i].replace(/^\d+\. /, ""), `olic${i}`)}</li>);
        i++;
      }
      nodes.push(<ol key={`ol${i}`} className="list-decimal list-outside pl-5 my-4 space-y-1">{items}</ol>);
      continue;
    }

    // Regular paragraph
    nodes.push(<p key={`p${i}`} className="mb-4 text-foreground/90 leading-relaxed">{inlineFormat(line, `pc${i}`)}</p>);
    i++;
  }

  return nodes;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function NewsDetail() {
  const params = useParams();
  const slug = params.slug || "";

  const { data: post, isLoading, isError } = useQuery<Post>({
    queryKey: ["post", slug],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${slug}`);
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    },
    enabled: !!slug,
  });

  useSEO({
    title: post ? post.title : "News",
    description: post?.excerpt ?? "Read the latest news and updates from Fredora Multiconcept.",
    imageUrl: post?.imageUrl,
    type: "article",
    structuredData: post
      ? [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": window.location.origin + "/" },
              { "@type": "ListItem", "position": 2, "name": "News", "item": window.location.origin + "/news" },
              { "@type": "ListItem", "position": 3, "name": post.title, "item": `${window.location.origin}/news/${post.slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": post.title,
            "description": post.excerpt ?? "",
            "datePublished": post.createdAt,
            "url": `${window.location.origin}/news/${post.slug}`,
            "image": post.imageUrl
              ? post.imageUrl.startsWith("/objects/")
                ? `${window.location.origin}/api/storage${post.imageUrl}`
                : post.imageUrl.startsWith("http")
                  ? post.imageUrl
                  : `${window.location.origin}${post.imageUrl}`
              : `${window.location.origin}/opengraph.jpg`,
            "author": { "@type": "Organization", "name": "Fredora Multiconcept", "url": window.location.origin },
            "publisher": {
              "@type": "Organization",
              "name": "Fredora Multiconcept",
              "logo": { "@type": "ImageObject", "url": `${window.location.origin}/favicon.svg` },
            },
            "mainEntityOfPage": { "@type": "WebPage", "@id": `${window.location.origin}/news/${post.slug}` },
          },
        ]
      : undefined,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <Newspaper className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">This post may have been removed or does not exist.</p>
            <Button asChild variant="outline">
              <Link href="/news"><ChevronLeft className="mr-2 h-4 w-4" /> Back to News</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrl = post.imageUrl
    ? post.imageUrl.startsWith("/objects/") ? `/api/storage${post.imageUrl}` : post.imageUrl
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative">
          {imageUrl ? (
            <div className="h-[45vh] min-h-[320px] relative overflow-hidden">
              <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80" />
              <div className="absolute bottom-0 left-0 right-0 container px-4 pb-12">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold font-serif text-white leading-tight max-w-3xl">
                  {post.title}
                </motion.h1>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#001847] to-[#1565C0] py-20">
              <div className="container px-4">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold font-serif text-white leading-tight max-w-3xl">
                  {post.title}
                </motion.h1>
              </div>
            </div>
          )}
        </section>

        {/* Article Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Meta */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b">
                <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Link href="/news"><ChevronLeft className="mr-1 h-4 w-4" /> All News</Link>
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(post.createdAt), "MMMM d, yyyy")}
                </div>
              </div>

              {post.excerpt && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-xl text-muted-foreground leading-relaxed mb-8 font-light italic border-l-4 border-primary pl-4">
                  {post.excerpt}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-none text-base"
              >
                {renderMarkdown(post.content)}
              </motion.div>

              {/* Footer nav */}
              <div className="mt-16 pt-8 border-t">
                <Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white">
                  <Link href="/news"><ChevronLeft className="mr-2 h-4 w-4" /> Back to All News</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
