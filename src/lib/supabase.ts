import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  name?: string;
  age?: number;
  recruitment_stage?: string;
  main_concern?: string;
  created_at?: string;
}

export interface TaskResponse {
  id: string;
  user_id: string;
  task_key: string;
  response_text: string;
  created_at?: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  most_useful?: string;
  less_clear?: string;
  made_think?: boolean;
  would_recommend?: boolean;
  contact_info?: string;
  created_at?: string;
}
