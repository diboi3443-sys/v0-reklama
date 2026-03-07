import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { api, JobStatus } from '@/lib/api-client'

export function useJobStatus(jobId: string | null) {
  const [isPolling, setIsPolling] = useState(false)

  // Start polling when jobId is set
  useEffect(() => {
    if (jobId) {
      setIsPolling(true)
    }
  }, [jobId])

  // SWR with auto-refresh for polling
  const { data, error, mutate } = useSWR<JobStatus>(
    jobId && isPolling ? `/generate/status/${jobId}` : null,
    () => api.getJobStatus(jobId!),
    {
      refreshInterval: isPolling && jobId ? 2000 : 0, // Poll every 2 seconds
      revalidateOnFocus: false,
    }
  )

  // Stop polling when job is completed or failed
  useEffect(() => {
    if (data?.status === 'completed' || data?.status === 'failed') {
      setIsPolling(false)
    }
  }, [data?.status])

  return {
    job: data,
    isLoading: !!jobId && !data && !error, // Only loading if we have a jobId
    isError: !!error,
    error,
    refresh: mutate,
    stopPolling: () => setIsPolling(false),
    startPolling: () => setIsPolling(true),
  }
}
