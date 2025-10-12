import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Perform simple read queries to generate database activity
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    const { count: entriesCount } = await supabase
      .from('time_entries')
      .select('*', { count: 'exact', head: true });
    
    const { count: contactsCount } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });
    
    // Return success response with activity data
    return NextResponse.json({ 
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Database activity generated successfully',
      activity: {
        profiles: profilesCount || 0,
        timeEntries: entriesCount || 0,
        contacts: contactsCount || 0
      }
    });
  } catch (error) {
    console.error('Keep-alive error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

