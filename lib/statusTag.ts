import type { FieldStatus } from "@/lib/types";

export function tagClassFor(status: FieldStatus): string {
  if (status === "위험") return "tag tag-accent";
  if (status === "주의") return "tag tag-neutral";
  return "tag tag-outline";
}
