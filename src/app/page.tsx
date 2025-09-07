import KeywordBadge from "@/app/components/ui/keyword-badge"
import Section from "@/app/components/ui/section"
import AboutUsSection from "@/app/components/sections/AboutUsSection"
import ContactUsSection from "@/app/components/sections/ContactUsSection"

const keywords = [
  "Antimicrobial Stewardship Programs (ASPs)",
  "Staffing Requirements", 
  "Evidence-Based Recommendations",
  "Time-in-Motion Study Data",
  "Tailored by Hospital Type & Size",
  "Full-Time Equivalents (FTEs)",
  "Implementation Science",
  "User-Friendly Web Tool"
]


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            SPARC — Stewardship Personnel required for Antimicrobial Stewardship Programs Resource Calculator
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Advancing Antimicrobial Stewardship
          </p>
          
          {/* Keywords */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center items-center">
              {keywords.map((keyword, index) => (
                <KeywordBadge key={index} label={keyword} />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* About Us Section */}
      <AboutUsSection />

      {/* Contact Us Section */}
      <ContactUsSection />

      {/* Access Section */}
      <Section id="access" title="Access" className="bg-slate-50">
        <div className="text-center">
          <a href="/app" className="btn">
            Open SPARC
          </a>
        </div>
      </Section>

      {/* Support Section */}
      <Section id="support" title="Support">
        <div className="text-center">
          <a 
            href="mailto:your-email@example.com"
            className="text-red-600 hover:text-red-700 underline"
          >
            your-email@example.com
          </a>
        </div>
      </Section>
    </div>
  )
}

export default LandingPage