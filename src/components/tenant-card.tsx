import { type Tenant, type FloorGroup } from "@/lib/floor-grouper";

const INDUSTRY_COLORS: Record<string, string> = {
  office: "bg-blue-100 text-blue-800 border-blue-200",
  retail: "bg-amber-100 text-amber-800 border-amber-200",
  medical: "bg-teal-100 text-teal-800 border-teal-200",
  food: "bg-orange-100 text-orange-800 border-orange-200",
  unknown: "bg-gray-100 text-gray-800 border-gray-200",
};

interface TenantCardProps {
  tenant: Tenant;
  onClick: () => void;
}

export function TenantCard({ tenant, onClick }: TenantCardProps) {
  const colorClass = INDUSTRY_COLORS[tenant.type] ?? INDUSTRY_COLORS.unknown;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{tenant.name}</h3>
          {tenant.suite && (
            <p className="mt-1 text-sm text-muted-foreground">
              Suite {tenant.suite}
            </p>
          )}
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {tenant.formatted_address}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}
        >
          {tenant.type}
        </span>
      </div>
    </div>
  );
}
