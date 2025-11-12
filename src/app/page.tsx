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
                <span>Enter Your Data</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a 
                href="/about" 
                className="inline-flex items-center px-12 py-6 text-xl font-semibold text-slate-700 bg-white border-2 border-slate-300 rounded-2xl hover:border-[#D25555] hover:text-[#D25555] transition-all duration-300 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D25555] focus-visible:ring-offset-2"
              >
                Learn More
              </a>
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