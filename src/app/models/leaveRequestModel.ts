export interface LeaveRequest {
  requestId: string
  employeeId: string
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  approverId?: string // ID của người phê duyệt
  submittedDate: Date
  avatar: string
  name: string
}
