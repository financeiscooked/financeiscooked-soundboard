const WEBHOOK_URL = import.meta.env.VITE_SLACK_WEBHOOK_URL

export async function sendToProducer(message) {
  if (!WEBHOOK_URL) {
    console.warn('VITE_SLACK_WEBHOOK_URL not configured')
    return false
  }
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    })
    return true
  } catch (err) {
    console.error('Failed to send to producer:', err)
    return false
  }
}

export function isProducerConfigured() {
  return !!WEBHOOK_URL
}
