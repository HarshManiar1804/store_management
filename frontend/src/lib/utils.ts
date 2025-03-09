import { clsx, type ClassValue } from "clsx"
import { BarChart } from "lucide-react";
import { Calendar } from "lucide-react";
import { Package } from "lucide-react";
import { Store } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface iSalesData {
    week: string;
    salesUnits: number;
}

export interface iSKU {
    sku_id: string;
    sku_name: string;
    price: number;
    cost: number;
    salesData: iSalesData[];
}

export interface iSKUData {
    data: Record<string, iSKU>;
}

export interface iStore {
    id: string;
    label: string;
    city: string;
    state: string;
}

export interface iSKU {
    id: string;
    label: string;
    class: string;
    department: string;
    price: number;
    cost: number;
}

export interface iSKUFormData {
    id: string;
    label: string;
    class: string;
    department: string;
    price: number;
    cost: number;
}


export interface iStoreFormData {
    id: string;
    label: string;
    city: string;
    state: string;
}

export const routes = [
    {   
      path: '/store',
      name: 'Store',
      icon: Store
    },
    {
      path: '/skus',
      name: 'SKUs',
      icon: Package
    },
    {
      path: '/planning',
      name: 'Planning',
      icon: Calendar
    },
    {
      path: '/charts',
      name: 'Charts',
      icon: BarChart
    },
  ];
  