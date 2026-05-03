import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { useSEO } from "@/lib/seo";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
}

export default function News() {
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  useSEO({
    title: "News & Updates — Fredora Multiconcept",
    description: "Latest news, announcements, and updates from Fredora Multiconcept — Foods, EduServices, Chems, Scents, Transport & Logistics.",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative py-24 bg-gradient-to-br from-[#001847] via-[#0d3a8e] to-[#1565C0] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)", backgroundSize: "36px 36px" }} />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="container relative z-10 text-center text-white px-4">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-5 py-2 mb-6 text-sm font-medium">
              <Newspaper className="h-4 w-4 text-amber-300" />
              Company Updates
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold font-serif mb-4">
              News & Updates
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-white/80 max-w-xl mx-auto">
              Stay informed with the latest announcements, product launches, and stories from Fredora Multiconcept.
            </motion.p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl bg-muted animate-pulse h-80" />
                ))}
              </div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-24">
                <Newspaper className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-muted-foreground">No posts yet</h2>
                <p className="text-muted-foreground/70 mt-2">Check back soon for news and updates.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link href={`/news/${post.slug}`}>
                      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none bg-white/80 backdrop-blur-sm rounded-2xl group cursor-pointer">
                        <div className="h-52 overflow-hidden relative bg-gradient-to-br from-blue-50 to-slate-100">
                          {post.imageUrl ? (
                            <img
                              src={post.imageUrl.startsWith("/objects/") ? `/api/storage${post.imageUrl}` : post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Newspaper className="h-16 w-16 text-blue-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(post.createdAt), "MMMM d, yyyy")}
                          </div>
                          <h2 className="text-lg font-bold text-foreground mb-2 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-auto">
                            Read more <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
