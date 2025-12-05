export function parseTimeString(timeStr: string): Date {
  // Parse "3:30 PM" to Date object
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) {
    return new Date(0);
  }

  const [, hours, minutes, period] = match;
  let hour = parseInt(hours!, 10);
  const minute = parseInt(minutes!, 10);

  if (period!.toUpperCase() === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period!.toUpperCase() === 'AM' && hour === 12) {
    hour = 0;
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

export function compareTimeStrings(a: string, b: string): number {
  // Extract start time from "3:30 PM - 4:30 PM" format
  const aStart = a.split(' - ')[0]!;
  const bStart = b.split(' - ')[0]!;

  const aDate = parseTimeString(aStart);
  const bDate = parseTimeString(bStart);

  return aDate.getTime() - bDate.getTime();
}

export function extractUniqueTimeSlots(classes: Array<{ time: string }>): string[] {
  const times = new Set<string>();
  classes.forEach(c => {
    if (c.time) {
      times.add(c.time);
    }
  });
  return Array.from(times).sort(compareTimeStrings);
}
