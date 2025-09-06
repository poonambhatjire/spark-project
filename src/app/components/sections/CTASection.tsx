import { Button } from "../ui/button"
import { Play } from "lucide-react"

export default function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-600">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Ready to Optimize Your AMS Time?
            </h2>
            <p className="mx-auto max-w-[600px] text-emerald-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join pharmacists who are already using PharmTime to track their antimicrobial stewardship activities
              and improve their workflow efficiency.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-slate-50">
              <Play className="mr-2 h-4 w-4" />
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-emerald-600 bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-emerald-200">14-day free trial • No credit card required • Cancel anytime</p>
        </div>
      </div>
    </section>
  )
}