import Image from "next/image"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/sparc-logo.png"
                width={600}
                height={338}
                alt="SPARC Calculator"
                className="mx-auto h-36 w-auto md:h-40 lg:h-44 drop-shadow-lg"
                priority
              />
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight text-balance">
              Antimicrobial Stewardship
              <span className="block text-[#D25555] mt-2">Staffing Calculator</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Evidence-based staffing guidance for healthcare institutions implementing 
              Antimicrobial Stewardship Programs
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a 
                href="/dashboard" 
                className="group inline-flex items-center px-12 py-6 text-xl font-semibold text-white bg-[#D25555] rounded-2xl hover:bg-[#B84444] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D25555] focus-visible:ring-offset-2"
              >
                <span>Start Calculating</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a 
                href="#features" 
                className="inline-flex items-center px-12 py-6 text-xl font-semibold text-slate-700 bg-white border-2 border-slate-300 rounded-2xl hover:border-[#D25555] hover:text-[#D25555] transition-all duration-300 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D25555] focus-visible:ring-offset-2"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-balance">
              Why Choose SPARC?
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Built on evidence-based research and time-in-motion studies
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center p-10 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
              <div className="w-24 h-24 bg-gradient-to-br from-[#D25555] to-[#B84444] rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Evidence-Based</h3>
              <p className="text-lg text-slate-600 leading-relaxed">Built on peer-reviewed research and real-world data from leading healthcare institutions</p>
            </div>
            
            <div className="group text-center p-10 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
              <div className="w-24 h-24 bg-gradient-to-br from-[#D25555] to-[#B84444] rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Easy to Use</h3>
              <p className="text-lg text-slate-600 leading-relaxed">Intuitive interface designed specifically for healthcare professionals and administrators</p>
            </div>
            
            <div className="group text-center p-10 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100">
              <div className="w-24 h-24 bg-gradient-to-br from-[#D25555] to-[#B84444] rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Tailored Results</h3>
              <p className="text-lg text-slate-600 leading-relaxed">Customized recommendations based on your institution&apos;s size, type, and specific needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#D25555] via-[#C85A54] to-[#B84444] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 text-balance">
              Ready to Optimize Your Stewardship Program?
            </h2>
            <p className="text-lg md:text-xl text-red-100 mb-12 leading-relaxed font-medium max-w-3xl mx-auto">
              Join healthcare institutions using SPARC to make data-driven staffing decisions
            </p>
            <a 
              href="/dashboard" 
              className="group inline-flex items-center px-12 py-6 text-xl font-bold text-[#D25555] bg-white rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#D25555]"
            >
              <span>Get Started Now</span>
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}

export default LandingPage