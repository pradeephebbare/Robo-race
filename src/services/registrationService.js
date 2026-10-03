import { supabase } from '../lib/supabase'

export const getRegistrationStats = async () => {
  const { data, error } = await supabase
    .from('registrations')
    .select('id, payment_status, payment_method, amount')

  if (error) throw error

  const totalTeams = data.length
  const paidTeams = data.filter((record) => record.payment_status === 'PAID').length
  const pendingTeams = data.filter(
    (record) => record.payment_method === 'EVENT_DAY' && record.payment_status === 'PENDING',
  ).length
  const failedPayments = data.filter((record) => record.payment_status === 'FAILED').length
  const totalAmountReceived = data
    .filter((record) => record.payment_status === 'PAID')
    .reduce((sum, record) => sum + Number(record.amount || 0), 0)
  const pendingAmount = data
    .filter((record) => record.payment_method === 'EVENT_DAY' && record.payment_status === 'PENDING')
    .reduce((sum, record) => sum + Number(record.amount || 0), 0)

  return {
    totalTeams,
    paidTeams,
    pendingTeams,
    failedPayments,
    totalAmountReceived,
    pendingAmount,
  }
}

export const fetchRegistrations = async ({
  search = '',
  paymentStatus = 'ALL',
  paymentMethod = 'ALL',
  college = 'ALL',
  sortDirection = 'desc',
} = {}) => {
  let query = supabase.from('registrations').select('*')

  if (search) {
    query = query.or(`team_name.ilike.%${search}%,leader_name.ilike.%${search}%,leader_email.ilike.%${search}%`)
  }

  if (paymentStatus !== 'ALL') {
    query = query.eq('payment_status', paymentStatus)
  }

  if (paymentMethod !== 'ALL') {
    query = query.eq('payment_method', paymentMethod)
  }

  if (college !== 'ALL') {
    query = query.eq('college', college)
  }

  const { data, error } = await query.order('registered_at', { ascending: sortDirection === 'asc' })

  if (error) throw error
  return data || []
}

export const insertRegistration = async (payload) => {
  const { data, error } = await supabase.from('registrations').insert([payload]).select().single()
  if (error) throw error
  return data
}

export const updateRegistration = async (id, updates) => {
  const { data, error } = await supabase
    .from('registrations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const markPaymentReceived = async ({ id, adminName }) => {
  const { data, error } = await supabase
    .from('registrations')
    .update({
      payment_status: 'PAID',
      payment_received_at: new Date().toISOString(),
      payment_received_by: adminName,
      amount: 200,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getRegistrationById = async (registrationId) => {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('registration_id', registrationId)
    .maybeSingle()

  if (error) throw error
  return data
}
