import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef } from "react";
import { useGetDivision, useUpdateDivision, getGetDivisionQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagline: "",
      description: "",
      comingSoon: false,
      imageUrl: null,
    },
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
      onError: () => {
        toast({ variant: "destructive", title: "Failed to update division" });
      }
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

      <Card>
        <CardContent className="pt-6">
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
                  <FormControl><Textarea className="min-h-[200px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="comingSoon" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Coming Soon Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this to mark the division as upcoming/under development
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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
    </AdminLayout>
  );
}
