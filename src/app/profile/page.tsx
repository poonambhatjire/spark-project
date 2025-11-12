import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/actions/user-profile"
import UserProfileForm from "@/app/components/UserProfileForm"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { PROFESSIONAL_TITLES } from "@/lib/constants/profile"

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
                <Button variant="outline">Back to Data Entry</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const profile = profileResult.data
  const rawTitle = (profile?.title as string) || (profile?.professional_title as string) || ""
  const isRecognizedTitle = rawTitle !== "" && PROFESSIONAL_TITLES.includes(rawTitle as typeof PROFESSIONAL_TITLES[number])
  const normalizedTitle = isRecognizedTitle ? rawTitle : rawTitle ? "Other, please specify" : ""
  const normalizedTitleOther = isRecognizedTitle ? "" : rawTitle
  const normalizedExperience = (profile?.experience_level as string) || (profile?.years_of_experience as string) || ""
  const normalizedInstitution = (profile?.institution as string) || (profile?.organization as string) || ""
  const normalizedFullName = (profile?.name as string) || ""
  const normalizedEmail = (profile?.email as string) || user.email || ""

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
          initialData={{
            fullName: normalizedFullName,
            email: normalizedEmail,
            title: normalizedTitle,
            titleOther: normalizedTitleOther,
            experienceLevel: normalizedExperience,
            institution: normalizedInstitution
          }}
          isEditing={true}
        />

        {/* Back to Data Entry */}
        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-300">
              Back to Data Entry
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
