import { CONTACT_EMAILS } from "@/lib/contact-emails"
import ContactMessageForm from "@/app/components/ContactMessageForm"

const accent = "#D25555"

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

const faqs = [
  {
    q: "How accurate is SPARC?",
    a: "SPARC is built on extensive time-in-motion studies and peer-reviewed research. Our calculations have been validated across many healthcare institutions.",
  },
  {
    q: "Is SPARC free to use?",
    a: "Yes. SPARC is offered to support antimicrobial stewardship programs and reduce barriers to evidence-based staffing guidance.",
  },
  {
    q: "Can I customize the calculations?",
    a: "You can enter your institutional data—including bed count, patient volume, and staffing context—to tailor recommendations to your setting.",
  },
  {
    q: "Do you offer training?",
    a: "We provide documentation and can connect you with resources for rollout. Reach out by email for partnership or training questions.",
  },
] as const

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(210,85,85,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(210,85,85,0.18),transparent)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:48px_48px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,white_50%,transparent)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-20 md:pb-24">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#D25555] dark:text-[#e87373] mb-4">
            SPARC Calculator
          </p>
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white text-balance max-w-3xl mx-auto leading-[1.1]">
            Contact{" "}
            <span className="text-[#D25555] dark:text-[#e87373]">our team</span>
          </h1>
          <p className="mt-6 text-center text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Questions about the calculator, stewardship staffing, or collaborations—we&apos;re happy
            to hear from you.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
            {CONTACT_EMAILS.map((addr) => (
              <a
                key={addr}
                href={`mailto:${addr}`}
                className="group inline-flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-5 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 shadow-sm hover:border-[#D25555]/40 hover:shadow-md hover:shadow-[#D25555]/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D25555] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D25555]/10 text-[#D25555] dark:bg-[#D25555]/20 dark:text-[#e87373]">
                  <MailIcon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[13px] sm:text-sm tracking-tight group-hover:text-[#D25555] dark:group-hover:text-[#e87373] transition-colors">
                  {addr}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main grid */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="grid gap-10 lg:gap-14 lg:grid-cols-12">
          {/* Left column — narrative + hours */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Get in touch
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
                We support teams implementing and scaling antimicrobial stewardship programs. Use the
                message form to reach us by email, or use the addresses above for a direct link.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <ClockIcon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Support hours</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-500">General inquiries</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-slate-500 dark:text-slate-500">Monday – Friday</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                    9:00 AM – 6:00 PM EST
                  </span>
                </li>
                <li className="flex justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-slate-500 dark:text-slate-500">Saturday</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                    10:00 AM – 2:00 PM EST
                  </span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-slate-500 dark:text-slate-500">Sunday</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">Closed</span>
                </li>
              </ul>
              <p className="mt-5 text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
                For urgent clinical systems issues, contact your institution&apos;s IT or internal
                support channels as applicable.
              </p>
            </div>
          </div>

          {/* Right column — message form + contact cards */}
          <div className="lg:col-span-7 space-y-4">
            <ContactMessageForm />

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 md:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D25555] to-[#B84444] text-white shadow-md shadow-[#D25555]/20">
                  <MailIcon className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Email</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Write us directly—we typically respond within a few business days.
                  </p>
                  <ul className="mt-5 space-y-2">
                    {CONTACT_EMAILS.map((addr) => (
                      <li key={addr}>
                        <a
                          href={`mailto:${addr}`}
                          className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2.5 -mx-3 text-sm font-mono text-[#D25555] dark:text-[#e87373] hover:bg-[#D25555]/5 dark:hover:bg-[#D25555]/10 hover:border-slate-200/80 dark:hover:border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D25555] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                        >
                          <span className="truncate">{addr}</span>
                          <svg
                            className="h-4 w-4 shrink-0 opacity-60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-sm max-w-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-4">
                <PhoneIcon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-slate-900 dark:text-white">Phone</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 tabular-nums">
                +1 (555) 123-4567
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Mon–Fri, 9 AM–6 PM EST</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12 md:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D25555] dark:text-[#e87373] mb-3">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
              Common questions
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Short answers about SPARC and how teams use it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {faqs.map(({ q, a }) => (
              <article
                key={q}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-transparent bg-slate-50/80 dark:bg-slate-900/60 p-6 md:p-7 pl-5 md:pl-6 transition-all hover:border-l-[#D25555] hover:border-[#D25555]/20 dark:hover:border-slate-700 dark:hover:border-l-[#e87373] hover:bg-white dark:hover:bg-slate-900"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-snug">
                  {q}
                </h3>
                <p className="mt-3 text-sm md:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {a}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA strip */}
      <section className="py-14 md:py-16 bg-gradient-to-br from-[#D25555] via-[#c75151] to-[#B84444]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-balance">
            Ready to explore staffing for your ASP?
          </h2>
          <p className="mt-3 text-red-100/95 text-base md:text-lg max-w-xl mx-auto">
            Open the calculator to enter your data and see evidence-based guidance.
          </p>
          <a
            href="/dashboard"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold shadow-lg hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#D25555]"
            style={{ color: accent }}
          >
            Go to data entry
            <span aria-hidden>→</span>
          </a>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
