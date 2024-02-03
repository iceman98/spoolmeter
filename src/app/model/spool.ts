export interface Spool {
  id: string,
  name?: string,
  color?: string,
  brand?: string,
  material?: string,
  spoolWeight?: number,
  initialFilamentWeight?: number,
  remainingFilamentWeight?: number,
  flowFactor?: number,
  temperature?: number
}
