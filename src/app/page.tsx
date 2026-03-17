import Link from "next/link";
import { FongitLogo } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <FongitLogo />
        <Link
          href="/admin"
          className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
        >
          🔒 Admin
        </Link>
      </header>

      {/* Hero */}
      <main className="max-w-xl mx-auto text-center pt-20 px-6">
        <div className="text-[13px] font-semibold tracking-[3px] uppercase text-gray-500 mb-4">
          Application Portal
        </div>

        <h1 className="font-display text-[42px] leading-tight text-fongit-navy mb-4">
          Let&apos;s build
          <br />
          something great.
        </h1>

        <p className="text-base leading-relaxed text-gray-600 max-w-md mx-auto mb-10">
          At FONGIT, we support entrepreneurs with expertise, resources, and
          financing to transform innovative ideas into sustainable Swiss
          companies.
        </p>

        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <Link href="/apply" className="btn-primary text-center text-base py-4">
            Apply as a Company / Team
          </Link>
          <Link
            href="/apply?solo=true"
            className="btn-secondary text-center text-base py-4"
          >
            It&apos;s just me — solo founder
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 flex justify-center gap-10 text-[13px] text-gray-500">
          <div>
            <strong className="text-xl text-fongit-navy block">Fr 100K</strong>
            funding per team
          </div>
          <div className="w-px bg-gray-200" />
          <div>
            <strong className="text-xl text-fongit-navy block">50+</strong>
            startups / year
          </div>
          <div className="w-px bg-gray-200" />
          <div>
            <strong className="text-xl text-fongit-navy block">35y</strong>
            track record
          </div>
        </div>

        {/* Info box */}
        <div className="mt-10 px-5 py-4 bg-gray-100 rounded-md text-[13px] text-gray-600 leading-relaxed">
          ◆ Prepare your pitch deck and any supporting documents before
          starting.
          <br />
          Your data is processed in compliance with GDPR standards and treated
          confidentially.
        </div>
      </main>
    </div>
  );
}
