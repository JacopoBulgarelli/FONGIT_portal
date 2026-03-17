"use client";

import { Input, FileUpload, StepHeader } from "@/components/ui";
import { useApplicationStore } from "@/lib/form-store";

export function StepDocuments() {
  const { documents, setDocuments } = useApplicationStore();

  return (
    <div className="animate-slide-in">
      <StepHeader
        number="06"
        title="Documents"
        subtitle="Upload your pitch deck and any supporting materials."
      />

      <FileUpload
        label="Pitch Deck"
        sublabel="Your primary slide deck (PDF or PPT preferred)."
      />

      <FileUpload
        label="Additional Documentation"
        sublabel="Executive summary, business model, lean canvas, or any other relevant documents. You can upload a .zip for multiple files."
      />

      <Input
        label="Product Video URL"
        placeholder="https://youtube.com/..."
        sublabel="Optional — a demo or product walkthrough."
        value={documents.productVideoUrl}
        onChange={(v) => setDocuments({ productVideoUrl: v })}
      />

      <Input
        label="Team Video URL"
        placeholder="https://..."
        sublabel="Optional — introduce your founding team."
        value={documents.teamVideoUrl}
        onChange={(v) => setDocuments({ teamVideoUrl: v })}
      />
    </div>
  );
}
