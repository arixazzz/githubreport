"use client";
import ComposedChartExample from "@/components/charts/composedChartExample";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { Card } from "@/components/ui/card";
import React from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  Bar,
  Line,
} from "recharts";
export default function Page() {
  return (
    <div>
      <BreadcrumbSetItem
        items={[
          {
            title: "Dashboard",
          },
        ]}
      />
      <Card>
        <h1 className="text-2xl font-bold ">Welcome to the Dashboard</h1>
      </Card>

      <div className="mt-6 ml-10 mr-10 mb-10 p-4 bg-white rounded-lg shadow-md">
        <ComposedChartExample />
      </div>
    </div>
  );
}
