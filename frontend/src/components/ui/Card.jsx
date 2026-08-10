// File: src/components/ui/Card.jsx
export function Card({ className = '', children }) {
  return (
    <div
      className={`rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(17,24,39,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

export function CardLabel({ children, icon: Icon }) {
  return (
    <div className="mb-3 flex items-center gap-1.5 text-[13px] font-medium text-gray-500">
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      <span>{children}</span>
    </div>
  );
}
