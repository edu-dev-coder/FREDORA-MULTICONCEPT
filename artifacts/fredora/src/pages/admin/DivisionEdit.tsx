import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import {
  useGetDivision, useUpdateDivision, getGetDivisionQueryKey,
  useListGalleryItems, useCreateGalleryItem, useDeleteGalleryItem, getListGalleryItemsQueryKey,
  useListProducts, useCreateProduct, useDeleteProduct, getListProductsQueryKey,
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
import { ArrowLeft, Trash2, Plus, Images, ShoppingBag, Layers, Edit2, Check } from "lucide-react";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";

const formSchema = z.object({
  tagline: z.string().nullable(),
  description: z.string().min(1),
  comingSoon: z.boolean(),
  imageUrl: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductItem {
  id: number;
  divisionSlug: string;
  name: string;
  description?: string | null;
  price?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
}

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

  const { data: galleryItems } = useListGalleryItems({ divisionSlug: slug }, { query: { enabled: !!slug, queryKey: getListGalleryItemsQueryKey({ divisionSlug: slug }) } });
  const createGalleryItem = useCreateGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();

  const { data: products } = useListProducts({ divisionSlug: slug }, { query: { enabled: !!slug, queryKey: getListProductsQueryKey({ divisionSlug: slug }) } });
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  const [newGalleryCaption, setNewGalleryCaption] = useState("");
  const [pendingGalleryImage, setPendingGalleryImage] = useState<string | null>(null);

  // Product Create Form
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const [showProductForm, setShowProductForm] = useState(false);

  // Product Edit Modal
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);

  // Service Create Form
  const [serviceForm, setServiceForm] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);

  // Service Edit Modal
  const [editingService, setEditingService] = useState<ServiceItemType | null>(null);
  const [isUpdatingService, setIsUpdatingService] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { tagline: "", description: "", comingSoon: false, imageUrl: null },
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (division && !initialized.current) {
      form.reset({
        tagline: division.tagline || "",
        description: division.description,
        comingSoon: division.comingSoon,
        imageUrl: division.imageUrl ?? null,
      });
      initialized.current = true;
    }
  }, [division, form]);

  function onSubmit(values: FormValues) {
    updateDivision.mutate({ slug, data: values }, {
      onSuccess: (data) => {
        toast({ title: "Division updated successfully" });
        queryClient.setQueryData(getGetDivisionQueryKey(slug), data);
        setLocation("/admin/divisions");
      },
      onError: () => toast({ variant: "destructive", title: "Failed to update division" })
    });
  }

  function addGalleryItem() {
    if (!pendingGalleryImage) {
      toast({ variant: "destructive", title: "Please upload an image first" });
      return;
    }
    createGalleryItem.mutate({
      data: { imageUrl: pendingGalleryImage, caption: newGalleryCaption || null, divisionSlug: slug, sortOrder: galleryItems?.length ?? 0 }
    }, {
      onSuccess: () => {
        toast({ title: "Image added to gallery" });
        setPendingGalleryImage(null);
        setNewGalleryCaption("");
        queryClient.invalidateQueries({ queryKey: getListGalleryItemsQueryKey({ divisionSlug: slug }) });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to add gallery image" })
    });
  }

  function removeGalleryItem(id: number) {
    deleteGalleryItem.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Image removed" });
        queryClient.invalidateQueries({ queryKey: getListGalleryItemsQueryKey({ divisionSlug: slug }) });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to remove image" })
    });
  }

  function addProduct(e: React.FormEvent) {
    e.preventDefault();
    createProduct.mutate({
      data: {
        divisionSlug: slug,
        name: productForm.name,
        description: productForm.description || null,
        price: productForm.price || null,
        imageUrl: productForm.imageUrl || null,
        sortOrder: products?.length ?? 0,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Product added successfully" });
        setProductForm({ name: "", description: "", price: "", imageUrl: "" });
        setShowProductForm(false);
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({ divisionSlug: slug }) });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to add product" })
    });
  }

  async function handleSaveEditedProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;
    setIsUpdatingProduct(true);
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingProduct.name,
          description: editingProduct.description || null,
          price: editingProduct.price || null,
          imageUrl: editingProduct.imageUrl || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update product");
      toast({ title: "Product updated successfully" });
      setEditingProduct(null);
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({ divisionSlug: slug }) });
    } catch (err: any) {
      toast({ variant: "destructive", title: err.message || "Failed to update product" });
    } finally {
      setIsUpdatingProduct(false);
    }
  }

  function removeProduct(id: number) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    deleteProduct.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Product removed" });
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({ divisionSlug: slug }) });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to remove product" })
    });
  }

  // Service CRUD operations
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
                  onUploadComplete={(objectPath) => {
                    form.setValue("imageUrl", objectPath);
                    toast({ title: "Image uploaded — click Save Changes to apply." });
                  }}
                />

                <FormField control={form.control} name="tagline" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline (Optional)</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} /></FormControl>
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

        {/* Product Catalog */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5" /> Products Catalog</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Upload new products, set pricing, upload product photos, and edit existing listings.</p>
              </div>
              <Button size="sm" onClick={() => setShowProductForm(!showProductForm)}>
                <Plus className="h-4 w-4 mr-1" /> Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showProductForm && (
              <form onSubmit={addProduct} className="mb-6 p-4 bg-muted/30 rounded-xl space-y-3 border">
                <div className="font-semibold text-sm">Add New Product</div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name *</label>
                    <Input value={productForm.name} onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Special Perfume Oil" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price / Market Value (e.g. ₦15,000)</label>
                    <Input value={productForm.price} onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))} placeholder="e.g. ₦15,000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (optional)</label>
                  <Textarea value={productForm.description} onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the product" />
                </div>
                <ImageUploadInput
                  currentImageUrl={productForm.imageUrl || null}
                  label="Product Photo"
                  onUploadComplete={(path) => setProductForm(p => ({ ...p, imageUrl: path }))}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowProductForm(false)}>Cancel</Button>
                  <Button type="submit" size="sm" disabled={createProduct.isPending}>
                    {createProduct.isPending ? "Adding..." : "Add Product"}
                  </Button>
                </div>
              </form>
            )}

            {!products?.length ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No products yet. Add products to showcase in this division's catalog.
              </div>
            ) : (
              <div className="divide-y">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 py-3 group">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl.startsWith("/objects/") ? `/api/storage${p.imageUrl}` : p.imageUrl}
                        alt={p.name}
                        className="h-14 w-14 rounded-lg object-cover shrink-0 border"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center shrink-0 border text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{p.name}</p>
                      <p className="text-sm text-primary font-bold">{p.price || <span className="text-xs text-muted-foreground italic font-normal">Price on request</span>}</p>
                      {p.description && <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => setEditingProduct({
                          id: p.id,
                          divisionSlug: p.divisionSlug,
                          name: p.name,
                          description: p.description ?? "",
                          price: p.price ?? "",
                          imageUrl: p.imageUrl ?? "",
                          sortOrder: p.sortOrder,
                        })}
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeProduct(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services & Core Offerings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5" /> Products & Services Offerings</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Manage core division offerings, upload photos, set pricing/market rates, and add new services.</p>
              </div>
              <Button size="sm" onClick={() => setShowServiceForm(!showServiceForm)}>
                <Plus className="h-4 w-4 mr-1" /> Add Service / Offering
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showServiceForm && (
              <form onSubmit={addService} className="mb-6 p-4 bg-muted/30 rounded-xl space-y-3 border">
                <div className="font-semibold text-sm">Add New Service / Offering</div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Service / Offering Name *</label>
                    <Input value={serviceForm.name} onChange={(e) => setServiceForm(s => ({ ...s, name: e.target.value }))} placeholder="e.g. Bulk Chemical Supply" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price / Market Rate (e.g. From ₦25,000)</label>
                    <Input value={serviceForm.price} onChange={(e) => setServiceForm(s => ({ ...s, price: e.target.value }))} placeholder="e.g. ₦30,000 / batch" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (optional)</label>
                  <Textarea value={serviceForm.description} onChange={(e) => setServiceForm(s => ({ ...s, description: e.target.value }))} placeholder="Details about this service or offering" />
                </div>
                <ImageUploadInput
                  currentImageUrl={serviceForm.imageUrl || null}
                  label="Offering Image"
                  onUploadComplete={(path) => setServiceForm(s => ({ ...s, imageUrl: path }))}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowServiceForm(false)}>Cancel</Button>
                  <Button type="submit" size="sm" disabled={isCreatingService}>
                    {isCreatingService ? "Adding..." : "Add Service"}
                  </Button>
                </div>
              </form>
            )}

            {(!division.services || division.services.length === 0) ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No services or offerings listed yet. Click "Add Service / Offering" to create one.
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
                        <img src={imgUrl} alt={service.name} className="h-20 w-28 object-cover rounded-lg shrink-0 border" />
                      ) : (
                        <div className="h-20 w-28 rounded-lg bg-muted flex items-center justify-center shrink-0 border text-xs text-muted-foreground">
                          No photo
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-base text-foreground">{service.name}</p>
                            <p className="text-sm font-bold text-primary mb-1">{service.price || <span className="text-xs text-muted-foreground italic font-normal">Price on request / custom quote</span>}</p>
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
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{service.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Edit Dialog */}
        <Dialog open={!!editingProduct} onOpenChange={(open) => { if (!open) setEditingProduct(null); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            {editingProduct && (
              <form onSubmit={handleSaveEditedProduct} className="space-y-4 py-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price / Market Value</label>
                  <Input
                    value={editingProduct.price ?? ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    placeholder="e.g. ₦12,500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={editingProduct.description ?? ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="Product details"
                  />
                </div>
                <ImageUploadInput
                  currentImageUrl={editingProduct.imageUrl}
                  label="Product Photo"
                  onUploadComplete={(path) => setEditingProduct({ ...editingProduct, imageUrl: path })}
                />
                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                  <Button type="submit" disabled={isUpdatingProduct}>
                    {isUpdatingProduct ? "Saving..." : "Save Product"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Service Edit Dialog */}
        <Dialog open={!!editingService} onOpenChange={(open) => { if (!open) setEditingService(null); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Service / Offering</DialogTitle>
            </DialogHeader>
            {editingService && (
              <form onSubmit={handleSaveEditedService} className="space-y-4 py-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Offering Name *</label>
                  <Input
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price / Market Value</label>
                  <Input
                    value={editingService.price ?? ""}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    placeholder="e.g. ₦25,000 / seat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={editingService.description ?? ""}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    placeholder="Details about this service or offering"
                  />
                </div>
                <ImageUploadInput
                  currentImageUrl={editingService.imageUrl}
                  label="Offering Image"
                  onUploadComplete={(path) => setEditingService({ ...editingService, imageUrl: path })}
                />
                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setEditingService(null)}>Cancel</Button>
                  <Button type="submit" disabled={isUpdatingService}>
                    {isUpdatingService ? "Saving..." : "Save Service"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Images className="h-5 w-5" /> Gallery Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-muted/30 rounded-xl space-y-3">
              <ImageUploadInput
                currentImageUrl={pendingGalleryImage}
                label="Upload New Photo"
                onUploadComplete={(path) => setPendingGalleryImage(path)}
              />
              <Input
                value={newGalleryCaption}
                onChange={(e) => setNewGalleryCaption(e.target.value)}
                placeholder="Caption (optional)"
              />
              <Button
                type="button"
                onClick={addGalleryItem}
                disabled={!pendingGalleryImage || createGalleryItem.isPending}
                className="w-full"
              >
                {createGalleryItem.isPending ? "Adding..." : "Add to Gallery"}
              </Button>
            </div>

            {!galleryItems?.length ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No gallery images yet. Upload photos to build this division's gallery.
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {galleryItems.map((item) => (
                  <div key={item.id} className="relative group aspect-square">
                    <img
                      src={item.imageUrl.startsWith("/objects/") ? `/api/storage${item.imageUrl}` : item.imageUrl}
                      alt={item.caption || "Gallery"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {item.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-1 rounded-b-lg truncate">
                        {item.caption}
                      </div>
                    )}
                    <button
                      onClick={() => removeGalleryItem(item.id)}
                      className="absolute top-1 right-1 h-6 w-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
