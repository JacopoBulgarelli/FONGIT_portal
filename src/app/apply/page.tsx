"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { FongitLogo } from "@/components/ui";
import { APPLICATION_STEPS } from "@/lib/constants";
import { useApplicationStore } from "@/lib/form-store";
import {
  StepCompany,
  StepTeam,
  StepProject,
  StepMarketIP,
  StepFongitFit,
  StepDocuments,
  StepReview,
} from "@/components/steps";

const STEP_COMPONENTS: Record<string, React.FC> = {
  company: StepCompany,
  team: StepTeam,
  project: StepProject,
  market: StepMarketIP,
  support: StepFongitFit,
  documents: StepDocuments,
  review: StepReview,
};

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { company, team, project, marketIP, fongitFit, documents, reset } =
    useApplicationStore();

  const step = APPLICATION_STEPS[currentStep];
  const isReview = step.id === "review";
  const StepComponent = STEP_COMPONENTS[step.id];

  const goTo = (index: number) => {
    setCurrentStep(index);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, team, project, marketIP, fongitFit, documents }),
      });
      reset();
      setSubmitted(true);
      setCurrentStep(0);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-10 bg-gray-50">
        <div className="animate-fade-up text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6 text-3xl text-green-700">
            ✓
          </div>
          <h1 className="font-display text-4xl text-fongit-navy mb-3">
            Application Submitted
          </h1>
          <p className="text-base leading-relaxed text-gray-600 mb-8">
            Thank you for applying to FONGIT. Our team will review your
            application and get back to you soon. All information is treated
            confidentially.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setCurrentStep(0);
              }}
              className="btn-primary"
            >
              Submit Another
            </button>
            <Link href="/admin" className="btn-secondary">
              View Admin Dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Navy Sidebar (fixed) ── */}
      <aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-fongit-navy flex flex-col py-7 z-10">
        {/* Logo */}
        <div className="px-6 mb-9">
          <FongitLogo size={24} variant="light" />
          <div className="text-[11px] text-white/40 mt-1.5 tracking-widest uppercase font-medium">
            Application Portal
          </div>
        </div>

        {/* Step nav */}
        <nav className="flex-1">
          {APPLICATION_STEPS.map((s, i) => {
            const isActive = currentStep === i;
            const isDone = currentStep > i;
            return (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 border-l-[3px] border-white"
                    : "border-l-[3px] border-transparent"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-fongit-navy"
                      : isDone
                        ? "bg-white/25 text-white"
                        : "bg-white/[0.08] text-white/40"
                  }`}
                >
                  {isDone ? "✓" : s.icon}
                </div>
                <span
                  className={`text-sm ${
                    isActive
                      ? "font-semibold text-white"
                      : "font-normal text-white/50"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Admin link */}
        <div className="px-6">
          <Link
            href="/admin"
            className="block w-full py-2.5 text-center bg-white/[0.08] border border-white/[0.12] rounded-md text-xs font-medium text-white/50 hover:bg-white/[0.12] transition-colors"
          >
            🔒 Admin Dashboard
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main ref={contentRef} className="flex-1 ml-[260px] overflow-auto">
        <div className="max-w-[680px] mx-auto px-6 py-10 pb-32">
          {StepComponent && <StepComponent />}
        </div>

        {/* ── Bottom Navigation Bar ── */}
        <div className="fixed bottom-0 right-0 left-[260px] px-8 py-4 bg-gray-50/90 backdrop-blur-md border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => currentStep > 0 && goTo(currentStep - 1)}
            disabled={currentStep === 0}
            className="btn-secondary disabled:opacity-30"
          >
            ← Back
          </button>

          <span className="text-[13px] text-gray-500">
            Step {currentStep + 1} of {APPLICATION_STEPS.length}
          </span>

          {isReview ? (
            <button onClick={handleSubmit} disabled={submitting} className="btn-success disabled:opacity-50">
              {submitting ? "Submitting…" : "Submit Application ✓"}
            </button>
          ) : (
            <button
              onClick={() => goTo(currentStep + 1)}
              className="btn-primary"
            >
              Continue →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
