import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef } from "react";
import { useGetHomepage, useUpdateHomepage, getGetHomepageQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";

const formSchema = z.object({
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  motto: z.string().min(1),
  missionStatement: z.string().min(1),
  visionStatement: z.string().min(1),
  coreValues: z.array(z.string()).min(1),
  heroImageUrl: z.string().nullable(),
  whatsappNumber: z.string().nullable(),
  facebookUrl: z.string().nullable(),
  instagramUrl: z.string().nullable(),
  twitterUrl: z.string().nullable(),
  linkedinUrl: z.string().nullable(),
  youtubeUrl: z.string().nullable(),
  metaDescription: z.string().nullable(),
  googleAnalyticsId: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminHomepage() {
  const { data: homepage, isLoading } = useGetHomepage({ query: { queryKey: getGetHomepageQueryKey() } });
  const updateHomepage = useUpdateHomepage();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
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
      form.reset({
        heroTitle: homepage.heroTitle,
        heroSubtitle: homepage.heroSubtitle,
        motto: homepage.motto,
        missionStatement: homepage.missionStatement,
        visionStatement: homepage.visionStatement,
        coreValues: homepage.coreValues.length ? homepage.coreValues : [""],
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
      onSuccess: (data) => {
        toast({ title: "Homepage updated successfully" });
        queryClient.setQueryData(getGetHomepageQueryKey(), data);
      },
      onError: () => {
        toast({ variant: "destructive", title: "Failed to update homepage" });
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
                  {form.watch("coreValues").map((_, index) => (
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
