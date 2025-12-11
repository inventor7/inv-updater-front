import { useApiQuery } from '@/composables/api/config/useApiQuery'
import type { DashboardStats, DashboardStatsData } from '../types/statistics.types'
import type { UseQueryOptions } from '@tanstack/vue-query'

export function useDashboardStatsQuery(
  options?: Omit<UseQueryOptions<DashboardStats, Error>, 'queryKey' | 'queryFn'>,
) {
  return useApiQuery<DashboardStats>(['dashboard', 'stats'], '/dashboard/stats', {
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export function useDashboardStatsDataQuery(
  timeRange: 'day' | 'week' | 'month' | 'year' = 'month',
  options?: Omit<UseQueryOptions<DashboardStatsData, Error>, 'queryKey' | 'queryFn'>,
) {
  return useApiQuery<DashboardStatsData>(
    ['dashboard', 'stats-data', timeRange],
    `/dashboard/stats-data?range=${timeRange}`,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    },
  )
}
