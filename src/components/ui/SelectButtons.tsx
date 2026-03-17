"use client";

interface SelectButtonsProps {
  label: string;
  sublabel?: string;
  options: readonly string[];
  value?: string | string[];
  onChange?: (val: string | string[]) => void;
  multi?: boolean;
}

export function SelectButtons({
  label,
  sublabel,
  options,
  value,
  onChange,
  multi = false,
}: SelectButtonsProps) {
  const selected = multi ? (Array.isArray(value) ? value : []) : value;

  const handleClick = (opt: string) => {
    if (multi) {
      const arr = Array.isArray(selected) ? selected : [];
      const next = arr.includes(opt)
        ? arr.filter((v) => v !== opt)
        : [...arr, opt];
      onChange?.(next);
    } else {
      onChange?.(opt === value ? "" : opt);
    }
  };

  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-800 mb-1">
        {label}
      </label>
      {sublabel && (
        <p className="text-[13px] text-gray-500 mb-2.5 leading-relaxed">
          {sublabel}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = multi
            ? Array.isArray(selected) && selected.includes(opt)
            : selected === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleClick(opt)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium border-[1.5px] transition-all duration-200 ${
                isActive
                  ? "border-fongit-navy bg-fongit-navy text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {isActive && multi && "✓ "}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
