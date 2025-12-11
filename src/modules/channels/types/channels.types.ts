export interface Channel {
  id: string
  name: string // The channel identifier (e.g., 'production', 'beta')
  app_id?: string
  platform?: 'android' | 'ios' | 'web'
  created_at?: string
  updated_at?: string
  bundle_count?: number // Optional count of bundles in this channel
  device_count?: number // Optional count of devices assigned to this channel
}
