export interface Device {
  id: string
  device_id: string
  app_id?: string
  platform: 'android' | 'ios'
  channel?: string
  custom_channel?: string // If overridden
  current_bundle_id?: string
  current_native_id?: string
  last_check?: string
  created_at?: string
  updated_at?: string
  latitude?: number
  longitude?: number
}
