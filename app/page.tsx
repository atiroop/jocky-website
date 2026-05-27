import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-parchment)" }}>

      {/* ── Header ── */}
      <header className="px-8 pt-10 pb-0">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <span className="label">Est. 2025</span>
          <Link
            href="/blog"
            className="label hover:text-[var(--color-ink)] transition-colors"
          >
            Journal →
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1 flex items-center px-8 py-24">
        <div className="mx-auto max-w-5xl w-full">

          {/* Thin top rule */}
          <div className="mb-10 h-px bg-[var(--color-border)]" />

          {/* Masthead */}
          <div className="mb-8">
            <p className="label mb-5" style={{ color: "var(--color-gold)" }}>
              Personal Journal
            </p>
            <h1
              className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-none tracking-tight"
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontWeight: 300,
                color: "var(--color-ink)",
              }}
            >
              Jocky
            </h1>
          </div>

          {/* Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            <div>
              <p
                className="text-xl leading-relaxed"
                style={{
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--color-ink-light)",
                  fontSize: "1.35rem",
                }}
              >
                พื้นที่สำหรับบันทึกความคิด บทความ เรื่องเล่า และไอเดียส่วนตัว
              </p>
            </div>
            <div className="flex items-end">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-3 border-b pb-1 transition-colors"
                style={{
                  borderColor: "var(--color-gold)",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.875rem",
                  letterSpacing: "0.08em",
                }}
              >
                <span>Read the journal</span>
                <span
                  className="transition-transform group-hover:translate-x-1"
                  style={{ color: "var(--color-gold)" }}
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom rule */}
          <div className="mt-20 h-px bg-[var(--color-border)]" />
          <div className="mt-4 flex justify-between items-center">
            <span className="label">jocky.website</span>
            <span className="label">เต้อ</span>
          </div>
        </div>
      </main>
    </div>
  );
}
