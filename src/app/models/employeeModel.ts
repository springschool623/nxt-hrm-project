export interface Employee {
  employeeId: string
  name: string
  email: string
  phone: string
  joinDate: string
  role: string
  avatar?: string // URL của ảnh đại diện
  socialLinks?: { platform: string; url: string }[] // Mảng các liên kết mạng xã hội
  manager?: string // Tham chiếu đến manager nếu có
  status?: string
  leaveBalance?: number // Số ngày phép còn lại
}
