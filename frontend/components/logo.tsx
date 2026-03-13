export function PennyPalLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: { container: "w-8 h-8", svg: "w-5 h-5" },
    md: { container: "w-10 h-10", svg: "w-6 h-6" },
    lg: { container: "w-12 h-12", svg: "w-7 h-7" },
  }

  const { container, svg } = sizeMap[size]

  return (
    <div
      className={`${container} bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg`}
    >
      <svg className={`${svg} text-white`} fill="currentColor" viewBox="0 0 24 24">
        {/* Wallet icon */}
        <path d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5z" />
        <path d="M3 7h18" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="17" cy="14" r="2" fill="currentColor" />
      </svg>
    </div>
  )
}
