"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Tenant {
  name: string;
  suite: string;
  floor: number | null;
  phone: string;
  website: string;
  type: string;
  business_status: string;
  formatted_address: string;
  place_id: string;
}

interface SearchRecord {
  id: string;
  address: string;
  placeCount: number;
  createdAt: string;
  results: Tenant[];
}

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        setHistory(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  });

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Search History</h1>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : history.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No searches yet. Go back to{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              search for an address
            </Link>
            .
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Tenant Count</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.address}</TableCell>
                  <TableCell>{record.placeCount}</TableCell>
                  <TableCell>
                    {format(new Date(record.createdAt), "MMM d, yyyy h:mm a")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );
}
