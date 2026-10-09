export const strengthLabels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh']

export function passwordScore(password: string) {
  if (!password) return 0
  const passed = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length
  return Math.max(1, passed)
}
