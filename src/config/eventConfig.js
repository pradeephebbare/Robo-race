export const defaultEventSettings = {
  id: 1,
  event_name: 'STATE LEVEL ROBO RACE 2026',
  event_date: '2026-11-21',
  registration_fee: 200,
  prize_1: 10000,
  prize_2: 5000,
  prize_3: 3000,
  venue: 'To be announced',
  contact_email: 'info@roborace.example',
  contact_phone: '+91 00000 00000',
  rules: [
    { title: 'Autonomous robots only', detail: 'Only autonomous robots are allowed.' },
    { title: 'Wireless communication only', detail: 'Only wireless control and communication are allowed.' },
    { title: 'No wired robots', detail: 'Wired or corded robots are strictly not allowed.' },
    { title: 'Team size', detail: 'Each team must contain 1 to 2 participants.' },
    { title: 'Registration fee', detail: 'The registration fee is ₹200 per team.' },
    { title: 'Qualification', detail: 'Top 50% of teams qualify from Round 1.' },
    { title: 'Final round', detail: 'Qualified teams compete in the final round as per judgment criteria.' },
    { title: 'Instructions', detail: 'Participants must follow organizer instructions and decisions.' },
  ],
  registration_open: true,
}

export const PAYMENT_FEE = 200
export const EVENT_DATE = new Date('2026-11-21T00:00:00+05:30')

export const FAQ_ITEMS = [
  { question: 'Who can participate?', answer: 'Students and participants from colleges or institutions may register as teams of 1 to 2 members.' },
  { question: 'What is the team size?', answer: 'Each team can include 1 or 2 participants.' },
  { question: 'What is the registration fee?', answer: 'The registration fee is ₹200 per team.' },
  { question: 'Can I pay on the event day?', answer: 'Yes. Participants may choose event-day payment and complete registration without paying online.' },
  { question: 'Are wired robots allowed?', answer: 'No. Only autonomous and wireless robots are allowed. Wired or corded robots are strictly not permitted.' },
  { question: 'How does qualification work?', answer: 'All registered teams participate in Round 1 and the top 50% qualify for the final round.' },
  { question: 'What happens after registration?', answer: 'The participant receives a unique registration ID and confirmation, and can pay online or at the desk as selected.' },
  { question: 'How do I get my registration ID?', answer: 'Your registration ID is generated automatically after successful registration and is shown on the confirmation page.' },
]
