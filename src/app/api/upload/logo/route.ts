import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// Service role client bypasses RLS for storage uploads
function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  // Verify user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get org id for this user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: orgs } = await (supabase as any)
    .from('organizations')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
  const orgId = orgs?.[0]?.id
  if (!orgId) return NextResponse.json({ error: 'No organization found' }, { status: 404 })

  // Parse multipart form
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 4 MB' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
  const path = `${orgId}/logo.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const admin = adminClient()
  const { error: uploadError } = await admin.storage
    .from('org-logos')
    .upload(path, buffer, {
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = admin.storage
    .from('org-logos')
    .getPublicUrl(path)

  return NextResponse.json({ url: publicUrl })
}
