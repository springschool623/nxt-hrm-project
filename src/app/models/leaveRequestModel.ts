export interface LeaveRequest {
  requestId: string
  employeeId: string
  startDate: Date
  endDate: Date
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  approverId?: string // ID của người phê duyệt
  submittedDate: Date
}
