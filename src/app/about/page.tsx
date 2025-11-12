const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight text-balance">
              About <span className="text-[#D25555]">Us</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
              Advancing Antimicrobial Stewardship through Evidence-Based Staffing Solutions
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="max-w-3xl space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-balance">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                SPARC (Stewardship Personnel Required for Antimicrobial Stewardship Programs Resource Calculator)
                was developed to address the critical need for evidence-based staffing guidance in healthcare
                institutions implementing Antimicrobial Stewardship Programs (ASPs).
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our mission is to provide healthcare administrators and stewardship teams with data-driven
                tools that optimize staffing resources, improve patient outcomes, and ensure the effective
                implementation of antimicrobial stewardship initiatives.
              </p>
            </div>
            <div className="max-w-xl lg:pl-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                Funding Partner
              </h3>
              <div className="mt-4 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white px-8 py-7 shadow-md sm:flex-row sm:items-center sm:gap-8">
                <div className="flex items-center justify-center rounded-2xl bg-slate-50 px-6 py-4 sm:basis-44">
                  <img
                    src="/sidp-logo.png"
                    alt="Society of Infectious Diseases Pharmacists"
                    className="h-16 w-auto object-contain sm:h-20"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-base font-medium text-slate-700">
                    The SPARC calculator is made possible through generous support from the Society of Infectious Diseases Pharmacists.
                  </p>
                  <a
                    href="https://sidp.org/"
                    className="mt-3 inline-flex items-center text-sm font-semibold text-[#D25555] transition-colors hover:text-[#B84444]"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn more about SIDP
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-10 10m0-6v6h6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-balance">
              Our Team
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Led by experts in infectious diseases, antimicrobial stewardship, and healthcare administration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Team Member 1 - Amy Kang */}
            <div className="bg-slate-50 p-6 rounded-2xl text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform">
                <img
                  src="/Amy Kang.png"
                  alt="Amy Kang"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Amy Kang, PharmD, BCIDP</h3>
              <p className="text-[#D25555] font-semibold mb-3">Infectious Diseases Pharmacist</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Associate Professor at Chapman University School of Pharmacy and Infectious Diseases
                Pharmacist at Harbor-UCLA Medical Center, specializing in antimicrobial stewardship.
              </p>
              <div className="text-xs text-slate-500">
                <p>Chapman University School of Pharmacy</p>
                <p>Harbor-UCLA Medical Center</p>
              </div>
            </div>

            {/* Team Member 2 - Bradley J. Langford */}
            <div className="bg-slate-50 p-6 rounded-2xl text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform">
                <img
                  src="/Brad Langford.png"
                  alt="Bradley J. Langford"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Bradley J. Langford, PharmD, BCIDP, MPH</h3>
              <p className="text-[#D25555] font-semibold mb-3">Antimicrobial Stewardship Pharmacist</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Experienced antimicrobial stewardship pharmacist with expertise in clinical pharmacy
                practice and public health, specializing in optimizing antimicrobial use and resistance prevention.
              </p>
              <div className="text-xs text-slate-500">
                <p>McMaster University</p>
              </div>
            </div>

            {/* Team Member 3 - Elizabeth Leung */}
            <div className="bg-slate-50 p-6 rounded-2xl text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform">
                <img
                  src="/Elizabeth Leung.png"
                  alt="Elizabeth Leung"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Elizabeth Leung, PharmD, BCPS</h3>
              <p className="text-[#D25555] font-semibold mb-3">Infectious Diseases Clinical Pharmacist</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Infectious Diseases Clinical Pharmacist with expertise in antimicrobial stewardship
                and clinical pharmacy practice at the Leslie Dan Faculty of Pharmacy, University of Toronto.
              </p>
              <div className="text-xs text-slate-500">
                <p>Leslie Dan Faculty of Pharmacy, University of Toronto</p>
              </div>
            </div>

            {/* Team Member 4 - Poonam Bhatjire */}
            <div className="bg-slate-50 p-6 rounded-2xl text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform">
                <img
                  src="/Poonam Bhatjire.png"
                  alt="Poonam Bhatjire"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Poonam Bhatjire, MS, PhD</h3>
              <p className="text-[#D25555] font-semibold mb-3">Health Economics, Epidemiology, and Real-World Evidence Researcher</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Researcher specializing in health economics, epidemiology, and real-world evidence
                at Chapman University School of Pharmacy, contributing to evidence-based healthcare solutions.
              </p>
              <div className="text-xs text-slate-500">
                <p>Chapman University School of Pharmacy</p>
                <p>Health Economics & Epidemiology</p>
              </div>
            </div>

            {/* Team Member 5 - Karen Huynh */}
            <div className="bg-slate-50 p-6 rounded-2xl text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform">
                <img
                  src="/Karen Huynh.png"
                  alt="Karen Huynh"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Karen Huynh</h3>
              <p className="text-[#D25555] font-semibold mb-3">Pharmacy Student Researcher</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Pharmacy student researcher at Chapman University, contributing to antimicrobial
                stewardship research and supporting evidence-based healthcare initiatives.
              </p>
              <div className="text-xs text-slate-500">
                <p>Chapman University</p>
              </div>
            </div>

            {/* Team Member 6 - Seoyun Lim */}
            <div className="bg-slate-50 p-6 rounded-2xl text-center group hover:shadow-xl transition-all duration-300">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform">
                <img
                  src="/Seoyun Lim.png"
                  alt="Seoyun Lim"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Seoyun Lim</h3>
              <p className="text-[#D25555] font-semibold mb-3">Pharmacy Student Researcher</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Pharm.D. candidate at Chapman University School of Pharmacy, Class of 2027, with a strong
                interest in Infectious Diseases and Antimicrobial Stewardship research.
              </p>
              <div className="text-xs text-slate-500">
                <p>Chapman University School of Pharmacy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steering Committee Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-balance">
              Steering Committee Members
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              The SPARC calculator is guided by a multidisciplinary steering committee of pharmacists, researchers,
              and healthcare leaders dedicated to advancing antimicrobial stewardship.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Amy Kang, PharmD, BCIDP</h3>
              <p className="mt-2 text-sm text-slate-600">
                Infectious Diseases Pharmacist, Chapman University School of Pharmacy & Harbor-UCLA Medical Center
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Bradley J. Langford, PharmD, BCIDP, MPH</h3>
              <p className="mt-2 text-sm text-slate-600">
                Antimicrobial Stewardship Pharmacist, McMaster University
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Elizabeth Leung, PharmD, BCPS</h3>
              <p className="mt-2 text-sm text-slate-600">
                Infectious Diseases Clinical Pharmacist, Leslie Dan Faculty of Pharmacy, University of Toronto
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Poonam Bhatjire, MS, PhD</h3>
              <p className="mt-2 text-sm text-slate-600">
                Health Economics, Epidemiology, and Real-World Evidence Researcher, Chapman University School of Pharmacy
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Karen Huynh</h3>
              <p className="mt-2 text-sm text-slate-600">
                Pharmacy Student Researcher, Chapman University
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Seoyun Lim</h3>
              <p className="mt-2 text-sm text-slate-600">
                Pharm.D. Candidate, Chapman University School of Pharmacy
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
