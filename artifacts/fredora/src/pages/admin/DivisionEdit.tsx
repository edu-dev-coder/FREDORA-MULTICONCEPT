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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, Plus, Images, ShoppingBag } from "lucide-react";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";

const formSchema = z.object({
  tagline: z.string().nullable(),
  description: z.string().min(1),
  comingSoon: z.boolean(),
  imageUrl: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

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

  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const [showProductForm, setShowProductForm] = useState(false);

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
        toast({ title: "Product added" });
        setProductForm({ name: "", description: "", price: "", imageUrl: "" });
        setShowProductForm(false);
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({ divisionSlug: slug }) });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to add product" })
    });
  }

  function removeProduct(id: number) {
    deleteProduct.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Product removed" });
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey({ divisionSlug: slug }) });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to remove product" })
    });
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
              <CardTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5" /> Products</CardTitle>
              <Button size="sm" onClick={() => setShowProductForm(!showProductForm)}>
                <Plus className="h-4 w-4 mr-1" /> Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showProductForm && (
              <form onSubmit={addProduct} className="mb-6 p-4 bg-muted/30 rounded-xl space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name *</label>
                    <Input value={productForm.name} onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Jollof Rice Mix" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (optional)</label>
                    <Input value={productForm.price} onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))} placeholder="e.g. ₦2,500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (optional)</label>
                  <Textarea value={productForm.description} onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the product" />
                </div>
                <ImageUploadInput
                  currentImageUrl={productForm.imageUrl || null}
                  label="Product Image (optional)"
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
                  <div key={p.id} className="flex items-center gap-3 py-3">
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl.startsWith("/objects/") ? `/api/storage${p.imageUrl}` : p.imageUrl}
                        alt={p.name}
                        className="h-12 w-12 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.name}</p>
                      {p.price && <p className="text-sm text-primary font-semibold">{p.price}</p>}
                      {p.description && <p className="text-xs text-muted-foreground truncate">{p.description}</p>}
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeProduct(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
