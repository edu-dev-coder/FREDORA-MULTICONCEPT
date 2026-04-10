import { useListNewsletterSubscribers } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Users } from "lucide-react";

export default function AdminNewsletter() {
  const { data: subscribers, isLoading } = useListNewsletterSubscribers();

  const csvDownload = () => {
    if (!subscribers) return;
    const csv = ["Email,Subscribed On", ...subscribers.map(s => `${s.email},${new Date(s.createdAt).toLocaleDateString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fredora-newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Newsletter Subscribers</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {subscribers?.length ?? "..."} subscribers total
          </p>
        </div>
        {subscribers && subscribers.length > 0 && (
          <button
            onClick={csvDownload}
            className="text-sm text-primary hover:underline font-medium"
          >
            Download CSV
          </button>
        )}
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : subscribers?.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Mail className="h-10 w-10 mx-auto mb-4 opacity-20" />
          <p>No subscribers yet. The newsletter signup is live on the website footer.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-4">
            <div className="divide-y">
              {subscribers?.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      {s.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{s.email}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(s.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
