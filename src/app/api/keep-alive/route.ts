import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();
  let queriesExecuted = 0;
  
  try {
    const supabase = await createClient();
    
    console.log('[Keep-Alive] Starting Level 2 database activity generation...');
    
    // ========================================
    // SECTION 1: Basic Counts (3 queries)
    // ========================================
    
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    queriesExecuted++;
    console.log('[Keep-Alive] Profiles count:', profilesCount);
    
    const { count: entriesCount } = await supabase
      .from('time_entries')
      .select('*', { count: 'exact', head: true });
    queriesExecuted++;
    console.log('[Keep-Alive] Time entries count:', entriesCount);
    
    const { count: contactsCount } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });
    queriesExecuted++;
    console.log('[Keep-Alive] Contact submissions count:', contactsCount);
    
    // ========================================
    // SECTION 2: Aggregation Queries (6 queries)
    // ========================================
    
    // Query 4: Sum of all minutes
    const { data: totalMinutesData } = await supabase
      .from('time_entries')
      .select('minutes')
      .is('deleted_at', null);
    queriesExecuted++;
    const totalMinutes = totalMinutesData?.reduce((sum, entry) => sum + (entry.minutes || 0), 0) || 0;
    console.log('[Keep-Alive] Total minutes calculated:', totalMinutes);
    
    // Query 5: Count active time entries (not deleted)
    const { count: activeEntriesCount } = await supabase
      .from('time_entries')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);
    queriesExecuted++;
    console.log('[Keep-Alive] Active entries count:', activeEntriesCount);
    
    // Query 6: Recent entries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: recentEntriesCount } = await supabase
      .from('time_entries')
      .select('*', { count: 'exact', head: true })
      .gte('occurred_on', sevenDaysAgo.toISOString())
      .is('deleted_at', null);
    queriesExecuted++;
    console.log('[Keep-Alive] Recent entries (7 days):', recentEntriesCount);
    
    // Query 7: Count deleted entries
    const { count: deletedEntriesCount } = await supabase
      .from('time_entries')
      .select('*', { count: 'exact', head: true })
      .not('deleted_at', 'is', null);
    queriesExecuted++;
    console.log('[Keep-Alive] Deleted entries count:', deletedEntriesCount);
    
    // Query 8: Count entries by date range (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { count: monthlyEntriesCount } = await supabase
      .from('time_entries')
      .select('*', { count: 'exact', head: true })
      .gte('occurred_on', thirtyDaysAgo.toISOString())
      .is('deleted_at', null);
    queriesExecuted++;
    console.log('[Keep-Alive] Monthly entries count:', monthlyEntriesCount);
    
    // Query 9: Get distinct task types count
    const { data: distinctTasks } = await supabase
      .from('time_entries')
      .select('task')
      .is('deleted_at', null);
    queriesExecuted++;
    const uniqueTasks = new Set(distinctTasks?.map(entry => entry.task).filter(Boolean));
    console.log('[Keep-Alive] Unique task types:', uniqueTasks.size);
    
    // ========================================
    // SECTION 3: Analytics Queries (5 queries)
    // ========================================
    
    // Query 10: Task distribution
    const { data: taskDistribution } = await supabase
      .from('time_entries')
      .select('task')
      .is('deleted_at', null)
      .limit(100);
    queriesExecuted++;
    console.log('[Keep-Alive] Task distribution analyzed:', taskDistribution?.length || 0);
    
    // Query 11: Recent profiles activity
    const { data: recentProfiles } = await supabase
      .from('profiles')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    queriesExecuted++;
    console.log('[Keep-Alive] Recent profiles checked:', recentProfiles?.length || 0);
    
    // Query 12: Recent time entries
    const { data: recentEntries } = await supabase
      .from('time_entries')
      .select('id, occurred_on, task, minutes')
      .is('deleted_at', null)
      .order('occurred_on', { ascending: false })
      .limit(10);
    queriesExecuted++;
    console.log('[Keep-Alive] Recent entries fetched:', recentEntries?.length || 0);
    
    // Query 13: Contact form activity
    const { data: recentContacts } = await supabase
      .from('contact_submissions')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    queriesExecuted++;
    console.log('[Keep-Alive] Recent contacts checked:', recentContacts?.length || 0);
    
    // Query 14: User engagement metrics
    const { data: userActivity } = await supabase
      .from('time_entries')
      .select('user_id')
      .is('deleted_at', null)
      .gte('occurred_on', sevenDaysAgo.toISOString());
    queriesExecuted++;
    const activeUsers = new Set(userActivity?.map(entry => entry.user_id));
    console.log('[Keep-Alive] Active users (7 days):', activeUsers.size);
    
    const executionTime = Date.now() - startTime;
    console.log(`[Keep-Alive] Completed ${queriesExecuted} queries in ${executionTime}ms`);
    
    // Return comprehensive response
    return NextResponse.json({ 
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Database activity generated successfully',
      level: 'Medium (Level 2)',
      activity: {
        basicCounts: {
          profiles: profilesCount || 0,
          timeEntries: entriesCount || 0,
          contacts: contactsCount || 0
        },
        aggregations: {
          totalMinutes,
          activeEntries: activeEntriesCount || 0,
          recentEntries7Days: recentEntriesCount || 0,
          deletedEntries: deletedEntriesCount || 0,
          monthlyEntries: monthlyEntriesCount || 0,
          uniqueTaskTypes: uniqueTasks.size
        },
        analytics: {
          taskDistributionSamples: taskDistribution?.length || 0,
          recentProfilesSampled: recentProfiles?.length || 0,
          recentEntriesSampled: recentEntries?.length || 0,
          recentContactsSampled: recentContacts?.length || 0,
          activeUsersLast7Days: activeUsers.size
        }
      },
      executionTimeMs: executionTime,
      queriesExecuted
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

