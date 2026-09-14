import { useState } from "react";
import { useListTestimonials, useCreateTestimonial, useDeleteTestimonial, getListTestimonialsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Quote } from "lucide-react";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useListTestimonials();
  const createTestimonial = useCreateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    authorName: "",
    company: "",
    content: "",
    avatarUrl: "",
    divisionSlug: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createTestimonial.mutate({
      data: {
        authorName: form.authorName,
        company: form.company || null,
        content: form.content,
        avatarUrl: form.avatarUrl || null,
        divisionSlug: form.divisionSlug || null,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Testimonial added" });
        setForm({ authorName: "", company: "", content: "", avatarUrl: "", divisionSlug: "" });
        setShowForm(false);
        queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to add testimonial" })
    });
  }

  function handleDelete(id: number) {
    deleteTestimonial.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Testimonial deleted" });
        queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to delete testimonial" })
    });
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Testimonials</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name *</label>
                  <Input
                    value={form.authorName}
                    onChange={(e) => setForm(p => ({ ...p, authorName: e.target.value }))}
                    placeholder="e.g. Chisom Okafor"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company (optional)</label>
                  <Input
                    value={form.company}
                    onChange={(e) => setForm(p => ({ ...p, company: e.target.value }))}
                    placeholder="e.g. Okafor Enterprises"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Review / Testimonial *</label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="What did they say about Fredora?"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Division (optional)</label>
                <Input
                  value={form.divisionSlug}
                  onChange={(e) => setForm(p => ({ ...p, divisionSlug: e.target.value }))}
                  placeholder="e.g. foods, chems, transport (leave blank for general)"
                />
              </div>

              <ImageUploadInput
                currentImageUrl={form.avatarUrl || null}
                label="Customer Photo (optional)"
                recommendedSize="400 × 400 px"
                aspectRatioHint="1:1 Square"
                onUploadComplete={(path) => setForm(p => ({ ...p, avatarUrl: path }))}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={createTestimonial.isPending}>
                  {createTestimonial.isPending ? "Adding..." : "Add Testimonial"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : testimonials?.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Quote className="h-10 w-10 mx-auto mb-4 opacity-20" />
          <p>No testimonials yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials?.map((t) => (
            <Card key={t.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {t.avatarUrl ? (
                      <img
                        src={t.avatarUrl.startsWith("/objects/") ? `/api/storage${t.avatarUrl}` : t.avatarUrl}
                        alt={t.authorName}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {t.authorName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{t.authorName}</p>
                      {t.company && <p className="text-sm text-muted-foreground">{t.company}</p>}
                      {t.divisionSlug && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t.divisionSlug}</span>}
                      <p className="text-sm text-muted-foreground mt-2 italic">"{t.content}"</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive shrink-0"
                    onClick={() => handleDelete(t.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
