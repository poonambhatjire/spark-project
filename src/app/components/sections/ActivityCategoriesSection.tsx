import { Badge } from "@/app/components/ui/badge"
import { Users, FileText, Stethoscope, Activity } from "lucide-react"
import Image from "next/image"

export default function ActivityCategoriesSection() {
  const categories = [
    {
      icon: Users,
      title: "Patient Care",
      description: "Consultations, bedside visits, patient education"
    },
    {
      icon: FileText,
      title: "Documentation", 
      description: "Chart reviews, notes, intervention logging"
    },
    {
      icon: Stethoscope,
      title: "Clinical Reviews",
      description: "Antibiotic assessments, culture reviews"
    },
    {
      icon: Activity,
      title: "Education & Training",
      description: "Staff education, guideline development"
    }
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit text-emerald-600 border-emerald-200">
                Activity Categories
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                Track Every Aspect of Your AMS Work
              </h2>
              <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Comprehensive categories designed specifically for antimicrobial stewardship activities, helping you
                understand where your time goes.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <div key={category.title} className="flex items-start gap-3">
                    <IconComponent className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900">{category.title}</h3>
                      <p className="text-sm text-slate-600">{category.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <Image
            src="/placeholder.svg?height=400&width=550&text=Activity+Categories+Interface"
            width="550"
            height="400"
            alt="Activity categories interface showing different AMS activities"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-lg border border-slate-200"
          />
        </div>
      </div>
    </section>
  )
}