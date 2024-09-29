export interface Employee {
  employeeId: string
  name: string
  email: string
  phone: string
  joinDate: string
  role: string
  department?: string
  avatar?: string // URL của ảnh đại diện
  status?: string
  leaveBalance?: number // Số ngày phép còn lại
  salary: number
}
