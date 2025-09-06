import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Play, Calendar, Pause, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-emerald-50 via-white to-slate-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge className="w-fit bg-[#FBEAEA] text-[#D25555] hover:bg-[#F5CCCC]">
                Time Tracking for Pharmacists
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-slate-900">
                Track Your AMS
                <span className="text-emerald-600"> Activities</span> Efficiently
              </h1>
              <p className="max-w-[600px] text-slate-600 md:text-xl leading-relaxed">
                The only time tracking app designed specifically for pharmacists in antimicrobial stewardship. Log
                activities, track time spent, and optimize your workflow with detailed insights.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-[#D25555] hover:bg-[#b13f3f] text-white">
                <Play className="mr-2 h-4 w-4 text-white" />
                Start Tracking Free
              </Button>
              <Button className="border-[#D25555] text-[#D25555] hover:bg-[#FBEAEA]">
                <Calendar className="mr-2 h-4 w-4 text-[#D25555]" />
                View Demo
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-[#D25555]" />
                Free 14-day trial
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-[#D25555]" />
                No credit card required
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/sparc-logo.png"
              width="600"
              height="400"
              alt="Spark Calculator logo"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-xl border border-slate-200"
            />
            {/* Time tracker widget below the logo */}
            <div className="mt-10 bg-white rounded-lg shadow-lg border border-slate-200 p-4 min-w-[200px] w-fit">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-[#D25555] rounded-full animate-pulse"></div>
                <span className="font-medium text-[#D25555]">Patient Consultation</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">02:34:12</div>
              <div className="flex gap-2 mt-2">
                <Button className="flex-1 bg-transparent">
                  <Pause className="h-3 w-3" />
                </Button>
                <Button className="flex-1 bg-transparent">
                  Stop
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}