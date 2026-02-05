import React from "react";
import { cn } from "@/lib/utils";
import { IconBox } from "./icon-box";

export const StatCard = ({
    icon,
    value,
    label,
    trend,
    trendUp,
    variant = "teal",
    className,
}) => {
    return (
        <div
            className={cn(
                "relative bg-card rounded-xl p-5 shadow-card transition-all hover:shadow-card-hover",
                className
            )}
        >
            <div className="flex items-start justify-between">
                <IconBox icon={icon} variant={variant} size="md" />
                {trend && (
                    <span
                        className={cn(
                            "text-xs font-medium px-2 py-1 rounded-full",
                            trendUp
                                ? "bg-success-light text-success"
                                : "bg-destructive/10 text-destructive"
                        )}
                    >
                        {trend}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-3xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
        </div>
    );
};
