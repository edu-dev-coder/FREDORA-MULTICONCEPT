import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import {
  useGetHomepage, useUpdateHomepage, getGetHomepageQueryKey,
  useListHeroSlides, useCreateHeroSlide, useDeleteHeroSlide, getListHeroSlidesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Images } from "lucide-react";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";

const optionalString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((val) => (val === undefined || val === "" ? null : val));

const formSchema = z.object({
  heroTitle: z.string().min(1, "Hero title is required"),
  heroSubtitle: z.string().min(1, "Hero subtitle is required"),
  motto: z.string().min(1, "Motto is required"),
  missionStatement: z.string().min(1, "Mission statement is required"),
  visionStatement: z.string().min(1, "Vision statement is required"),
  coreValues: z.array(z.string()).min(1),
  heroImageUrl: optionalString,
  whatsappNumber: optionalString,
  facebookUrl: optionalString,
  instagramUrl: optionalString,
  twitterUrl: optionalString,
  linkedinUrl: optionalString,
  youtubeUrl: optionalString,
  metaDescription: optionalString,
  googleAnalyticsId: optionalString,
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminHomepage() {
  const { data: homepage, isLoading } = useGetHomepage({ query: { queryKey: getGetHomepageQueryKey() } });
  const updateHomepage = useUpdateHomepage();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: heroSlides = [] } = useListHeroSlides({ query: { queryKey: getListHeroSlidesQueryKey() } });
  const createHeroSlide = useCreateHeroSlide();
  const deleteHeroSlide = useDeleteHeroSlide();
  const [pendingSlideImage, setPendingSlideImage] = useState<string | null>(null);

  function addHeroSlide() {
    if (!pendingSlideImage) {
      toast({ variant: "destructive", title: "Please upload an image first" });
      return;
    }
    createHeroSlide.mutate({ data: { imageUrl: pendingSlideImage } }, {
      onSuccess: () => {
        toast({ title: "Slide added" });
        setPendingSlideImage(null);
        queryClient.invalidateQueries({ queryKey: getListHeroSlidesQueryKey() });
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error || "Failed to add slide";
        toast({ variant: "destructive", title: msg });
      }
    });
  }

  function removeHeroSlide(id: number) {
    deleteHeroSlide.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Slide removed" });
        queryClient.invalidateQueries({ queryKey: getListHeroSlidesQueryKey() });
      },
      onError: () => toast({ variant: "destructive", title: "Failed to remove slide" })
    });
  }
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heroTitle: "",
      heroSubtitle: "",
      motto: "",
      missionStatement: "",
      visionStatement: "",
      coreValues: [""],
      heroImageUrl: null,
      whatsappNumber: null,
      facebookUrl: null,
      instagramUrl: null,
      twitterUrl: null,
      linkedinUrl: null,
      youtubeUrl: null,
      metaDescription: null,
      googleAnalyticsId: null,
    },
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (homepage && !initialized.current) {
      const safeCoreValues = Array.isArray(homepage.coreValues) && homepage.coreValues.length
        ? homepage.coreValues
        : (Array.isArray((homepage as any).values) && (homepage as any).values.length ? (homepage as any).values : ["Integrity", "Excellence", "Innovation"]);

      form.reset({
        heroTitle: homepage.heroTitle || "Fredora Multiconcept",
        heroSubtitle: homepage.heroSubtitle || "",
        motto: homepage.motto || "",
        missionStatement: homepage.missionStatement || "",
        visionStatement: homepage.visionStatement || "",
        coreValues: safeCoreValues,
        heroImageUrl: homepage.heroImageUrl ?? null,
        whatsappNumber: homepage.whatsappNumber ?? null,
        facebookUrl: homepage.facebookUrl ?? null,
        instagramUrl: homepage.instagramUrl ?? null,
        twitterUrl: homepage.twitterUrl ?? null,
        linkedinUrl: homepage.linkedinUrl ?? null,
        youtubeUrl: homepage.youtubeUrl ?? null,
        metaDescription: homepage.metaDescription ?? null,
        googleAnalyticsId: homepage.googleAnalyticsId ?? null,
      });
      initialized.current = true;
    }
  }, [homepage, form]);

  function onSubmit(values: FormValues) {
    updateHomepage.mutate({ data: values }, {
      onSuccess: async (data) => {
        toast({
          title: "Homepage updated successfully",
          description: "All contact details and WhatsApp button are now updated across the site.",
        });
        queryClient.setQueryData(getGetHomepageQueryKey(), data);
        await queryClient.invalidateQueries({ queryKey: getGetHomepageQueryKey() });
        queryClient.refetchQueries({ queryKey: getGetHomepageQueryKey() });
      },
      onError: (err: any) => {
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to update homepage";
        toast({ variant: "destructive", title: "Error saving homepage", description: errorMsg });
      }
    });
  }

  if (isLoading) return <AdminLayout><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Edit Homepage</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Hero Content */}
          <Card>
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <ImageUploadInput
                currentImageUrl={form.watch("heroImageUrl")}
                label="Hero Background Image"
                onUploadComplete={(objectPath) => {
                  form.setValue("heroImageUrl", objectPath);
                  toast({ title: "Image uploaded — click Save Changes to apply." });
                }}
              />
              
              <div className="grid gap-6 md:grid-cols-2">
                <FormField control={form.control} name="heroTitle" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="motto" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motto / Subheading</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="heroSubtitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Description</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          {/* Hero Slideshow */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Images className="h-5 w-5" /> Hero Slideshow Images</CardTitle>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${heroSlides.length >= 10 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                  {heroSlides.length} / 10 slides
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload up to 10 images. They will auto-advance every 5 seconds on the homepage hero. If no slides are added, the single hero image above is used as a fallback.
              </p>

              {heroSlides.length < 10 && (
                <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                  <ImageUploadInput
                    currentImageUrl={pendingSlideImage}
                    label="Upload New Slide Image"
                    onUploadComplete={(path) => setPendingSlideImage(path)}
                  />
                  <Button
                    type="button"
                    onClick={addHeroSlide}
                    disabled={!pendingSlideImage || createHeroSlide.isPending}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {createHeroSlide.isPending ? "Adding Slide..." : "Add Slide"}
                  </Button>
                </div>
              )}

              {heroSlides.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No slides yet. Upload your first hero image above.</p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {heroSlides.map((slide, i) => {
                    const url = slide.imageUrl.startsWith("/objects/")
                      ? `/api/storage${slide.imageUrl}`
                      : slide.imageUrl;
                    return (
                      <div key={slide.id} className="relative group aspect-video rounded-lg overflow-hidden bg-slate-100">
                        <img src={url} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeHeroSlide(slide.id)}
                            className="bg-destructive text-white rounded-full h-7 w-7 flex items-center justify-center"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1 text-xs text-white font-medium bg-black/40 px-1.5 rounded">
                          {i + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <Card>
            <CardHeader><CardTitle>Mission, Vision & Values</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField control={form.control} name="missionStatement" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission Statement</FormLabel>
                    <FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="visionStatement" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vision Statement</FormLabel>
                    <FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div>
                <label className="block mb-4 text-sm font-medium leading-none">Core Values</label>
                <div className="space-y-3">
                  {(form.watch("coreValues") || []).map((_, index) => (
                    <FormField key={index} control={form.control} name={`coreValues.${index}`} render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Input {...field} placeholder="E.g., Integrity" />
                        </FormControl>
                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                          const current = form.getValues("coreValues");
                          if (current.length > 1) form.setValue("coreValues", current.filter((_, i) => i !== index));
                        }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </FormItem>
                    )} />
                  ))}
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => {
                    form.setValue("coreValues", [...form.getValues("coreValues"), ""]);
                  }}>
                    <Plus className="h-4 w-4 mr-2" /> Add Value
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader><CardTitle>Social Media & Contact</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="whatsappNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl><Input {...field} value={field.value || ""} placeholder="+2348012345678" /></FormControl>
                  <p className="text-xs text-muted-foreground">Include country code. This enables the WhatsApp chat button on the website.</p>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="facebookUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook URL</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} placeholder="https://facebook.com/..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="instagramUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} placeholder="https://instagram.com/..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="twitterUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter / X URL</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} placeholder="https://x.com/..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} placeholder="https://linkedin.com/..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="youtubeUrl" render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL</FormLabel>
                    <FormControl><Input {...field} value={field.value || ""} placeholder="https://youtube.com/..." /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </CardContent>
          </Card>

          {/* SEO & Analytics */}
          <Card>
            <CardHeader><CardTitle>SEO & Analytics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="metaDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description (SEO)</FormLabel>
                  <FormControl><Textarea {...field} value={field.value || ""} placeholder="A brief description of Fredora Multiconcept for search engines (150–160 characters)" /></FormControl>
                  <p className="text-xs text-muted-foreground">This text appears in Google search results under your site name.</p>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="googleAnalyticsId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Analytics Measurement ID</FormLabel>
                  <FormControl><Input {...field} value={field.value || ""} placeholder="G-XXXXXXXXXX" /></FormControl>
                  <p className="text-xs text-muted-foreground">Enter your GA4 Measurement ID to enable visitor analytics tracking.</p>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={updateHomepage.isPending}>
              {updateHomepage.isPending ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </AdminLayout>
  );
}
