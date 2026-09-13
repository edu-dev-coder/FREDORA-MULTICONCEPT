import { useForm, useFieldArray } from "react-hook-form";
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
import { Plus, Trash2, Images, Phone, Building2, BarChart3, Megaphone, FileText } from "lucide-react";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";

const optionalString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((val) => (val === undefined || val === "" ? null : val));

const businessHourSchema = z.object({
  day: z.string().min(1, "Day is required"),
  hours: z.string().min(1, "Hours are required"),
});

const statSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
});

const formSchema = z.object({
  heroTitle: z.string().min(1, "Hero title is required"),
  heroSubtitle: z.string().min(1, "Hero subtitle is required"),
  motto: z.string().min(1, "Motto is required"),
  missionStatement: z.string().min(1, "Mission statement is required"),
  visionStatement: z.string().min(1, "Vision statement is required"),
  coreValues: z.array(z.string()).min(1),
  heroImageUrl: optionalString,
  whatsappNumber: optionalString,
  phoneNumber: optionalString,
  contactEmail: optionalString,
  supportEmail: optionalString,
  headquartersAddress: optionalString,
  businessHours: z.array(businessHourSchema).optional(),
  founderName: optionalString,
  aboutUsText: optionalString,
  yearFounded: optionalString,
  stats: z.array(statSchema).optional(),
  ctaBannerTitle: optionalString,
  ctaBannerText: optionalString,
  footerDescription: optionalString,
  facebookUrl: optionalString,
  instagramUrl: optionalString,
  twitterUrl: optionalString,
  linkedinUrl: optionalString,
  youtubeUrl: optionalString,
  metaDescription: optionalString,
  googleAnalyticsId: optionalString,
  catalogueNotes: optionalString,
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
      heroTitle: "", heroSubtitle: "", motto: "", missionStatement: "", visionStatement: "",
      coreValues: [""], heroImageUrl: null, whatsappNumber: null, phoneNumber: null,
      contactEmail: null, supportEmail: null, headquartersAddress: null,
      businessHours: [{ day: "Monday — Friday", hours: "8:00 AM – 5:00 PM" }, { day: "Saturday", hours: "9:00 AM – 2:00 PM" }, { day: "Sunday", hours: "Closed" }],
      founderName: null, aboutUsText: null, yearFounded: null,
      stats: [{ label: "Divisions", value: "5+" }, { label: "Happy Clients", value: "500+" }, { label: "Years of Excellence", value: "10+" }, { label: "Awards Won", value: "20+" }],
      ctaBannerTitle: null, ctaBannerText: null, footerDescription: null,
      facebookUrl: null, instagramUrl: null, twitterUrl: null, linkedinUrl: null, youtubeUrl: null,
      metaDescription: null, googleAnalyticsId: null, catalogueNotes: null,
    },
  });

  const { fields: hourFields, append: appendHour, remove: removeHour } = useFieldArray({ control: form.control, name: "businessHours" });
  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({ control: form.control, name: "stats" });

  const initialized = useRef(false);

  useEffect(() => {
    if (homepage && !initialized.current) {
      const hp = homepage as any;
      const safeCoreValues = Array.isArray(hp.coreValues) && hp.coreValues.length ? hp.coreValues
        : (Array.isArray(hp.values) && hp.values.length ? hp.values : ["Integrity", "Excellence", "Innovation"]);
      const safeHours = Array.isArray(hp.businessHours) && hp.businessHours.length ? hp.businessHours
        : [{ day: "Monday — Friday", hours: "8:00 AM – 5:00 PM" }, { day: "Saturday", hours: "9:00 AM – 2:00 PM" }, { day: "Sunday", hours: "Closed" }];
      const safeStats = Array.isArray(hp.stats) && hp.stats.length ? hp.stats
        : [{ label: "Divisions", value: "5+" }, { label: "Happy Clients", value: "500+" }, { label: "Years of Excellence", value: "10+" }, { label: "Awards Won", value: "20+" }];

      form.reset({
        heroTitle: hp.heroTitle || "Fredora Multiconcept", heroSubtitle: hp.heroSubtitle || "", motto: hp.motto || "",
        missionStatement: hp.missionStatement || "", visionStatement: hp.visionStatement || "", coreValues: safeCoreValues,
        heroImageUrl: hp.heroImageUrl ?? null, whatsappNumber: hp.whatsappNumber ?? null, phoneNumber: hp.phoneNumber ?? null,
        contactEmail: hp.contactEmail ?? null, supportEmail: hp.supportEmail ?? null, headquartersAddress: hp.headquartersAddress ?? null,
        businessHours: safeHours, founderName: hp.founderName ?? null, aboutUsText: hp.aboutUsText ?? null, yearFounded: hp.yearFounded ?? null,
        stats: safeStats, ctaBannerTitle: hp.ctaBannerTitle ?? null, ctaBannerText: hp.ctaBannerText ?? null, footerDescription: hp.footerDescription ?? null,
        facebookUrl: hp.facebookUrl ?? null, instagramUrl: hp.instagramUrl ?? null, twitterUrl: hp.twitterUrl ?? null,
        linkedinUrl: hp.linkedinUrl ?? null, youtubeUrl: hp.youtubeUrl ?? null, metaDescription: hp.metaDescription ?? null,
        googleAnalyticsId: hp.googleAnalyticsId ?? null, catalogueNotes: hp.catalogueNotes ?? null,
      });
      initialized.current = true;
    }
  }, [homepage, form]);

  function onSubmit(values: FormValues) {
    updateHomepage.mutate({ data: values }, {
      onSuccess: async (data) => {
        toast({ title: "Homepage updated successfully", description: "All changes are now live across the website." });
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
        <p className="text-sm text-muted-foreground mt-1">Manage all website content — hero, contact info, company story, stats, and more.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Hero Content */}
          <Card>
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <ImageUploadInput currentImageUrl={form.watch("heroImageUrl")} label="Hero Background Image"
                onUploadComplete={(objectPath) => { form.setValue("heroImageUrl", objectPath); toast({ title: "Image uploaded — click Save Changes to apply." }); }} />
              <div className="grid gap-6 md:grid-cols-2">
                <FormField control={form.control} name="heroTitle" render={({ field }) => (<FormItem><FormLabel>Hero Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="motto" render={({ field }) => (<FormItem><FormLabel>Motto / Subheading</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="heroSubtitle" render={({ field }) => (<FormItem><FormLabel>Hero Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
          </Card>

          {/* Hero Slideshow */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Images className="h-5 w-5" /> Hero Slideshow Images</CardTitle>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${heroSlides.length >= 10 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>{heroSlides.length} / 10 slides</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Upload up to 10 images. They auto-advance every 5s on the homepage hero.</p>
              {heroSlides.length < 10 && (
                <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                  <ImageUploadInput currentImageUrl={pendingSlideImage} label="Upload New Slide Image" onUploadComplete={(path) => setPendingSlideImage(path)} />
                  <Button type="button" onClick={addHeroSlide} disabled={!pendingSlideImage || createHeroSlide.isPending} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />{createHeroSlide.isPending ? "Adding Slide..." : "Add Slide"}
                  </Button>
                </div>
              )}
              {heroSlides.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No slides yet. Upload your first hero image above.</p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {heroSlides.map((slide, i) => {
                    const url = slide.imageUrl.startsWith("/objects/") ? `/api/storage${slide.imageUrl}` : slide.imageUrl;
                    return (
                      <div key={slide.id} className="relative group aspect-video rounded-lg overflow-hidden bg-slate-100">
                        <img src={url} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button type="button" onClick={() => removeHeroSlide(slide.id)} className="bg-destructive text-white rounded-full h-7 w-7 flex items-center justify-center"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                        <span className="absolute bottom-1 left-1 text-xs text-white font-medium bg-black/40 px-1.5 rounded">{i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" /> Contact Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">These details appear on the Contact page, Footer, and throughout the website.</p>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="whatsappNumber" render={({ field }) => (<FormItem><FormLabel>WhatsApp Number</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="+2348012345678" /></FormControl><p className="text-xs text-muted-foreground">Include country code. Powers the WhatsApp chat button.</p><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (<FormItem><FormLabel>Phone Number (Display)</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="+234 806 670 5224" /></FormControl><p className="text-xs text-muted-foreground">Formatted number shown on the Contact page.</p><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="contactEmail" render={({ field }) => (<FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="info@fredoramulticoncept.com" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="supportEmail" render={({ field }) => (<FormItem><FormLabel>Support Email</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="support@fredoramulticoncept.com" /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="headquartersAddress" render={({ field }) => (<FormItem><FormLabel>Headquarters Address</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="Enugu, Nigeria" /></FormControl><FormMessage /></FormItem>)} />
              <div>
                <label className="block mb-3 text-sm font-medium leading-none">Business Hours</label>
                <div className="space-y-2">
                  {hourFields.map((hf, index) => (
                    <div key={hf.id} className="flex items-center gap-2">
                      <FormField control={form.control} name={`businessHours.${index}.day`} render={({ field }) => (<FormItem className="flex-1"><FormControl><Input {...field} placeholder="e.g. Monday — Friday" /></FormControl></FormItem>)} />
                      <FormField control={form.control} name={`businessHours.${index}.hours`} render={({ field }) => (<FormItem className="flex-1"><FormControl><Input {...field} placeholder="e.g. 8:00 AM – 5:00 PM" /></FormControl></FormItem>)} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => { if (hourFields.length > 1) removeHour(index); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendHour({ day: "", hours: "" })}><Plus className="h-4 w-4 mr-2" /> Add Hours Row</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Story */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Company Story (About Page)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">This content appears on the About Us page.</p>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="founderName" render={({ field }) => (<FormItem><FormLabel>Founder & CEO Name</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="Freda Ada Okoro" /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="yearFounded" render={({ field }) => (<FormItem><FormLabel>Year Founded</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="2015" /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="aboutUsText" render={({ field }) => (<FormItem><FormLabel>About Us Text</FormLabel><FormControl><Textarea className="min-h-[160px]" {...field} value={field.value || ""} placeholder="Tell your company's story..." /></FormControl><p className="text-xs text-muted-foreground">Use blank lines to separate paragraphs.</p><FormMessage /></FormItem>)} />
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <Card>
            <CardHeader><CardTitle>Mission, Vision & Values</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField control={form.control} name="missionStatement" render={({ field }) => (<FormItem><FormLabel>Mission Statement</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="visionStatement" render={({ field }) => (<FormItem><FormLabel>Vision Statement</FormLabel><FormControl><Textarea className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div>
                <label className="block mb-4 text-sm font-medium leading-none">Core Values</label>
                <div className="space-y-3">
                  {(form.watch("coreValues") || []).map((_, index) => (
                    <FormField key={index} control={form.control} name={`coreValues.${index}`} render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl><Input {...field} placeholder="E.g., Integrity" /></FormControl>
                        <Button type="button" variant="ghost" size="icon" onClick={() => { const c = form.getValues("coreValues"); if (c.length > 1) form.setValue("coreValues", c.filter((_, i) => i !== index)); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </FormItem>
                    )} />
                  ))}
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => form.setValue("coreValues", [...form.getValues("coreValues"), ""])}><Plus className="h-4 w-4 mr-2" /> Add Value</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Homepage Stats */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Homepage Statistics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Numbers shown in the stats strip below the hero on the homepage.</p>
              <div className="space-y-2">
                {statFields.map((sf, index) => (
                  <div key={sf.id} className="flex items-center gap-2">
                    <FormField control={form.control} name={`stats.${index}.value`} render={({ field }) => (<FormItem className="w-28"><FormControl><Input {...field} placeholder="e.g. 500+" /></FormControl></FormItem>)} />
                    <FormField control={form.control} name={`stats.${index}.label`} render={({ field }) => (<FormItem className="flex-1"><FormControl><Input {...field} placeholder="e.g. Happy Clients" /></FormControl></FormItem>)} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => { if (statFields.length > 1) removeStat(index); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                {statFields.length < 6 && (<Button type="button" variant="outline" size="sm" onClick={() => appendStat({ label: "", value: "" })}><Plus className="h-4 w-4 mr-2" /> Add Stat</Button>)}
              </div>
            </CardContent>
          </Card>

          {/* CTA Banner */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5" /> Call-to-Action Banner</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">The CTA section on the homepage that encourages visitors to get in touch.</p>
              <FormField control={form.control} name="ctaBannerTitle" render={({ field }) => (<FormItem><FormLabel>CTA Title</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="Ready to Work With Us?" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="ctaBannerText" render={({ field }) => (<FormItem><FormLabel>CTA Description</FormLabel><FormControl><Textarea {...field} value={field.value || ""} placeholder="Whether you want to place an order..." /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="facebookUrl" render={({ field }) => (<FormItem><FormLabel>Facebook URL</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="https://facebook.com/..." /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="instagramUrl" render={({ field }) => (<FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="https://instagram.com/..." /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="twitterUrl" render={({ field }) => (<FormItem><FormLabel>Twitter / X URL</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="https://x.com/..." /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="linkedinUrl" render={({ field }) => (<FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="https://linkedin.com/..." /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="youtubeUrl" render={({ field }) => (<FormItem><FormLabel>YouTube URL</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="https://youtube.com/..." /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </CardContent>
          </Card>

          {/* SEO, Catalogue & Footer */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> SEO, Catalogue & Footer</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="metaDescription" render={({ field }) => (<FormItem><FormLabel>Meta Description (SEO)</FormLabel><FormControl><Textarea {...field} value={field.value || ""} placeholder="A brief description for search engines (150–160 chars)" /></FormControl><p className="text-xs text-muted-foreground">Appears in Google search results under your site name.</p><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="googleAnalyticsId" render={({ field }) => (<FormItem><FormLabel>Google Analytics Measurement ID</FormLabel><FormControl><Input {...field} value={field.value || ""} placeholder="G-XXXXXXXXXX" /></FormControl><p className="text-xs text-muted-foreground">GA4 Measurement ID for visitor analytics.</p><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="catalogueNotes" render={({ field }) => (<FormItem><FormLabel>Catalogue Banner Note</FormLabel><FormControl><Textarea {...field} value={field.value || ""} placeholder="Orders can be placed directly or through our WhatsApp hotline." /></FormControl><p className="text-xs text-muted-foreground">Displayed at the top of the public Catalogue page.</p><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="footerDescription" render={({ field }) => (<FormItem><FormLabel>Footer Description</FormLabel><FormControl><Textarea {...field} value={field.value || ""} placeholder="Leave blank to use the motto." /></FormControl><p className="text-xs text-muted-foreground">Short text under the logo in the footer. Falls back to Motto if blank.</p><FormMessage /></FormItem>)} />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={updateHomepage.isPending}>{updateHomepage.isPending ? "Saving..." : "Save All Changes"}</Button>
          </div>
        </form>
      </Form>
    </AdminLayout>
  );
}
