// Mock data for the admin content screen: replace with API data.
export const quizzes = [
  {
    id: 1,
    question: 'Một gram chất béo cung cấp khoảng bao nhiêu kcal?',
    topic: 'Dinh dưỡng cơ bản',
    active: true,
  },
  {
    id: 2,
    question: 'Thực phẩm nào sau đây giàu protein nhất trên 100 g?',
    topic: 'Dinh dưỡng cơ bản',
    active: true,
  },
  { id: 3, question: 'Chỉ số BMR cho biết điều gì?', topic: 'Chuyển hóa', active: true },
  {
    id: 4,
    question: 'Uống bao nhiêu nước mỗi ngày là hợp lý với người trưởng thành?',
    topic: 'Thói quen',
    active: true,
  },
  {
    id: 5,
    question: 'Chất xơ hòa tan có trong thực phẩm nào?',
    topic: 'Dinh dưỡng cơ bản',
    active: false,
  },
  {
    id: 6,
    question: 'Bữa sáng có thật sự là bữa quan trọng nhất?',
    topic: 'Thói quen',
    active: true,
  },
]

export const quests = [
  {
    id: 1,
    title: 'Ghi nhật ký 5 ngày trong tuần',
    kind: 'Số lần',
    target: '5 ngày',
    reward: 80,
    active: true,
  },
  {
    id: 2,
    title: 'Đạt mục tiêu protein 3 ngày',
    kind: 'Số lần',
    target: '3 ngày',
    reward: 120,
    active: true,
  },
  {
    id: 3,
    title: 'Giữ calo trong ngưỡng mục tiêu',
    kind: 'Phần trăm',
    target: '80 %',
    reward: 150,
    active: true,
  },
  {
    id: 4,
    title: 'Uống đủ nước 4 ngày liên tiếp',
    kind: 'Số lần',
    target: '4 ngày',
    reward: 60,
    active: false,
  },
  {
    id: 5,
    title: 'Ghi đủ 3 bữa mỗi ngày',
    kind: 'Phần trăm',
    target: '70 %',
    reward: 100,
    active: true,
  },
]
