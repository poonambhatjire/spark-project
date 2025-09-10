// Types
export type Activity = 
  // Patient Care
  | 'Patient Care - Prospective Audit & Feedback' 
  | 'Patient Care - Authorization of Restricted Antimicrobials' 
  | 'Patient Care - Participating in Clinical Rounds'
  // Administrative
  | 'Administrative - Guidelines/EHR'
  // Tracking
  | 'Tracking - AMU'
  | 'Tracking - AMR' 
  | 'Tracking - Antibiotic Appropriateness'
  | 'Tracking - Intervention Acceptance'
  // Reporting
  | 'Reporting - sharing data with prescribers/decision makers'
  // Education
  | 'Education - Providing Education'
  | 'Education - Receiving Education (e.g. CE)'
  // Administrative
  | 'Administrative - Committee Work'
  | 'Administrative - QI projects/research'
  | 'Administrative - Emails'
  // Other
  | 'Other - specify in comments';

export interface TimeEntry {
  id: string;
  task: Activity;
  otherTask?: string;
  minutes: number;          // 1..480
  occurredOn: string;       // ISO date (YYYY-MM-DD)
  comment?: string;
  createdAt: string;        // ISO datetime
  updatedAt: string;        // ISO datetime
  deletedAt?: string | null;
}

export interface CreateEntryInput {
  task: Activity;
  otherTask?: string;
  minutes: number;
  occurredOn: string;
  comment?: string;
}

export interface UpdateEntryInput {
  task?: Activity;
  otherTask?: string;
  minutes?: number;
  occurredOn?: string;
  comment?: string;
}

export interface ListEntriesOptions {
  range?: 'today' | 'week' | 'all';
  task?: Activity;
  includeDeleted?: boolean;
}

export interface TodayTotals {
  total: number;
  // Patient Care
  'Patient Care - Prospective Audit & Feedback': number;
  'Patient Care - Authorization of Restricted Antimicrobials': number;
  'Patient Care - Participating in Clinical Rounds': number;
  // Administrative
  'Administrative - Guidelines/EHR': number;
  // Tracking
  'Tracking - AMU': number;
  'Tracking - AMR': number;
  'Tracking - Antibiotic Appropriateness': number;
  'Tracking - Intervention Acceptance': number;
  // Reporting
  'Reporting - sharing data with prescribers/decision makers': number;
  // Education
  'Education - Providing Education': number;
  'Education - Receiving Education (e.g. CE)': number;
  // Administrative
  'Administrative - Committee Work': number;
  'Administrative - QI projects/research': number;
  'Administrative - Emails': number;
  // Other
  'Other - specify in comments': number;
}


// Storage configuration
const STORAGE_KEY = 'sparc.entries.v1';

// Date utilities
export const dateUtils = {
  today: (): string => new Date().toISOString().split('T')[0],
  
  startOfWeek: (date: string = new Date().toISOString().split('T')[0]): string => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  },
  
  isToday: (date: string): boolean => {
    return date === dateUtils.today();
  },
  
  isThisWeek: (date: string): boolean => {
    const entryDate = new Date(date);
    const startOfWeek = new Date(dateUtils.startOfWeek());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    return entryDate >= startOfWeek && entryDate <= endOfWeek;
  },
  
  formatDate: (date: string): string => {
    return new Date(date).toLocaleDateString();
  },
  
  formatTime: (datetime: string): string => {
    return new Date(datetime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};

// ID generation (simple but stable)
const generateId = (): string => {
  return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Safe JSON operations
const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

const safeJsonStringify = (data: unknown): string => {
  try {
    return JSON.stringify(data);
  } catch {
    return '[]';
  }
};

// Storage operations
const getStorage = (): TimeEntry[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return safeJsonParse(stored || '[]', []);
};

const setStorage = (entries: TimeEntry[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, safeJsonStringify(entries));
};

// Data client
class TimeEntryClient {
  private entries: TimeEntry[] = [];

  constructor() {
    this.entries = getStorage();
  }

  private save(): void {
    setStorage(this.entries);
  }

  private getActiveEntries(): TimeEntry[] {
    return this.entries.filter(entry => !entry.deletedAt);
  }

  async createEntry(input: CreateEntryInput): Promise<TimeEntry> {
    const now = new Date().toISOString();
    const entry: TimeEntry = {
      id: generateId(),
      ...input,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };

    this.entries.push(entry);
    this.save();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return entry;
  }

  async updateEntry(id: string, patch: UpdateEntryInput): Promise<TimeEntry> {
    const index = this.entries.findIndex(entry => entry.id === id);
    if (index === -1) {
      throw new Error(`Entry with id ${id} not found`);
    }

    const updatedEntry: TimeEntry = {
      ...this.entries[index],
      ...patch,
      updatedAt: new Date().toISOString()
    };

    this.entries[index] = updatedEntry;
    this.save();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return updatedEntry;
  }

  async deleteEntries(ids: string[]): Promise<void> {
    const now = new Date().toISOString();
    
    this.entries = this.entries.map(entry => 
      ids.includes(entry.id) 
        ? { ...entry, deletedAt: now }
        : entry
    );
    
    this.save();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  async listEntries(options: ListEntriesOptions = {}): Promise<TimeEntry[]> {
    const { range = 'all', task, includeDeleted = false } = options;
    
    let filtered = includeDeleted ? this.entries : this.getActiveEntries();

    // Apply range filter
    if (range === 'today') {
      filtered = filtered.filter(entry => dateUtils.isToday(entry.occurredOn));
    } else if (range === 'week') {
      filtered = filtered.filter(entry => dateUtils.isThisWeek(entry.occurredOn));
    }

    // Apply task filter
    if (task) {
      filtered = filtered.filter(entry => entry.task === task);
    }

    // Sort by occurredOn descending (newest first)
    filtered.sort((a, b) => new Date(b.occurredOn).getTime() - new Date(a.occurredOn).getTime());

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return filtered;
  }

  async getTodayTotals(): Promise<TodayTotals> {
    const todayEntries = await this.listEntries({ range: 'today' });
    
    const totals: TodayTotals = {
      total: 0,
      // Patient Care
      'Patient Care - Prospective Audit & Feedback': 0,
      'Patient Care - Authorization of Restricted Antimicrobials': 0,
      'Patient Care - Participating in Clinical Rounds': 0,
      // Administrative
      'Administrative - Guidelines/EHR': 0,
      // Tracking
      'Tracking - AMU': 0,
      'Tracking - AMR': 0,
      'Tracking - Antibiotic Appropriateness': 0,
      'Tracking - Intervention Acceptance': 0,
      // Reporting
      'Reporting - sharing data with prescribers/decision makers': 0,
      // Education
      'Education - Providing Education': 0,
      'Education - Receiving Education (e.g. CE)': 0,
      // Administrative
      'Administrative - Committee Work': 0,
      'Administrative - QI projects/research': 0,
      'Administrative - Emails': 0,
      // Other
      'Other - specify in comments': 0
    };

    todayEntries.forEach(entry => {
      totals.total += entry.minutes;
      totals[entry.task] += entry.minutes;
    });

    return totals;
  }


  async duplicateEntry(entry: TimeEntry): Promise<TimeEntry> {
    const now = new Date().toISOString();
    const duplicatedEntry: TimeEntry = {
      ...entry,
      id: generateId(),
      occurredOn: dateUtils.today(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };

    this.entries.push(duplicatedEntry);
    this.save();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return duplicatedEntry;
  }

  async bulkDuplicateEntries(entries: TimeEntry[]): Promise<void> {
    const now = new Date().toISOString();
    const duplicatedEntries: TimeEntry[] = entries.map(entry => ({
      ...entry,
      id: generateId(),
      occurredOn: dateUtils.today(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    }));

    this.entries.push(...duplicatedEntries);
    this.save();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Utility method to get entry by ID
  async getEntry(id: string): Promise<TimeEntry | null> {
    const entry = this.entries.find(e => e.id === id && !e.deletedAt);
    return entry || null;
  }


  // Utility method to get storage stats
  getStorageStats(): { total: number; active: number; deleted: number } {
    const total = this.entries.length;
    const active = this.getActiveEntries().length;
    const deleted = total - active;
    
    return { total, active, deleted };
  }
}

// Export singleton instance
export const timeEntryClient = new TimeEntryClient();

// All types are already exported as interfaces above
