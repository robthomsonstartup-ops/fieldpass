/**
 * Generate a minimal iCalendar (.ics) string for a game.
 */
export function generateICS({
  uid,
  title,
  description,
  date,
  location,
}: {
  uid: string
  title: string
  description: string
  date: string        // YYYY-MM-DD
  location?: string
}) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  // All-day event: DTSTART and DTEND as DATE (no time)
  const dateStr = date.replace(/-/g, '')
  const nextDay = new Date(date + 'T00:00:00')
  nextDay.setDate(nextDay.getDate() + 1)
  const nextDateStr = nextDay.toISOString().slice(0, 10).replace(/-/g, '')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FieldPass//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}@fieldpass.app`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `DTEND;VALUE=DATE:${nextDateStr}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    location ? `LOCATION:${location}` : null,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Game tomorrow — FieldPass',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean) as string[]

  return lines.join('\r\n')
}
