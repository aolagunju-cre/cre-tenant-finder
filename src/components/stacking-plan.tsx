import type { Tenant, FloorGroup } from "@/lib/floor-grouper";
import { INDUSTRY_COLORS } from "@/lib/floor-grouper";

const FLOOR_COLORS: Record<string | number, string> = {
  ground: "bg-green-50 border-green-200",
  1: "bg-green-50 border-green-200",
  2: "bg-blue-50 border-blue-200",
  3: "bg-purple-50 border-purple-200",
  4: "bg-pink-50 border-pink-200",
  5: "bg-orange-50 border-orange-200",
  unknown: "bg-gray-50 border-gray-200",
};

interface StackingPlanProps {
  floors: FloorGroup[];
  onTenantClick: (tenant: Tenant) => void;
}

export function StackingPlan({ floors, onTenantClick }: StackingPlanProps) {
  if (!floors.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Stacking Plan</h2>
      <div className="space-y-3">
        {floors.map((floor) => {
          const isUnknown = floor.floor === "unknown";
          const rowColor =
            FLOOR_COLORS[floor.floor as string] ??
            (typeof floor.floor === "number"
              ? `bg-slate-50 border-slate-200`
              : "bg-gray-50 border-gray-200");

          return (
            <div
              key={String(floor.floor)}
              className={`rounded-lg border p-3 ${rowColor}`}
            >
              <div className="mb-2 text-sm font-medium">
                {isUnknown ? "Unparsed Suites" : `Floor ${floor.floor}`}
              </div>
              <div className="flex flex-wrap gap-2">
                {floor.tenants.map((tenant) => {
                  const colorClass =
                    INDUSTRY_COLORS[tenant.type] ?? INDUSTRY_COLORS.unknown;
                  return (
                    <button
                      key={tenant.place_id}
                      onClick={() => onTenantClick(tenant)}
                      className={`max-w-[160px] rounded-full border px-3 py-1 text-xs font-medium ${colorClass} truncate`}
                      title={tenant.name}
                    >
                      {tenant.suite ? `${tenant.suite}: ` : ""}
                      {tenant.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
