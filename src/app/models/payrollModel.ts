export interface Payroll {
  payrollId: string
  employeeId: string
  month: string // Tháng tính lương (VD: '2023-09')
  baseSalary: number
  overtimeHours: number
  deductions: number
  netSalary: number
  paidOn: Date
}
