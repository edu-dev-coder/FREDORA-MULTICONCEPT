import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Newspaper, Bold, Italic,
  Heading1, Heading2, List, Link2, Quote, Minus, ExternalLink,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";

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

interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  published: boolean;
}

const emptyForm: PostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  imageUrl: null,
  published: false,
};

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function getImageDisplayUrl(url: string | null | undefined) {
  if (!url) return null;
  return url.startsWith("/objects/") ? `/api/storage${url}` : url;
}

// ---------- Markdown Toolbar ----------
interface ToolbarBtn {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  action: (text: string, sel: { start: number; end: number }) => { value: string; cursor: number };
}

function wrap(prefix: string, suffix: string, text: string, start: number, end: number) {
  const selected = text.slice(start, end) || "text";
  const before = text.slice(0, start);
  const after = text.slice(end);
  return {
    value: `${before}${prefix}${selected}${suffix}${after}`,
    cursor: start + prefix.length + selected.length + suffix.length,
  };
}

function prependLines(marker: string, text: string, start: number, end: number) {
  const before = text.slice(0, start);
  const block = text.slice(start, end) || "Item";
  const after = text.slice(end);
  const lines = block.split("\n").map((l) => `${marker} ${l}`).join("\n");
  return { value: `${before}${lines}${after}`, cursor: start + lines.length };
}

const TOOLBAR: ToolbarBtn[] = [
  {
    icon: Bold,
    title: "Bold",
    action: (t, { start, end }) => wrap("**", "**", t, start, end),
  },
  {
    icon: Italic,
    title: "Italic",
    action: (t, { start, end }) => wrap("*", "*", t, start, end),
  },
  {
    icon: Heading1,
    title: "Heading 1",
    action: (t, { start, end }) => wrap("# ", "", t, start, end),
  },
  {
    icon: Heading2,
    title: "Heading 2",
    action: (t, { start, end }) => wrap("## ", "", t, start, end),
  },
  {
    icon: List,
    title: "Bullet list",
    action: (t, { start, end }) => prependLines("-", t, start, end),
  },
  {
    icon: Quote,
    title: "Blockquote",
    action: (t, { start, end }) => prependLines(">", t, start, end),
  },
  {
    icon: Minus,
    title: "Divider",
    action: (t, { start }) => {
      const before = t.slice(0, start);
      const after = t.slice(start);
      const ins = "\n---\n";
      return { value: `${before}${ins}${after}`, cursor: start + ins.length };
    },
  },
  {
    icon: Link2,
    title: "Link",
    action: (t, { start, end }) => wrap("[", "](url)", t, start, end),
  },
];

function MarkdownToolbar({
  textareaRef,
  value,
  onChange,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (v: string) => void;
}) {
  function apply(btn: ToolbarBtn) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const result = btn.action(value, { start, end });
    onChange(result.value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(result.cursor, result.cursor);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-muted/50 border border-b-0 rounded-t-md">
      {TOOLBAR.map((btn) => {
        const Icon = btn.icon;
        return (
          <button
            key={btn.title}
            type="button"
            title={btn.title}
            onClick={() => apply(btn)}
            className="p-1.5 rounded hover:bg-background hover:shadow-sm transition-colors text-muted-foreground hover:text-foreground"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
      <span className="ml-auto text-[10px] text-muted-foreground/50 hidden sm:block pr-1">
        Markdown supported
      </span>
    </div>
  );
}

// ---------- Main Component ----------
export default function AdminNews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/posts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-posts"] });

  const createPost = useMutation({
    mutationFn: async (data: PostForm) => {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          excerpt: data.excerpt || null,
          imageUrl: data.imageUrl || null,
        }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? "Failed"); }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Post published!" });
      invalidate();
      setDialogOpen(false);
    },
    onError: (e) => toast({ variant: "destructive", title: e.message }),
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PostForm> }) => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          excerpt: data.excerpt || null,
          imageUrl: data.imageUrl || null,
        }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? "Failed"); }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Post updated!" });
      invalidate();
      setDialogOpen(false);
    },
    onError: (e) => toast({ variant: "destructive", title: e.message }),
  });

  const deletePost = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/admin/posts/${id}`, { method: "DELETE", credentials: "include" });
    },
    onSuccess: () => { toast({ title: "Post deleted" }); invalidate(); },
    onError: () => toast({ variant: "destructive", title: "Failed to delete post" }),
  });

  const togglePublished = (post: Post) => {
    updatePost.mutate({ id: post.id, data: { published: !post.published } });
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content,
      imageUrl: post.imageUrl ?? null,
      published: post.published,
    });
    setDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: editing ? f.slug : slugify(title),
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      toast({ variant: "destructive", title: "Title, slug, and content are required" });
      return;
    }
    if (editing) {
      updatePost.mutate({ id: editing.id, data: form });
    } else {
      createPost.mutate(form);
    }
  };

  const isBusy = createPost.isPending || updatePost.isPending;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">News & Blog</h2>
          <p className="text-muted-foreground text-sm mt-1">Write, edit and publish company news and updates.</p>
        </div>
        <Button onClick={openCreate} className="gap-2 rounded-full">
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </div>

      {/* Posts table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-14">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : !posts || posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-36">
                  <Newspaper className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground">No posts yet. Create your first one!</p>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => {
                const thumb = getImageDisplayUrl(post.imageUrl);
                return (
                  <TableRow key={post.id} className="group">
                    <TableCell>
                      {thumb ? (
                        <img
                          src={thumb}
                          alt=""
                          className="w-11 h-11 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center">
                          <Newspaper className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs">
                      <span className="line-clamp-2 leading-snug">{post.title}</span>
                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{post.excerpt}</p>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs font-mono">
                      {post.slug}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={post.published ? "default" : "secondary"}
                        className={post.published ? "bg-blue-100 text-blue-700 hover:bg-blue-100 border border-blue-200" : ""}
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm whitespace-nowrap">
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={post.published ? "Unpublish" : "Publish"}
                          onClick={() => togglePublished(post)}
                        >
                          {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Preview"
                          onClick={() => window.open(`/news/${post.slug}`, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete post?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete "{post.title}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePost.mutate(post.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">
                {editing ? "Edit Post" : "New Post"}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    id="published-switch"
                    checked={form.published}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
                  />
                  <Label htmlFor="published-switch" className="text-sm">
                    {form.published ? "Published" : "Draft"}
                  </Label>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={isBusy}
                  className="rounded-full gap-2"
                >
                  {isBusy ? "Saving…" : editing ? "Save Changes" : "Publish Post"}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Two-column body */}
          <div className="flex flex-1 overflow-hidden">
            {/* LEFT — main writing area */}
            <div className="flex-1 flex flex-col overflow-y-auto p-6 gap-5 min-w-0">
              {/* Title */}
              <div>
                <Input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Post title…"
                  className="text-xl font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-muted-foreground/40 h-auto py-2"
                />
              </div>

              {/* Excerpt */}
              <div>
                <Textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Short excerpt shown in the news listing (optional)…"
                  rows={2}
                  className="resize-none text-sm text-muted-foreground border-dashed"
                />
              </div>

              {/* Content editor */}
              <div className="flex-1 flex flex-col">
                <Label className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Content *
                </Label>
                <MarkdownToolbar
                  textareaRef={contentRef}
                  value={form.content}
                  onChange={(v) => setForm((f) => ({ ...f, content: v }))}
                />
                <Textarea
                  ref={contentRef}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder={`Write your full post content here…\n\nTips:\n# Heading 1  ## Heading 2\n**bold**  *italic*\n- Bullet list\n> Blockquote\n[Link text](https://url)`}
                  className="flex-1 resize-none rounded-t-none border-t-0 min-h-[320px] text-sm leading-relaxed font-mono focus-visible:ring-0"
                />
              </div>
            </div>

            <Separator orientation="vertical" className="shrink-0" />

            {/* RIGHT — metadata sidebar */}
            <div className="w-72 shrink-0 flex flex-col gap-5 overflow-y-auto p-5 bg-muted/20">
              {/* Cover image */}
              <div>
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
                  Cover Image
                </Label>
                <ImageUploadInput
                  label=""
                  currentImageUrl={form.imageUrl}
                  onUploadComplete={(path) => setForm((f) => ({ ...f, imageUrl: path }))}
                  recommendedSize="1200 × 630 px"
                  aspectRatioHint="1.91:1 Article Cover"
                  maxSizeMB={8}
                />
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, imageUrl: null }))}
                    className="mt-1.5 text-xs text-destructive hover:underline"
                  >
                    Remove image
                  </button>
                )}
              </div>

              <Separator />

              {/* Slug */}
              <div>
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
                  URL Slug
                </Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                  placeholder="post-slug"
                  className="font-mono text-sm h-8"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  /news/<span className="text-foreground">{form.slug || "post-slug"}</span>
                </p>
              </div>

              <Separator />

              {/* Tips */}
              <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <p className="font-semibold text-foreground">Formatting tips</p>
                <p><code className="bg-muted px-1 rounded"># Heading 1</code></p>
                <p><code className="bg-muted px-1 rounded">## Heading 2</code></p>
                <p><code className="bg-muted px-1 rounded">**bold**</code></p>
                <p><code className="bg-muted px-1 rounded">*italic*</code></p>
                <p><code className="bg-muted px-1 rounded">- bullet item</code></p>
                <p><code className="bg-muted px-1 rounded">&gt; blockquote</code></p>
                <p><code className="bg-muted px-1 rounded">[text](url)</code></p>
                <p><code className="bg-muted px-1 rounded">---</code> for divider</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
