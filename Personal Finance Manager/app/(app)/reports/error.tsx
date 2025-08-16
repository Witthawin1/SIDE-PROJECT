"use client"

export default function ReportsError({ error }: { error: Error }) {
  return <div className="p-4 text-red-600">{error.message}</div>
}
