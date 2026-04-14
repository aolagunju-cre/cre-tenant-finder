"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Tenant } from "@/lib/floor-grouper";

interface TenantDetailProps {
  tenant: Tenant | null;
  open: boolean;
  onClose: () => void;
}

export function TenantDetail({ tenant, open, onClose }: TenantDetailProps) {
  if (!tenant) return null;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{tenant.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p className="mt-1 text-sm">{tenant.formatted_address}</p>
          </div>
          {tenant.suite && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Suite</p>
              <p className="mt-1 text-sm">{tenant.suite}</p>
            </div>
          )}
          {tenant.floor !== null && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Floor</p>
              <p className="mt-1 text-sm">{tenant.floor}</p>
            </div>
          )}
          {tenant.phone && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="mt-1 text-sm">{tenant.phone}</p>
            </div>
          )}
          {tenant.website && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Website</p>
              <a
                href={tenant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-blue-600 hover:underline"
              >
                {tenant.website}
              </a>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Industry</p>
            <p className="mt-1 text-sm capitalize">{tenant.type}</p>
          </div>
          {tenant.business_status && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Business Status
              </p>
              <p className="mt-1 text-sm">{tenant.business_status}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
