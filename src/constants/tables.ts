export interface TablePosition {
  id: string
  name: string
  floor: 1 | 2
  x: number
  y: number
  width: number
  height: number
  isBookable: boolean
}

// Isometric grid unit = 40px
// Floor 1 Indoor
export const FLOOR1_INDOOR: TablePosition[] = [
  // 3 bàn trước quầy
  { id: '', name: '1I-01', floor: 1, x: 1, y: 1, width: 1, height: 1, isBookable: true },
  { id: '', name: '1I-02', floor: 1, x: 2, y: 1, width: 1, height: 1, isBookable: true },
  { id: '', name: '1I-03', floor: 1, x: 3, y: 1, width: 1, height: 1, isBookable: true },
  // Bàn dài giữa
  { id: '', name: '1I-04', floor: 1, x: 1, y: 3, width: 3, height: 1, isBookable: true },
  // Cụm X góc trái trên
  { id: '', name: '1I-05', floor: 1, x: 1, y: 5, width: 1, height: 1, isBookable: true },
  { id: '', name: '1I-06', floor: 1, x: 2, y: 5, width: 1, height: 1, isBookable: true },
  { id: '', name: '1I-07', floor: 1, x: 3, y: 5, width: 1, height: 1, isBookable: true },
  { id: '', name: '1I-08', floor: 1, x: 4, y: 5, width: 1, height: 1, isBookable: true },
  // Cụm X góc trái dưới
  { id: '', name: '1I-09', floor: 1, x: 1, y: 7, width: 1, height: 1, isBookable: true },
  { id: '', name: '1I-10', floor: 1, x: 2, y: 7, width: 1, height: 1, isBookable: true },
  { id: '', name: '1I-11', floor: 1, x: 3, y: 7, width: 1, height: 1, isBookable: true },
  { id: '', name: '1I-12', floor: 1, x: 4, y: 7, width: 1, height: 1, isBookable: true },
  { id: '', name: '1I-13', floor: 1, x: 5, y: 7, width: 1, height: 1, isBookable: true },
]

// Floor 1 Outdoor (walk-in only)
export const FLOOR1_OUTDOOR: TablePosition[] = [
  { id: '', name: '1O-01', floor: 1, x: -2, y: 1, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-02', floor: 1, x: -2, y: 2, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-03', floor: 1, x: -2, y: 3, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-04', floor: 1, x: -2, y: 4, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-05', floor: 1, x: -2, y: 5, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-06', floor: 1, x: -2, y: 6, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-07', floor: 1, x: 1, y: 10, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-08', floor: 1, x: 2, y: 10, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-09', floor: 1, x: 3, y: 10, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-10', floor: 1, x: 4, y: 10, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-11', floor: 1, x: 5, y: 10, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-12', floor: 1, x: 6, y: 10, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-13', floor: 1, x: 7, y: 10, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-14', floor: 1, x: 1, y: 11, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-15', floor: 1, x: 2, y: 11, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-16', floor: 1, x: 3, y: 11, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-17', floor: 1, x: 4, y: 11, width: 1, height: 1, isBookable: false },
  { id: '', name: '1O-18', floor: 1, x: 5, y: 11, width: 1, height: 1, isBookable: false },
]

// Floor 2 Indoor
export const FLOOR2_INDOOR: TablePosition[] = [
  { id: '', name: '2I-01', floor: 2, x: 1, y: 1, width: 1, height: 1, isBookable: true },
  { id: '', name: '2I-02', floor: 2, x: 2, y: 1, width: 1, height: 1, isBookable: true },
  { id: '', name: '2I-03', floor: 2, x: 3, y: 1, width: 1, height: 1, isBookable: true },
  { id: '', name: '2I-04', floor: 2, x: 4, y: 1, width: 1, height: 1, isBookable: true },
  { id: '', name: '2I-05', floor: 2, x: 1, y: 3, width: 1, height: 1, isBookable: true },
  { id: '', name: '2I-06', floor: 2, x: 2, y: 3, width: 1, height: 1, isBookable: true },
]