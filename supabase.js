import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://zcogboficxfnyofxmpne.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpjb2dib2ZpY3hmbnlvZnhtcG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NDE3MjUsImV4cCI6MjA4MTExNzcyNX0.-VwNBH-Xt817zAoDCFgGcse4YClmMZMME8cKzbH8sx4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

