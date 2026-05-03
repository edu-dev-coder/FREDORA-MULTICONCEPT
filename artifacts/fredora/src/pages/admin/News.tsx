import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, Eye, EyeOff, Newspaper } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  imageUrl: string;
  published: boolean;
}

const emptyForm: PostForm = { title: "", slug: "", excerpt: "", content: "", imageUrl: "", published: false };

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function AdminNews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm);

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
        body: JSON.stringify({ ...data, excerpt: data.excerpt || null, imageUrl: data.imageUrl || null }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? "Failed"); }
      return res.json();
    },
    onSuccess: () => { toast({ title: "Post created" }); invalidate(); setDialogOpen(false); },
    onError: (e) => toast({ variant: "destructive", title: e.message }),
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PostForm> }) => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, excerpt: data.excerpt || null, imageUrl: data.imageUrl || null }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? "Failed"); }
      return res.json();
    },
    onSuccess: () => { toast({ title: "Post updated" }); invalidate(); setDialogOpen(false); },
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
      imageUrl: post.imageUrl ?? "",
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

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">News & Blog</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage news posts and company updates.</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </div>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">Loading…</TableCell></TableRow>
            ) : !posts || posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32">
                  <Newspaper className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-muted-foreground">No posts yet. Create your first one!</p>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">{post.slug}</TableCell>
                  <TableCell>
                    <Badge variant={post.published ? "default" : "secondary"} className={post.published ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" title={post.published ? "Unpublish" : "Publish"} onClick={() => togglePublished(post)}>
                        {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(post)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete post?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete "{post.title}". This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deletePost.mutate(post.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Post" : "Create New Post"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Post title" />
            </div>
            <div className="grid gap-2">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} placeholder="post-slug" className="font-mono text-sm" />
              <p className="text-xs text-muted-foreground">URL: /news/{form.slug || "post-slug"}</p>
            </div>
            <div className="grid gap-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} placeholder="Short summary shown in listings…" rows={2} />
            </div>
            <div className="grid gap-2">
              <Label>Content *</Label>
              <Textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="Full post content…" rows={10} />
            </div>
            <div className="grid gap-2">
              <Label>Image URL</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://… or /api/storage/objects/…" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.published} onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))} />
              <Label>Published (visible to public)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createPost.isPending || updatePost.isPending}>
              {editing ? "Save Changes" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
