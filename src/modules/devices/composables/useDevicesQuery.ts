import type { UseMutationOptions, UseQueryOptions } from '@tanstack/vue-query'
import { useGenerateClusteredDevices } from './useGenerateDevices'

export function useDevicesQuery(
  options?: Omit<UseQueryOptions<Device[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useApiQuery<Device[]>(['devices'], '/dashboard/devices', {
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600))

      return useGenerateClusteredDevices(20, 50)
    },
    ...options,
  })
}

export function useDeleteDeviceMutation(
  options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>,
) {
  return useApiMutation<void, string>('', 'delete', {
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/dashboard/devices/${id}`)
      return response.data
    },
    ...options,
  })
}

export function useUpdateDeviceChannelMutation(
  options?: Omit<UseMutationOptions<Device, Error, { id: string; channel: string }>, 'mutationFn'>,
) {
  return useApiMutation<Device, { id: string; channel: string }>('', 'put', {
    mutationFn: async ({ id, channel }: { id: string; channel: string }) => {
      const response = await apiClient.put(`/dashboard/devices/${id}/channel`, { channel })
      return response.data
    },
    ...options,
  })
}
