import { createClient } from '@supabase/supabase-js';

// Using the credentials you provided
const supabaseUrl = 'https://dnvnxunrtrriggffesui.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRudm54dW5ydHJyaWdnZmZlc3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTA1NTEsImV4cCI6MjA3NjI4NjU1MX0.meX9TAf2G9eUMIrOqPTapR_ejTKBgCpKnP88TzQjK9E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);