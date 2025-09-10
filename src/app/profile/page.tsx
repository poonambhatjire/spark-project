import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/actions/user-profile"
import UserProfileForm from "@/app/components/UserProfileForm"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"

export default async function ProfilePage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/sign-in')
  }

  // Get user profile data
  const profileResult = await getUserProfile()
  
  if (!profileResult.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Profile</h2>
              <p className="text-slate-600 mb-4">{profileResult.error}</p>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const profile = profileResult.data

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-slate-600">
            Manage your personal and professional information
          </p>
        </div>

        {/* Profile Form */}
        <UserProfileForm 
          onSubmit={async (data) => {
            'use server'
            const { updateUserProfile } = await import('@/lib/actions/user-profile')
            return await updateUserProfile(data)
          }}
          initialData={profile ? {
            fullName: (profile.name as string) || '',
            phoneNumber: (profile.phone_number as string) || '',
            professionalTitle: (profile.professional_title as string) || '',
            institution: (profile.organization as string) || '',
            department: (profile.department as string) || '',
            specialty: (profile.specialty as string) || '',
            yearsOfExperience: (profile.years_of_experience as string) || '',
            licenseNumber: (profile.license_number as string) || '',
            workLocation: (profile.work_location as string) || '',
            stewardshipRole: (profile.stewardship_role as string) || '',
            certificationStatus: (profile.certification_status as string) || '',
            timeZone: (profile.time_zone as string) || '',
            manager: (profile.manager as string) || '',
            team: (profile.team as string) || '',
            notes: (profile.notes as string) || ''
          } : undefined}
          isEditing={true}
        />

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-300">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
