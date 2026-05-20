"use client";

type StatCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subValue?: string;
  accent?: boolean;
};

export const StatCard = ({ icon: Icon, label, value, subValue, accent }: StatCardProps) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className={`text-2xl font-semibold font-mono ${
            accent ? "text-primary" : "text-foreground"
          }`}
        >
          {value}
        </span>

        {subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}
      </div>
    </div>
  );
};
