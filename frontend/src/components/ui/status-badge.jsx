import React from "react";
import { cn } from "@/lib/utils";

const statusStyles = {
    "Pending": "bg-pending-light text-pending",
    "In Progress": "bg-info-light text-info",
    "Resolved": "bg-success-light text-success",
    "On Hold": "bg-warning-light text-warning",
    // Keep lowercase for fallback/legacy if needed
    pending: "bg-pending-light text-pending",
    processing: "bg-info-light text-info",
    resolved: "bg-success-light text-success",
    "on-hold": "bg-warning-light text-warning",
};

const statusLabels = {
    "Pending": "Pending",
    "In Progress": "In Progress",
    "Resolved": "Resolved",
    "On Hold": "On Hold",
    // Keep lowercase for fallback
    pending: "Pending",
    processing: "Processing",
    resolved: "Resolved",
    "on-hold": "On Hold",
};

export const StatusBadge = ({ status, className }) => {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                statusStyles[status],
                className
            )}
        >
            {statusLabels[status]}
        </span>
    );
};
