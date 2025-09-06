import { Badge } from "../ui/badge"

export default function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Select Activity",
      description: "Choose from pre-configured AMS activities or create custom categories for your specific workflow."
    },
    {
      number: "2", 
      title: "Start Timer",
      description: "Click start and focus on your work. The timer runs in the background while you complete your tasks."
    },
    {
      number: "3",
      title: "Review & Analyze", 
      description: "View detailed reports and insights to understand your time allocation and optimize your AMS workflow."
    }
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <Badge variant="outline" className="text-emerald-600 border-emerald-200">
            Simple Process
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
            Start Tracking in 3 Easy Steps
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-600">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}