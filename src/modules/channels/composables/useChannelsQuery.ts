import { apiClient } from '@/services/api.client'
import type { Channel } from '../types/channels.types'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/vue-query'
import { useApiQuery, useApiMutation } from '@/composables/api/config/useApiQuery'

export function useChannelsQuery(
  options?: Omit<UseQueryOptions<Channel[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useApiQuery<Channel[]>(['channels'], '/dashboard/channels', {
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export function useDeleteChannelMutation(
  options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>,
) {
  return useApiMutation<void, string>('', 'delete', {
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/dashboard/channels/${id}`)
      return response.data
    },
    ...options,
  })
}
