type SteeringCommitteeMember = {
  name: string
  /** Professional role or title line under the name */
  role?: string
  organization?: string
  /** Optional longer description (e.g. areas of expertise) */
  bio?: string
}

const steeringCommitteeMembers: SteeringCommitteeMember[] = [
  { name: "Amy Kang, PharmD", organization: "Chapman School of Pharmacy" },
  { name: "Brad Langford, PharmD", organization: "University of Toronto" },
  {
    name: "Beth Leung, PharmD",
    organization: "University of Toronto/Unity Health",
  },
  { name: "Priya Nori, MD", organization: "Montefiore Health System" },
  { name: "Michael Bolaris, MD", organization: "LA County – DHS" },
  {
    name: "Star (Estrella) Cervantes, PharmD, BCPS, AAHIVP",
    role: "Infectious Disease - Antimicrobial Stewardship Pharmacist",
    organization:
      "Project Administrator\nHealthcare Settings Program | Disease Control Bureau",
  },
  {
    name: "Marcia Glick, PharmD",
    organization: "California/LA County Department of Public Health",
  },
  {
    name: "Rekha Murthy, MD",
    organization: "California/LA County Department of Public Health",
  },
  {
    name: "Melinda Neuhauser, PharmD",
    organization: "Centers for Disease Control and Prevention",
  },
  { name: "Kevin Brown, PhD", organization: "University of Toronto" },
  { name: "Christina Rivera, PharmD", organization: "Mayo Clinic" },
  { name: "Valerie Leung, PharmD", organization: "Public Health Ontario" },
  { name: "William Simmons, MD", organization: "UCSF" },
  {
    name: "Julianne Joo, PharmD",
    organization: "Harbor-UCLA Medical Center",
  },
  { name: "Loren Miller, MD", organization: "UCLA/Lundquist Institute" },
  {
    name: "Betsy Hirsch, Pharm D",
    organization: "University of Minnesota College of Pharmacy",
  },
  {
    name: "Kelly Echevarria, PharmD, BCIDP",
    role: "Infectious Diseases Pharmacist",
    organization: "National Program Expert for Clinical Stewardship Solutions, Bitscopic",
    bio: "Infectious Diseases Pharmacist with expertise in enterprise-level antimicrobial stewardship program management, formulary management and clinical surveillance software for antimicrobial stewardship.",
  },
  { name: "Stephanie May" },
  {
    name: "Eric Lofgren, PhD",
    organization: "Associate Professor Washington State University",
  },
  { name: "Kevin Schwartz, MD" },
  { name: "David Ha, PharmD" },
]

const AboutPage = () => {
  const renderCommitteeMember = (member: SteeringCommitteeMember) => {
    const orgLines =
      member.organization && member.organization.trim().length > 0
        ? member.organization
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
        : []

    return (
      <article
        key={member.name}
        className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition-shadow hover:shadow-md flex flex-col h-full"
      >
        <h3 className="text-base font-semibold text-slate-900 leading-snug">{member.name}</h3>
        {member.role && (
          <p className="mt-2 text-sm font-medium text-slate-700 leading-snug">{member.role}</p>
        )}
        <div className="mt-4 space-y-3 text-sm flex-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Organization</p>
            {orgLines.length > 0 ? (
              <div className="text-slate-700 leading-relaxed space-y-1">
                {orgLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            ) : (
              <p className="text-slate-700 leading-relaxed">—</p>
            )}
          </div>
          {member.bio && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">About</p>
              <p className="text-slate-600 leading-relaxed">{member.bio}</p>
            </div>
          )}
        </div>
      </article>
    )
  }

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
            <div className="max-w-2xl lg:pl-6">
              <div className="flex flex-col gap-8 rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 px-10 py-10 shadow-lg sm:flex-row sm:items-center sm:gap-10">
                <div className="flex items-center justify-center rounded-2xl bg-white px-10 py-8 shadow-sm border border-slate-100 sm:basis-64">
                  <img
                    src="/sidp-logo.png"
                    alt="Society of Infectious Diseases Pharmacists"
                    className="h-32 w-auto object-contain sm:h-40 md:h-44 lg:h-48"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-4">
                  <p className="text-lg font-medium text-slate-800 leading-relaxed">
                    The SPARC calculator is made possible through generous support from the Society of Infectious Diseases Pharmacists.
                  </p>
                  <a
                    href="https://sidp.org/"
                    className="inline-flex items-center text-base font-semibold text-[#D25555] transition-colors hover:text-[#B84444] hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn more about SIDP
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              Core Team Members
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {steeringCommitteeMembers.map(renderCommitteeMember)}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
