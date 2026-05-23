import { useState, useMemo } from "react";
import { useListPayments, getListPaymentsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatNigerianDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Download, X } from "lucide-react";

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");

  const { data: payments, isLoading, isError } = useListPayments({
    query: { queryKey: getListPaymentsQueryKey() }
  });

  const filtered = useMemo(() => {
    if (!payments) return [];
    return payments.filter((p) => {
      const s = search.toLowerCase();
      const matchesSearch = !s || (
        (p.paystackRef?.toLowerCase().includes(s)) ||
        (p.product?.toLowerCase().includes(s)) ||
        (p.userId?.toLowerCase().includes(s))
      );
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesProduct = productFilter === "all" || p.product === productFilter;
      return matchesSearch && matchesStatus && matchesProduct;
    });
  }, [payments, search, statusFilter, productFilter]);

  const products = useMemo(() => {
    if (!payments) return [];
    return Array.from(new Set(payments.map((p) => p.product).filter(Boolean)));
  }, [payments]);

  const handleExport = () => window.open("/api/admin/export/payments", "_blank");
  const hasFilters = search || statusFilter !== "all" || productFilter !== "all";
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); setProductFilter("all"); };

  if (isError) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Failed to load payments</h2>
          <p className="text-sm text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments</h1>
          <p className="text-muted-foreground">Track revenue and payment status across all products.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>A complete log of all Paystack transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reference, product, user..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Product" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products.map((p) => (
                  <SelectItem key={p!} value={p!}>{p!.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center gap-1">
                <X className="h-3.5 w-3.5" />Clear
              </Button>
            )}
            <span className="text-sm text-muted-foreground ml-auto">{filtered.length} records</span>
          </div>

          {isLoading ? (
            <div className="space-y-4">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center">No payments match your filters.</TableCell></TableRow>
                ) : (
                  filtered.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">{payment.paystackRef || payment.id.substring(0, 8)}</TableCell>
                      <TableCell className="capitalize">{payment.product?.replace(/_/g, ' ') || '—'}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{payment.userId ? payment.userId.substring(0, 8) : '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          payment.status === 'success' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                          payment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                          'bg-red-500/10 text-red-600 border-red-500/20'
                        }>{payment.status}</Badge>
                      </TableCell>
                      <TableCell>{formatNigerianDate(payment.createdAt)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(payment.amount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
