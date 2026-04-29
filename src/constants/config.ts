export const BUSINESS_CONFIG = {
  name: 'Kan Coffee',
  address: '35 D5, Ward 25, Thanh My Tay, Ho Chi Minh City 700000, Vietnam',
  openTime: '07:00',
  closeTime: '23:30',
  lastOrder: '22:30',
  email: '',    // TBD
  phone: '',    // TBD
  floors: [1, 2] as const,
} as const

export const BOOKING_CONFIG = {
  durations: [60, 90, 120] as const,
  defaultDuration: 90,
  pendingExpiryMinutes: 15,
  bookingOpenTime: '07:00',
  bookingCloseTime: '22:30',
} as const

export const BRAND_COLORS = {
  primary:  '#4D8E00',
  mid:      '#80AE4A',
  light:    '#A0C060',
  dark:     '#315D02',
  offwhite: '#F9FBF6',
  wood:     '#C8A96E',
} as const