import { useState } from "react";
import { useListAdminBroadcasts, getListAdminBroadcastsQueryKey, useSendAdminBroadcast } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNigerianDate } from "@/lib/utils";
import { Send, Megaphone, Users, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/react";

const RECIPIENT_OPTIONS = [
  { value: "all", label: "All Users", description: "Everyone who has signed up", icon: Users },
  { value: "completed", label: "Completed Users", description: "Users who completed a test", icon: CheckCircle2 },
  { value: "not_completed", label: "Didn't Complete", description: "Signed up but never completed a test", icon: XCircle },
];

export default function BroadcastPage() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({ subject: "", message: "", recipientType: "all" });
  const [sent, setSent] = useState(false);

  const { data: broadcasts, isLoading } = useListAdminBroadcasts({
    query: { queryKey: getListAdminBroadcastsQueryKey() }
  });

  const { mutate: send, isPending } = useSendAdminBroadcast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return;

    send({
      data: {
        subject: form.subject.trim(),
        message: form.message.trim(),
        recipientType: form.recipientType,
        sentBy: user?.id ?? undefined,
      }
    }, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getListAdminBroadcastsQueryKey() });
        setForm({ subject: "", message: "", recipientType: "all" });
        setSent(true);
        setTimeout(() => setSent(false), 4000);
        toast({
          title: "Broadcast recorded",
          description: `Message logged for ${data.recipientCount.toLocaleString()} recipients.`,
        });
      },
      onError: () => toast({ title: "Error", description: "Failed to send broadcast.", variant: "destructive" }),
    });
  };

  const selectedOption = RECIPIENT_OPTIONS.find((o) => o.value === form.recipientType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Broadcast Message</h1>
        <p className="text-muted-foreground">Send announcements and notifications to your users.</p>
      </div>

      <Card className="border-l-4 border-l-amber-500 bg-amber-50/10 border-border">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start gap-3">
            <Megaphone className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">Broadcasts are logged in your records</p>
              <p className="text-muted-foreground mt-0.5">
                This records the message in your broadcast history. To send actual emails, connect an email provider (e.g. Resend, Mailchimp) to the API server.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" />Compose Message</CardTitle>
            <CardDescription>Write your announcement and choose recipients.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Recipients</Label>
                <Select value={form.recipientType} onValueChange={(v) => setForm(f => ({ ...f, recipientType: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECIPIENT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{opt.label}</span>
                          <span className="text-xs text-muted-foreground">{opt.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedOption && (
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <selectedOption.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{selectedOption.description}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Input
                  placeholder="e.g. New feature: Export your temperament report"
                  value={form.subject}
                  onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Message</Label>
                <Textarea
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  className="min-h-[160px] resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground text-right">{form.message.length} characters</p>
              </div>

              <Button type="submit" disabled={isPending || !form.subject || !form.message} className="w-full">
                {isPending ? (
                  "Sending..."
                ) : sent ? (
                  <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Broadcast Sent!</span>
                ) : (
                  <span className="flex items-center gap-2"><Send className="h-4 w-4" />Send Broadcast</span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Broadcast History</CardTitle>
            <CardDescription>All previously sent broadcasts.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
            ) : !broadcasts || broadcasts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Megaphone className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No broadcasts sent yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {broadcasts.map((b) => (
                  <div key={b.id} className="rounded-lg border border-border p-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-tight">{b.subject}</p>
                      <Badge variant="outline" className="text-xs shrink-0 bg-primary/10 text-primary border-primary/20">
                        {b.recipientType === "all" ? "All" : b.recipientType === "completed" ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{b.message}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{b.recipientCount.toLocaleString()} recipients</span>
                      <span>{formatNigerianDate(b.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
