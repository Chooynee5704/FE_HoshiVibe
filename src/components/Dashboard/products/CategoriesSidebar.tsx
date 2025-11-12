// src/components/Dashboard/products/CategoriesSidebar.tsx
"use client"

import { ChevronDown, ChevronRight } from "lucide-react"

export type CategoryItem = {
  key: string
  label: string
  count?: number
}

type Props = {
  title?: string
  categories: CategoryItem[]
  expandedKeys: string[]
  onToggle: (key: string) => void
  className?: string
}

export default function CategoriesSidebar({
  title = "Danh mục sản phẩm",
  categories,
  expandedKeys,
  onToggle,
  className = "",
}: Props) {
  return (
    <div className={`w-64 bg-white rounded-lg border border-gray-200 p-6 h-fit ${className}`}>
      <h2 className="font-bold text-black text-lg mb-4 pb-3 border-b border-gray-200">{title}</h2>
      <div className="space-y-1">
        {categories.map((c) => {
          const isExpanded = expandedKeys.includes(c.key)
          return (
            <button
              key={c.key}
              onClick={() => onToggle(c.key)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors rounded font-medium"
            >
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                )}
                <span className="text-sm text-gray-900 font-medium">{c.label}</span>
              </div>
              {typeof c.count === "number" && (
                <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">{c.count}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
