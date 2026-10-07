import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jwifsvmfxpwohaogtsxp.supabase.co'

const supabasePublishableKey = 'sb_publishable_GrvanK3DUENFruPQ5ZnbGQ_v33tvWjD'

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
)