export interface Bundle {
  id: string;
  platform: 'android' | 'ios' | 'web';
  version: string;
  download_url: string;
  checksum?: string;
  session_key?: string;
  channel: 'stable' | 'beta' | 'dev';
  environment: 'prod' | 'staging' | 'dev';
  required: boolean;
  active: boolean;
  created_at: string;
  created_by?: string;
}

export interface NativeUpdate {
  id: string;
  platform: 'android' | 'ios';
  version: string;
  version_code: number;
  download_url: string;
  checksum?: string;
  channel: 'stable' | 'beta' | 'dev';
  environment: 'prod' | 'staging' | 'dev';
  required: boolean;
  active: boolean;
  created_at: string;
  created_by?: string;
  file_size?: number;
  release_notes?: string;
}

export interface UpdateOrBundle {
  id: string | number;
  type: 'bundle' | 'native';
  platform: 'android' | 'ios' | 'web';
  version: string;
  version_code?: number; // Only for native updates
  download_url: string;
  checksum?: string;
  session_key?: string; // Only for bundles
  channel: 'stable' | 'beta' | 'dev';
  environment: 'prod' | 'staging' | 'dev';
  required: boolean;
  active: boolean;
  created_at: string;
  created_by?: string;
  file_size?: number; // Only for native updates
  release_notes?: string; // Only for native updates
}

export type BulkEditData = {
  channel?: string;
  environment?: string;
  required?: string;
  active?: string;
};