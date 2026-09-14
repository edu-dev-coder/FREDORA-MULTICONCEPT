import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import {
  useGetDivision, useUpdateDivision, getGetDivisionQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Plus, Layers, Edit2 } from "lucide-react";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tagline: z.string().nullable(),
  description: z.string().min(1),
  comingSoon: z.boolean(),
  imageUrl: z.string().nullable(),
  bannerColor: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceItemType {
  id: number;
  divisionSlug: string;
  name: string;
  description?: string | null;
  price?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
}

export default function AdminDivisionEdit() {
  const params = useParams();
  const slug = params.slug || "";
  const [, setLocation] = useLocation();
  const { data: division, isLoading } = useGetDivision(slug, { query: { enabled: !!slug, queryKey: getGetDivisionQueryKey(slug) } });
  const updateDivision = useUpdateDivision();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Service / Offering Create Form
  const [serviceForm, setServiceForm] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);

  // Service / Offering Edit Modal
  const [editingService, setEditingService] = useState<ServiceItemType | null>(null);
  const [isUpdatingService, setIsUpdatingService] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", tagline: "", description: "", comingSoon: false, imageUrl: null, bannerColor: null },
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (division && !initialized.current) {
      form.reset({
        name: division.name || "",
        tagline: division.tagline || "",
        description: division.description,
        comingSoon: division.comingSoon,
        imageUrl: division.imageUrl ?? null,
        bannerColor: division.bannerColor ?? null,
      });
      initialized.current = true;
    }
  }, [division, form]);

  function onSubmit(values: FormValues) {
    updateDivision.mutate({ slug, data: { ...values, bannerColor: values.bannerColor ?? undefined } }, {
      onSuccess: (data) => {
        toast({ title: "Division updated successfully" });
        queryClient.setQueryData(getGetDivisionQueryKey(slug), data);
        setLocation("/admin/divisions");
      },
      onError: () => toast({ variant: "destructive", title: "Failed to update division" })
    });
  }

  // Service / Offering CRUD operations
  async function addService(e: React.FormEvent) {
    e.preventDefault();
    setIsCreatingService(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          divisionSlug: slug,
          name: serviceForm.name,
          description: serviceForm.description || null,
          price: serviceForm.price || null,
          imageUrl: serviceForm.imageUrl || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to add service");
      toast({ title: "Service added successfully" });
      setServiceForm({ name: "", description: "", price: "", imageUrl: "" });
      setShowServiceForm(false);
      queryClient.invalidateQueries({ queryKey: getGetDivisionQueryKey(slug) });
    } catch (err: any) {
      toast({ variant: "destructive", title: err.message || "Failed to add service" });
    } finally {
      setIsCreatingService(false);
    }
  }

  async function handleSaveEditedService(e: React.FormEvent) {
    e.preventDefault();
    if (!editingService) return;
    setIsUpdatingService(true);
    try {
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingService.name,
          description: editingService.description || null,
          price: editingService.price || null,
          imageUrl: editingService.imageUrl || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update service");
      toast({ title: "Service updated successfully" });
      setEditingService(null);
      queryClient.invalidateQueries({ queryKey: getGetDivisionQueryKey(slug) });
    } catch (err: any) {
      toast({ variant: "destructive", title: err.message || "Failed to update service" });
    } finally {
      setIsUpdatingService(false);
    }
  }

  async function removeService(serviceId: number) {
    if (!confirm("Are you sure you want to delete this service/offering?")) return;
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete service");
      toast({ title: "Service deleted successfully" });
      queryClient.invalidateQueries({ queryKey: getGetDivisionQueryKey(slug) });
    } catch (err: any) {
      toast({ variant: "destructive", title: err.message || "Failed to delete service" });
    }
  }

  if (isLoading) return <AdminLayout><div>Loading...</div></AdminLayout>;
  if (!division) return <AdminLayout><div>Division not found</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setLocation("/admin/divisions")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-foreground">Edit Division: {division.name}</h2>
      </div>

      <div className="space-y-6">
        {/* Division Info */}
        <Card>
          <CardHeader><CardTitle>Division Information</CardTitle></CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ImageUploadInput
                  currentImageUrl={form.watch("imageUrl")}
                  label="Division Banner Image"
                  recommendedSize="1920 × 600 px"
                  aspectRatioHint="3:1 Wide Header"
                  onUploadComplete={(objectPath) => {
                    form.setValue("imageUrl", objectPath);
                    toast({ title: "Image uploaded — click Save Changes to apply." });
                  }}
                />

                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division Display Name</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="tagline" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="bannerColor" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner / Theme Accent Gradient</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} list="gradient-presets" placeholder="e.g. from-blue-600 to-blue-800" />
                    </FormControl>
                    <datalist id="gradient-presets">
                      <option value="from-blue-600 to-blue-800">Blue Gradient</option>
                      <option value="from-emerald-600 to-teal-800">Green Gradient</option>
                      <option value="from-amber-500 to-orange-600">Amber Gradient</option>
                      <option value="from-violet-500 to-purple-700">Purple Gradient</option>
                      <option value="from-rose-500 to-pink-700">Rose Gradient</option>
                      <option value="from-[#001847] to-[#1565C0]">Navy Gradient</option>
                    </datalist>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl><Textarea className="min-h-[180px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="comingSoon" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Coming Soon Status</FormLabel>
                      <div className="text-sm text-muted-foreground">Mark this division as upcoming/under development</div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />

                <div className="pt-4 border-t flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setLocation("/admin/divisions")}>Cancel</Button>
                  <Button type="submit" disabled={updateDivision.isPending}>
                    {updateDivision.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Products & Services (Our Offerings) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5" /> Products & Services (Our Offerings)</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Upload images, edit names, pricing / costing, descriptions, and add new offering cards for this division.</p>
              </div>
              <Button size="sm" onClick={() => setShowServiceForm(!showServiceForm)}>
                <Plus className="h-4 w-4 mr-1" /> Add New Offering Card
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showServiceForm && (
              <form onSubmit={addService} className="mb-6 p-4 bg-muted/30 rounded-xl space-y-3 border">
                <div className="font-semibold text-sm">Add New Offering Card</div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title / Name *</label>
                    <Input value={serviceForm.name} onChange={(e) => setServiceForm(s => ({ ...s, name: e.target.value }))} placeholder="e.g. Industrial Solvents & Detergents" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cost / Price (e.g. ₦15,000 or Wholesale)</label>
                    <Input value={serviceForm.price} onChange={(e) => setServiceForm(s => ({ ...s, price: e.target.value }))} placeholder="e.g. ₦15,000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (optional)</label>
                  <Textarea value={serviceForm.description} onChange={(e) => setServiceForm(s => ({ ...s, description: e.target.value }))} placeholder="Brief description of this offering" />
                </div>
                <ImageUploadInput
                  currentImageUrl={serviceForm.imageUrl || null}
                  label="Card Photo"
                  recommendedSize="800 × 600 px"
                  aspectRatioHint="4:3 Landscape"
                  onUploadComplete={(path) => setServiceForm(s => ({ ...s, imageUrl: path }))}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowServiceForm(false)}>Cancel</Button>
                  <Button type="submit" size="sm" disabled={isCreatingService}>
                    {isCreatingService ? "Adding..." : "Add Offering Card"}
                  </Button>
                </div>
              </form>
            )}

            {(!division.services || division.services.length === 0) ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No offering cards listed yet. Click "Add New Offering Card" to create one.
              </div>
            ) : (
              <div className="space-y-4">
                {division.services.map((service) => {
                  const imgUrl = service.imageUrl
                    ? (service.imageUrl.startsWith("/objects/") ? `/api/storage${service.imageUrl}` : service.imageUrl)
                    : null;
                  return (
                    <div key={service.id} className="flex flex-col sm:flex-row gap-4 items-start p-4 rounded-xl border bg-muted/10 hover:bg-muted/20 transition-colors">
                      {imgUrl ? (
                        <img src={imgUrl} alt={service.name} className="h-24 w-36 object-cover rounded-lg shrink-0 border shadow-sm" />
                      ) : (
                        <div className="h-24 w-36 rounded-lg bg-muted flex items-center justify-center shrink-0 border text-xs text-muted-foreground">
                          No photo
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-base text-foreground">{service.name}</p>
                            <p className="text-sm font-bold text-primary mb-1">{service.price || <span className="text-xs text-muted-foreground italic font-normal">Price on request / quote</span>}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-xs"
                              onClick={() => setEditingService({
                                id: service.id,
                                divisionSlug: service.divisionSlug,
                                name: service.name,
                                description: service.description ?? "",
                                price: service.price ?? "",
                                imageUrl: service.imageUrl ?? "",
                                sortOrder: service.sortOrder,
                              })}
                            >
                              <Edit2 className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive shrink-0"
                              onClick={() => removeService(service.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {service.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">{service.description}</p>
                        )}
                        <ImageUploadInput
                          currentImageUrl={service.imageUrl ?? null}
                          label={imgUrl ? "Change Photo" : "Upload Photo"}
                          recommendedSize="800 × 600 px"
                          aspectRatioHint="4:3 Landscape"
                          onUploadComplete={(path) => {
                            // Quick upload photo for this card
                            fetch(`/api/services/${service.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ imageUrl: path }),
                            }).then(() => {
                              toast({ title: "Photo updated successfully" });
                              queryClient.invalidateQueries({ queryKey: getGetDivisionQueryKey(slug) });
                            });
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service / Offering Edit Dialog */}
        <Dialog open={!!editingService} onOpenChange={(open) => { if (!open) setEditingService(null); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Offering Card</DialogTitle>
            </DialogHeader>
            {editingService && (
              <form onSubmit={handleSaveEditedService} className="space-y-4 py-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Title / Name *</label>
                  <Input
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cost / Price / Market Rate</label>
                  <Input
                    value={editingService.price ?? ""}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    placeholder="e.g. ₦15,000 or Wholesale"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={editingService.description ?? ""}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    placeholder="Details about this offering"
                  />
                </div>
                <ImageUploadInput
                  currentImageUrl={editingService.imageUrl}
                  label="Card Photo"
                  recommendedSize="800 × 600 px"
                  aspectRatioHint="4:3 Landscape"
                  onUploadComplete={(path) => setEditingService({ ...editingService, imageUrl: path })}
                />
                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setEditingService(null)}>Cancel</Button>
                  <Button type="submit" disabled={isUpdatingService}>
                    {isUpdatingService ? "Saving..." : "Save Card"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
