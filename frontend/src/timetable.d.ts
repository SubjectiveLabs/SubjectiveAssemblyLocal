export type Color = {
  red: number,
  green: number,
  blue: number,
}
export type Subject = {
  id: string,
  notes: string[],
  name: string,
  locations: string[],
  color: Color,
  iconName: string,
}

export type Bell = {
  id: string,
  name: string,
  hour: number,
  minute: number,
}

export type Period = {
  bell: Bell,
  subject?: string,
}

export type Day = Period[]

export type Timetable = {
  subjects: Subject[],
  timetable: Day[],
}
