import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Mail, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  status: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:     { label: "Pending",     color: "bg-amber-100 text-amber-700 border-amber-200",   icon: <Clock className="h-3 w-3" /> },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-200",      icon: <Loader2 className="h-3 w-3" /> },
  resolved:    { label: "Resolved",    color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="h-3 w-3" /> },
};

export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Message | null>(null);

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] });

  const deleteMessage = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/messages/${id}`, { method: "DELETE", credentials: "include" });
    },
    onSuccess: () => { toast({ title: "Message deleted" }); invalidate(); },
    onError: () => toast({ variant: "destructive", title: "Failed to delete message" }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => { invalidate(); },
    onError: () => toast({ variant: "destructive", title: "Failed to update status" }),
  });

  if (isLoading) {
    return <AdminLayout><div>Loading...</div></AdminLayout>;
  }

  const statusInfo = (s: string) => STATUS_LABELS[s] ?? STATUS_LABELS.pending;

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contact Messages</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {messages?.filter(m => m.status === "pending").length ?? 0} pending · {messages?.filter(m => m.status === "resolved").length ?? 0} resolved
          </p>
        </div>
      </div>

      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[30%]">Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              messages?.map((msg) => {
                const si = statusInfo(msg.status);
                return (
                  <TableRow key={msg.id} className={msg.status === "resolved" ? "opacity-60" : ""}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {format(new Date(msg.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">{msg.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{msg.email}</TableCell>
                    <TableCell>
                      <button
                        className="text-left max-w-xs truncate block text-sm hover:text-primary transition-colors"
                        title="Click to read full message"
                        onClick={() => setSelected(msg)}
                      >
                        {msg.message}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={msg.status || "pending"}
                        onValueChange={(val) => updateStatus.mutate({ id: msg.id, status: val })}
                      >
                        <SelectTrigger className={`w-36 h-7 text-xs border rounded-full px-3 ${si.color}`}>
                          <div className="flex items-center gap-1.5">
                            {si.icon}
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-amber-500" /> Pending</div>
                          </SelectItem>
                          <SelectItem value="in_progress">
                            <div className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 text-blue-500" /> In Progress</div>
                          </SelectItem>
                          <SelectItem value="resolved">
                            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Resolved</div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild title="Reply via email">
                          <a href={`mailto:${msg.email}?subject=Re: Your message to Fredora Multiconcept`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete message?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the message from {msg.name}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteMessage.mutate(msg.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Full message dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selected?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Email: </span>
              <a href={`mailto:${selected?.email}`} className="text-primary hover:underline">{selected?.email}</a>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Date: </span>
              {selected && format(new Date(selected.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </div>
            <div className="mt-4 bg-muted/50 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {selected?.message}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a href={`mailto:${selected?.email}?subject=Re: Your message to Fredora Multiconcept`}>
                <Mail className="h-4 w-4" /> Reply via Email
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
