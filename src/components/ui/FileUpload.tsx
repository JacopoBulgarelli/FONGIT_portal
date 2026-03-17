"use client";

import { useState, useCallback } from "react";

interface FileUploadProps {
  label: string;
  sublabel?: string;
  accept?: string;
  onFile?: (file: File) => void;
}

export function FileUpload({
  label,
  sublabel,
  accept = ".pdf,.ppt,.pptx,.doc,.docx,.zip",
  onFile,
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        onFile?.(file);
      }
    },
    [onFile]
  );

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
      <label
        className={`block border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all duration-200 ${
          fileName
            ? "border-green-500 bg-green-50"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />
        {fileName ? (
          <div className="text-green-700 text-sm font-medium">
            ✓ {fileName}
            <div className="text-xs text-gray-500 mt-1">Click to replace</div>
          </div>
        ) : (
          <div>
            <div className="text-2xl mb-1 opacity-30">↑</div>
            <div className="text-sm text-gray-500">
              Drop file here or{" "}
              <span className="text-fongit-navy font-semibold underline">
                browse
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              PDF, PPT, DOC, ZIP — Max 30MB
            </div>
          </div>
        )}
      </label>
    </div>
  );
}
