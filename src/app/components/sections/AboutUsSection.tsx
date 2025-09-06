import { Badge } from "@/app/components/ui/badge"
import { Card } from "@/app/components/ui/card"
import { Users, Award, GraduationCap, Heart } from "lucide-react"

// Sample team data - replace with real data later
const teamMembers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Principal Investigator",
    title: "Director of Antimicrobial Stewardship",
    institution: "University Medical Center",
    expertise: "Infectious Diseases, Clinical Research",
    education: "MD, PhD in Microbiology",
    photo: "/placeholder-avatar-1.jpg",
    bio: "Leading expert in antimicrobial stewardship with over 15 years of experience in clinical research and program development."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    role: "Co-Investigator",
    title: "Clinical Pharmacist Specialist",
    institution: "Regional Health System",
    expertise: "Pharmacy Practice, Implementation Science",
    education: "PharmD, BCPS",
    photo: "/placeholder-avatar-2.jpg",
    bio: "Specialized in antimicrobial stewardship pharmacy practice and implementation of evidence-based interventions."
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    role: "Research Coordinator",
    title: "Epidemiologist",
    institution: "Public Health Institute",
    expertise: "Epidemiology, Data Analysis",
    education: "PhD in Epidemiology",
    photo: "/placeholder-avatar-3.jpg",
    bio: "Expert in healthcare epidemiology and statistical analysis of antimicrobial resistance patterns."
  },
  {
    id: 4,
    name: "Dr. James Thompson",
    role: "Clinical Advisor",
    title: "Infectious Disease Physician",
    institution: "Children's Hospital",
    expertise: "Pediatric Infectious Diseases",
    education: "MD, FAAP",
    photo: "/placeholder-avatar-4.jpg",
    bio: "Board-certified pediatric infectious disease specialist with focus on antimicrobial stewardship in pediatric populations."
  },
  {
    id: 5,
    name: "Dr. Lisa Park",
    role: "Implementation Specialist",
    title: "Quality Improvement Director",
    institution: "Healthcare Network",
    expertise: "Quality Improvement, Change Management",
    education: "MPH, CPHQ",
    photo: "/placeholder-avatar-5.jpg",
    bio: "Specialized in healthcare quality improvement and implementation of antimicrobial stewardship programs across diverse settings."
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    role: "Data Analyst",
    title: "Health Informatics Specialist",
    institution: "Technology Solutions Inc.",
    expertise: "Health Informatics, Data Science",
    education: "MS in Health Informatics",
    photo: "/placeholder-avatar-6.jpg",
    bio: "Expert in health informatics and data analytics, responsible for developing the SPARC calculator's technical infrastructure."
  }
]

export default function AboutUsSection() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge variant="outline" className="w-fit text-emerald-600 border-emerald-200">
              <Users className="h-4 w-4 mr-2" />
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
              Meet Our Expert Team
            </h2>
            <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A multidisciplinary team of healthcare professionals, researchers, and technology experts 
              dedicated to advancing antimicrobial stewardship through evidence-based solutions.
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {teamMembers.map((member) => (
            <Card key={member.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Profile Photo */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100">
                  <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-semibold text-xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                {/* Member Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                  <p className="text-sm font-medium text-emerald-600">{member.role}</p>
                  <p className="text-sm text-slate-600">{member.title}</p>
                  <p className="text-xs text-slate-500">{member.institution}</p>
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.expertise.split(', ').map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Education */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <GraduationCap className="h-3 w-3" />
                  <span>{member.education}</span>
                </div>

                {/* Bio */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-br from-emerald-50 to-slate-50 border-emerald-200">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              To provide healthcare institutions with evidence-based, customizable staffing guidance 
              for Antimicrobial Stewardship Programs, enabling them to optimize antimicrobial use, 
              reduce resistance, and improve patient outcomes through data-driven decision making.
            </p>
          </Card>
        </div>

        {/* Values */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Award className="h-6 w-6 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Excellence</h4>
            <p className="text-sm text-slate-600">Rigorous research and evidence-based approaches</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Collaboration</h4>
            <p className="text-sm text-slate-600">Multidisciplinary teamwork and partnerships</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <GraduationCap className="h-6 w-6 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Innovation</h4>
            <p className="text-sm text-slate-600">Cutting-edge technology and methodologies</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-6 w-6 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-slate-900">Impact</h4>
            <p className="text-sm text-slate-600">Improving patient care and public health</p>
          </div>
        </div>
      </div>
    </section>
  )
}
