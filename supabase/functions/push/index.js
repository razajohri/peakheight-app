import { createClient } from 'npm:@supabase/supabase-js@2'

console.log('Push notification Edge Function initialized')

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
)

Deno.serve(async (req) => {
  try {
    const payload = await req.json()
    
    console.log('Received webhook payload:', {
      type: payload.type,
      table: payload.table,
      userId: payload.record.user_id
    })

    // Only process INSERT events
    if (payload.type !== 'INSERT') {
      return new Response(
        JSON.stringify({ message: 'Only INSERT events are processed' }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get user's push token from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('push_notification_token')
      .eq('id', payload.record.user_id)
      .single()

    if (userError || !userData) {
      console.error('Error fetching user:', userError)
      return new Response(
        JSON.stringify({ error: 'User not found', details: userError?.message }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (!userData.push_notification_token) {
      console.log('User has no push token, skipping notification')
      return new Response(
        JSON.stringify({ message: 'User has no push token' }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Send push notification via Expo
    const expoAccessToken = Deno.env.get('EXPO_ACCESS_TOKEN')
    if (!expoAccessToken) {
      console.error('EXPO_ACCESS_TOKEN not set')
      return new Response(
        JSON.stringify({ error: 'EXPO_ACCESS_TOKEN not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const pushPayload = {
      to: userData.push_notification_token,
      sound: 'default',
      title: payload.record.title || 'PeakHeight',
      body: payload.record.body,
      data: payload.record.data || {},
      badge: 1,
    }

    console.log('Sending push notification:', {
      to: userData.push_notification_token.substring(0, 20) + '...',
      title: pushPayload.title,
      body: pushPayload.body.substring(0, 50) + '...'
    })

    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${expoAccessToken}`,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify(pushPayload),
    })

    const result = await res.json()
    
    console.log('Expo push notification response:', result)

    // Update notification record with sent_at timestamp
    if (result.data?.status === 'ok') {
      await supabase
        .from('notifications')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', payload.record.id)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        result,
        notificationId: payload.record.id
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in push notification function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

