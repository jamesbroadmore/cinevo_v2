import { cn } from "@/lib/utils";

export function Logo({
  size = "md",
  className,
  tagline = true,
  dynamic = false,
}: {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  tagline?: boolean;
  dynamic?: boolean;
}) {
  const showTag = tagline && size !== "sm";
  return (
    <span className={cn("brand", `brand--${size}`, dynamic && "brand--dynamic", className)}>
      <span className="brand__mark" aria-hidden="true">
        <i />
      </span>
      <span>
        <b>CINEVO</b>
        {showTag ? <small>Private cinema, reinvented</small> : null}
      </span>
    </span>
  );
}
