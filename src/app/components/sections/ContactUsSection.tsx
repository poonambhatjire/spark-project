import { Badge } from "@/app/components/ui/badge"
import { Card } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react"

// Dummy contact information - replace with real data later
const contactInfo = {
  email: "contact@sparc-calculator.org",
  phone: "+1 (555) 123-4567",
  address: "123 Healthcare Research Drive, Medical Center, MC 12345",
  hours: "Monday - Friday: 9:00 AM - 5:00 PM EST",
  supportEmail: "support@sparc-calculator.org"
}

const departments = [
  {
    name: "General Inquiries",
    email: "info@sparc-calculator.org",
    description: "Questions about SPARC calculator, general information, and partnerships"
  },
  {
    name: "Technical Support",
    email: "support@sparc-calculator.org", 
    description: "Technical issues, bug reports, and feature requests"
  },
  {
    name: "Research Collaboration",
    email: "research@sparc-calculator.org",
    description: "Research partnerships, data sharing, and academic collaborations"
  },
  {
    name: "Media & Press",
    email: "media@sparc-calculator.org",
    description: "Press inquiries, media requests, and public relations"
  }
]

export default function ContactUsSection() {
  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <Badge variant="outline" className="w-fit text-emerald-600 border-emerald-200">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Us
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
              Get in Touch
            </h2>
            <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Have questions about SPARC? Need technical support? Want to collaborate? 
              We&apos;re here to help and would love to hear from you.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Send us a Message</h3>
                <p className="text-slate-600">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
              </div>
              
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      required
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                      Last Name *
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      required
                      className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="organization" className="text-sm font-medium text-slate-700">
                    Organization
                  </label>
                  <Input
                    id="organization"
                    placeholder="University Medical Center"
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-slate-700">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    placeholder="Question about SPARC implementation"
                    required
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-700">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your question or how we can help you..."
                    required
                    rows={5}
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Main Contact Info */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Email</p>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Phone</p>
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Address</p>
                    <p className="text-slate-600">{contactInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Business Hours</p>
                    <p className="text-slate-600">{contactInfo.hours}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Department Contacts */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Department Contacts</h3>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="border-l-4 border-emerald-200 pl-4">
                    <h4 className="font-medium text-slate-900">{dept.name}</h4>
                    <a 
                      href={`mailto:${dept.email}`}
                      className="text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
                    >
                      {dept.email}
                    </a>
                    <p className="text-sm text-slate-600 mt-1">{dept.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Response Time */}
            <Card className="p-6 bg-emerald-50 border-emerald-200">
              <div className="text-center">
                <h4 className="font-semibold text-emerald-900 mb-2">Response Time</h4>
                <p className="text-emerald-700">
                  We typically respond to inquiries within <strong>24-48 hours</strong> during business days.
                </p>
                <p className="text-sm text-emerald-600 mt-2">
                  For urgent technical issues, please mark your email as &quot;URGENT&quot; in the subject line.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
