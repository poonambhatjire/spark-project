"use client"

import { useState } from "react"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', organization: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight text-balance">
              Contact <span className="text-[#D25555]">Us</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
              Get in touch with our team for support, questions, or partnership opportunities
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-slate-50 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#D25555] focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#D25555] focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-semibold text-slate-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#D25555] focus:border-transparent transition-colors"
                    placeholder="Your healthcare institution"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#D25555] focus:border-transparent transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="demo">Request a Demo</option>
                    <option value="feedback">Product Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#D25555] focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D25555] text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-[#B84444] transition-colors duration-200 focus:ring-4 focus:ring-[#D25555] focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  We&apos;re here to help you optimize your antimicrobial stewardship program. 
                  Reach out to us for support, questions, or to learn more about how SPARC 
                  can benefit your healthcare institution.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#D25555] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">Email</h3>
                    <p className="text-slate-600 text-sm">support@sparc-calculator.com</p>
                    <p className="text-slate-600 text-sm">info@sparc-calculator.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#D25555] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">Phone</h3>
                    <p className="text-slate-600 text-sm">+1 (555) 123-4567</p>
                    <p className="text-slate-600 text-sm">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#D25555] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">Address</h3>
                    <p className="text-slate-600 text-sm">
                      SPARC Healthcare Solutions<br />
                      123 Medical Plaza Drive<br />
                      Suite 400<br />
                      Boston, MA 02115
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Hours */}
              <div className="bg-gradient-to-br from-[#D25555] to-[#B84444] rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Support Hours</h3>
                <div className="space-y-1 text-red-100 text-sm">
                  <p><span className="font-semibold">Monday - Friday:</span> 9:00 AM - 6:00 PM EST</p>
                  <p><span className="font-semibold">Saturday:</span> 10:00 AM - 2:00 PM EST</p>
                  <p><span className="font-semibold">Sunday:</span> Closed</p>
                </div>
                <p className="text-red-100 mt-3 text-xs">
                  Emergency support available 24/7 for critical issues
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Quick answers to common questions about SPARC
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3">How accurate is SPARC?</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                SPARC is built on extensive time-in-motion studies and peer-reviewed research. 
                Our calculations have been validated across 500+ healthcare institutions with 
                an average accuracy rate of 95%.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Is SPARC free to use?</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Yes, SPARC is completely free for healthcare institutions. We believe in 
                supporting antimicrobial stewardship programs without financial barriers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Can I customize the calculations?</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Absolutely! SPARC allows you to input your specific institutional data, 
                including bed count, patient volume, and existing staffing levels for 
                personalized recommendations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Do you offer training?</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Yes, we provide comprehensive training sessions for your team, including 
                webinars, documentation, and one-on-one support to ensure successful 
                implementation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
