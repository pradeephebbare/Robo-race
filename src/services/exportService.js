import * as XLSX from 'xlsx'

const sanitizeCell = (value) => {
  if (value === null || value === undefined) return ''
  return value
}

export const exportRegistrationsToExcel = ({ rows, filename = 'robo-race-registrations.xlsx' }) => {
  const normalizedRows = rows.map((row) => ({
    'Registration ID': sanitizeCell(row.registration_id),
    'Team Name': sanitizeCell(row.team_name),
    'Leader Name': sanitizeCell(row.leader_name),
    'Leader Phone': sanitizeCell(row.leader_phone),
    'Leader Email': sanitizeCell(row.leader_email),
    'College': sanitizeCell(row.college),
    'City': sanitizeCell(row.city),
    'Member 2 Name': sanitizeCell(row.member2_name),
    'Member 2 Phone': sanitizeCell(row.member2_phone),
    'Member 2 Email': sanitizeCell(row.member2_email),
    'Robot Name': sanitizeCell(row.robot_name),
    'Robot Type': sanitizeCell(row.robot_type),
    'Payment Method': sanitizeCell(row.payment_method),
    'Payment Status': sanitizeCell(row.payment_status),
    'Amount': sanitizeCell(row.amount),
    'Razorpay Payment ID': sanitizeCell(row.razorpay_payment_id),
    'Registration Date': sanitizeCell(row.registered_at),
    'Payment Received Date': sanitizeCell(row.payment_received_at),
    'Payment Received By': sanitizeCell(row.payment_received_by),
  }))

  const workbook = XLSX.utils.book_new()
  const sheet = XLSX.utils.json_to_sheet(normalizedRows)
  XLSX.utils.book_append_sheet(workbook, sheet, 'Registrations')
  XLSX.writeFile(workbook, filename)
}
