// File: src/components/ui/SegmentedControl.jsx
export function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-[#E5E7EB] bg-gray-50 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors
            ${value === opt.id ? 'bg-white text-[#111827] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
