"use client";

interface InputProps {
  label: string;
  sublabel?: string;
  required?: boolean;
  type?: "text" | "email" | "month" | "textarea";
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
}

export function Input({
  label,
  sublabel,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
}: InputProps) {
  const baseClasses =
    "w-full px-3.5 py-3 border-[1.5px] border-gray-200 rounded-md text-[15px] " +
    "transition-colors duration-200 outline-none bg-white " +
    "focus:border-fongit-navy placeholder:text-gray-400";

  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-800 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {sublabel && (
        <p className="text-[13px] text-gray-500 mb-2 leading-relaxed">
          {sublabel}
        </p>
      )}
      {type === "textarea" ? (
        <textarea
          className={`${baseClasses} resize-y`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          rows={4}
        />
      ) : (
        <input
          type={type}
          className={baseClasses}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </div>
  );
}
