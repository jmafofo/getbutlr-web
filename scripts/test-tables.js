import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

// ✅ Debugging: Check if environment variables are loaded
console.log("🔍 SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL || '[MISSING]')
console.log("🔍 SERVICE ROLE KEY (first 5 chars):", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 5) || '[MISSING]', '...')

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const { data, error } = await supabase
  .from('auth.users')
  .select('id, email, role')
  console.log('✅ role rows:', data)
// ✅ Query your actual table
async function listRowsFromCreatorsProfile() {
  try {
    const { data, error } = await supabase
      .from('creator_profiles') // 🔥 use the table name only, no schema prefix
      .select('*')              // Select all columns (limit if needed)

    if (error) {
      console.error('❌ Supabase query error:', error)
    } else {
      console.log('✅ creators_profile rows:', data)
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

listRowsFromCreatorsProfile()
