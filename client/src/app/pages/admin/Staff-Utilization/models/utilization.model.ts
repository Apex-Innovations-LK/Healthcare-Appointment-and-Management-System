export interface UtilizationRecord {
    id: string
    name: string
    role: string
    date: string
    scheduled_hours: number
    active_hours: number
    utilization: number
    idle_time: string
    overtime: number
    status: string
  }
  