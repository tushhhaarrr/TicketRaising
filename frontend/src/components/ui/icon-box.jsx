import React from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
    teal: "bg-teal-light text-primary",
    success: "bg-success-light text-success",
    warning: "bg-warning-light text-warning",
    info: "bg-info-light text-info",
    pending: "bg-pending-light text-pending",
    destructive: "bg-destructive/10 text-destructive",
};

const sizeStyles = {
    sm: "h-8 w-8 rounded-md",
    md: "h-10 w-10 rounded-lg",
    lg: "h-12 w-12 rounded-xl",
};

const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
};

export const IconBox = ({
    icon: Icon,
    variant = "teal",
    size = "md",
    className,
}) => {
    return (
        <div
            className={cn(
                "flex items-center justify-center",
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            <Icon className={iconSizes[size]} />
        </div>
    );
};
