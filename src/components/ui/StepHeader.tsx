interface StepHeaderProps {
  number: string;
  title: string;
  subtitle: string;
}

export function StepHeader({ number, title, subtitle }: StepHeaderProps) {
  return (
    <div className="mb-8">
      <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-fongit-navy text-white text-[13px] font-bold mb-3">
        {number}
      </div>
      <h2 className="font-display text-[28px] text-fongit-navy mb-1">
        {title}
      </h2>
      <p className="text-[15px] text-gray-500 leading-relaxed">{subtitle}</p>
    </div>
  );
}
