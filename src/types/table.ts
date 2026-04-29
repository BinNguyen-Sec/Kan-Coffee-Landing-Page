export type TableStatus = 'available' | 'pending' | 'booked'
export type TableZone = 'indoor' | 'outdoor'

export interface Table {
  id: string
  name: string
  floor: 1 | 2
  zone: TableZone
  capacity: number
  pos_x: number
  pos_y: number
  is_bookable: boolean
  status: TableStatus
  created_at: string
}