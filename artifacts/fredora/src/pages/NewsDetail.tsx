import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { useSEO } from "@/lib/seo";

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
    title: post ? `${post.title} — Fredora News` : "News — Fredora Multiconcept",
    description: post?.excerpt ?? "Read the latest news and updates from Fredora Multiconcept.",
    imageUrl: post?.imageUrl,
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
            <div className="bg-gradient-to-br from-emerald-900 to-teal-800 py-20">
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
                className="prose prose-lg prose-emerald max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap"
              >
                {post.content}
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
