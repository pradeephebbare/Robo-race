const getFunctionsUrl = () => {
  const projectUrl = import.meta.env.VITE_SUPABASE_URL
  if (!projectUrl) {
    return ''
  }
  return `${projectUrl.replace(/\/$/, '')}/functions/v1`
}

export const createRazorpayOrder = async ({ teamName, amount = 200, metadata = {} }) => {
  const functionsUrl = getFunctionsUrl()

  if (!functionsUrl) {
    throw new Error('Supabase URL is not configured. Add VITE_SUPABASE_URL first.')
  }

  const response = await fetch(`${functionsUrl}/create-razorpay-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'INR',
      team_name: teamName,
      metadata,
    }),
  })

  const result = await response.json()

  if (!response.ok || result.error) {
    throw new Error(result.message || 'Unable to create Razorpay order.')
  }

  return result
}

export const verifyRazorpayPayment = async ({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  registrationId,
}) => {
  const functionsUrl = getFunctionsUrl()

  if (!functionsUrl) {
    throw new Error('Supabase URL is not configured. Add VITE_SUPABASE_URL first.')
  }

  const response = await fetch(`${functionsUrl}/verify-razorpay-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      registrationId,
    }),
  })

  const result = await response.json()

  if (!response.ok || result.error) {
    throw new Error(result.message || 'Payment verification failed.')
  }

  return result
}
