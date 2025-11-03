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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-balance">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
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
            <div className="bg-gradient-to-br from-[#D25555] to-[#B84444] rounded-2xl p-8 text-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Evidence-Based Approach</h3>
                <p className="text-red-100 leading-relaxed">
                  Built on peer-reviewed research and time-in-motion studies from leading healthcare institutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Foundation */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-balance">
              Research Foundation
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              SPARC is built on extensive research and real-world implementation data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-14 h-14 bg-[#D25555] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Time-in-Motion Studies</h3>
              <p className="text-slate-600 leading-relaxed">
                Comprehensive analysis of stewardship activities across multiple healthcare settings, 
                measuring actual time requirements for core stewardship functions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-14 h-14 bg-[#D25555] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Peer-Reviewed Research</h3>
              <p className="text-slate-600 leading-relaxed">
                Based on published studies in leading medical journals, incorporating best practices 
                from successful stewardship programs worldwide.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-14 h-14 bg-[#D25555] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-World Validation</h3>
              <p className="text-slate-600 leading-relaxed">
                Tested and validated across diverse healthcare institutions, from small community 
                hospitals to large academic medical centers.
              </p>
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
                <p>PharmD, BCIDP</p>
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
              <h3 className="text-lg font-bold text-slate-900 mb-2">Bradley J. Langford</h3>
              <p className="text-[#D25555] font-semibold mb-3">Antimicrobial Stewardship Pharmacist</p>
              <p className="text-slate-600 leading-relaxed mb-3 text-sm">
                Experienced antimicrobial stewardship pharmacist with expertise in clinical pharmacy 
                practice and public health, specializing in optimizing antimicrobial use and resistance prevention.
              </p>
              <div className="text-xs text-slate-500">
                <p>BScPhm, PharmD, MPH</p>
                <p>Antimicrobial Stewardship Specialist</p>
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
                <p>PharmD, BCPS</p>
                <p>Leslie Dan Faculty of Pharmacy</p>
                <p>University of Toronto</p>
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
                <p>MS, PhD</p>
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
                <p>Pharmacy Student Researcher</p>
                <p>Chapman University</p>
                <p>Antimicrobial Stewardship Research</p>
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
                <p>Pharm.D. Candidate Class of 2027</p>
                <p>Chapman University School of Pharmacy</p>
                <p>Infectious Diseases & Antimicrobial Stewardship</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gradient-to-r from-[#D25555] to-[#B84444]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-balance">
            Our Impact
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-red-100">Healthcare Institutions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">25%</div>
              <div className="text-red-100">Average Cost Reduction</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-red-100">User Satisfaction</div>
            </div>
          </div>

          <p className="text-lg text-red-100 max-w-3xl mx-auto leading-relaxed">
            SPARC has helped healthcare institutions optimize their antimicrobial stewardship 
            programs, leading to improved patient outcomes and more efficient resource utilization.
          </p>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
