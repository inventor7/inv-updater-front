import { apiClient } from '@/services/api.client'
import type { UseMutationOptions, UseQueryOptions } from '@tanstack/vue-query'
import { useMutation, useQuery } from '@tanstack/vue-query'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export function useApiQuery<TData = unknown>(
  queryKey: (string | number | object)[],
  url: string,
  options?: Omit<
    UseQueryOptions<TData, Error, TData, (string | number | object)[]>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await apiClient.get(url)
        if (
          typeof response.data === 'object' &&
          response.data !== null &&
          'data' in response.data
        ) {
          return (response.data as ApiResponse<TData>).data
        }
        return response.data
      } catch (error) {
        throw queryErrorHandler(error)
      }
    },
    ...options,
  })
}

export function useApiMutation<TData = unknown, TVariables = unknown>(
  url: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post',
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>,
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      try {
        let response
        switch (method) {
          case 'post':
            response = await apiClient.post(url, variables)
            break
          case 'put':
            response = await apiClient.put(url, variables)
            break
          case 'patch':
            response = await apiClient.patch(url, variables)
            break
          case 'delete':
            response = await apiClient.delete(url)
            break
          default:
            throw new Error(`Unsupported method: ${method}`)
        }
        return response.data
      } catch (error) {
        throw queryErrorHandler(error)
      }
    },
    ...options,
  })
}

export function useAuthenticatedQuery<TData = unknown>(
  queryKey: (string | number | object)[],
  url: string,
  options?: Omit<
    UseQueryOptions<TData, Error, TData, (string | number | object)[]>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await apiClient.get(url)
        if (
          typeof response.data === 'object' &&
          response.data !== null &&
          'data' in response.data
        ) {
          return (response.data as ApiResponse<TData>).data
        }
        return response.data
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          localStorage.removeItem('token')
          window.location.href = '/auth/login'
        }
        throw queryErrorHandler(error)
      }
    },
    ...options,
  })
}
