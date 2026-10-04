import { cn } from "@/lib/utils";
import React from "react";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: React.ReactNode;
  heading: React.ReactNode;
  description?: React.ReactNode;
  alignment?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  heading,
  description,
  alignment = "left",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-4",
        alignment === "center" && "text-center items-center",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-primary">
        {heading}
      </h2>
      {description && (
        <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
