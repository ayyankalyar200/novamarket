'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Eye,
  Star,
  LucideIcon,
} from 'lucide-react'

// =======================
// Icon Map (string -> component)
// =======================
const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Eye,
  Star,
}

// =======================
// Revenue Line Chart
// =======================
export function RevenueChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#9333ea"
          fillOpacity={1}
          fill="url(#colorRevenue)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// =======================
// Orders Bar Chart
// =======================
export function OrdersChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="orders" fill="#9333ea" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// =======================
// Category Pie Chart
// =======================
const COLORS = ['#9333ea', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff', '#f3e8ff']

export function CategoryChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
        >
          {data.map((_: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

// =======================
// Stats Card - Icon as string
// =======================
export function StatsCard({
  title,
  value,
  change,
  iconName,
  color = "purple",
}: {
  title: string
  value: string | number
  change?: string
  iconName: keyof typeof ICON_MAP
  color?: string
}) {
  const colorClasses = {
    purple: "from-purple-500 to-purple-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    pink: "from-pink-500 to-pink-600",
  }

  const bg = colorClasses[color as keyof typeof colorClasses] || colorClasses.purple
  const Icon = ICON_MAP[iconName] || DollarSign

  return (
    <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-gradient-to-br ${bg} p-3 rounded-lg text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
