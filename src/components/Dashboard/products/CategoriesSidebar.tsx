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
    <div className={`w-64 bg-white rounded-lg border border-gray-200 p-4 h-fit ${className}`}>
      <h2 className="font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-2">
        {categories.map((c) => {
          const isExpanded = expandedKeys.includes(c.key)
          return (
            <button
              key={c.key}
              onClick={() => onToggle(c.key)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-sm text-gray-700">{c.label}</span>
              </div>
              {typeof c.count === "number" && (
                <span className="text-sm text-gray-500">{c.count}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
