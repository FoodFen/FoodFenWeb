// Mock data for the admin users screen: replace with API data.
export type AdminUser = {
  id: number
  name: string
  email: string
  tier: 'free' | 'premium'
  streak: number
  joinedAt: string
  active: boolean
}

export const users: AdminUser[] = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    email: 'minhanh.nguyen@gmail.com',
    tier: 'premium',
    streak: 41,
    joinedAt: '2026-03-14',
    active: true,
  },
  {
    id: 2,
    name: 'Trần Quốc Huy',
    email: 'quochuy.tran@outlook.com',
    tier: 'free',
    streak: 9,
    joinedAt: '2026-08-02',
    active: true,
  },
  {
    id: 3,
    name: 'Phạm Gia Bảo',
    email: 'giabao.pham@gmail.com',
    tier: 'premium',
    streak: 117,
    joinedAt: '2026-01-27',
    active: true,
  },
  {
    id: 4,
    name: 'Võ Ngọc Lan',
    email: 'ngoclan.vo@gmail.com',
    tier: 'premium',
    streak: 63,
    joinedAt: '2026-04-19',
    active: true,
  },
  {
    id: 5,
    name: 'Đặng Hoàng Nam',
    email: 'hoangnam.dang@yahoo.com',
    tier: 'free',
    streak: 3,
    joinedAt: '2026-10-05',
    active: true,
  },
  {
    id: 6,
    name: 'Bùi Khánh Linh',
    email: 'khanhlinh.bui@gmail.com',
    tier: 'free',
    streak: 22,
    joinedAt: '2026-06-30',
    active: true,
  },
  {
    id: 7,
    name: 'Lê Thanh Tùng',
    email: 'thanhtung.le@gmail.com',
    tier: 'free',
    streak: 0,
    joinedAt: '2026-05-11',
    active: false,
  },
  {
    id: 8,
    name: 'Hoàng Thu Hà',
    email: 'thuha.hoang@gmail.com',
    tier: 'premium',
    streak: 88,
    joinedAt: '2026-02-08',
    active: true,
  },
  {
    id: 9,
    name: 'Ngô Đức Thịnh',
    email: 'ducthinh.ngo@outlook.com',
    tier: 'free',
    streak: 14,
    joinedAt: '2026-09-12',
    active: true,
  },
  {
    id: 10,
    name: 'Đỗ Mỹ Duyên',
    email: 'myduyen.do@gmail.com',
    tier: 'free',
    streak: 5,
    joinedAt: '2026-09-29',
    active: true,
  },
  {
    id: 11,
    name: 'Vũ Anh Khoa',
    email: 'anhkhoa.vu@gmail.com',
    tier: 'premium',
    streak: 29,
    joinedAt: '2026-07-21',
    active: false,
  },
  {
    id: 12,
    name: 'Lý Bảo Châu',
    email: 'baochau.ly@gmail.com',
    tier: 'free',
    streak: 47,
    joinedAt: '2026-04-02',
    active: true,
  },
]
