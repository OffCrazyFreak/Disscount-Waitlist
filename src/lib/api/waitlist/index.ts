import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../api-base";
import {
  WaitlistSubmission,
  WaitlistEntryDto,
  WaitlistStats,
  waitlistSubmissionSchema,
  waitlistEntryDtoSchema,
  waitlistStatsSchema,
} from "../schemas/waitlist";

const WAITLIST_BASE_PATH = "/waitlist";

/**
 * Submit email to waitlist
 */
export async function submitToWaitlist(
  data: WaitlistSubmission
): Promise<WaitlistEntryDto> {
  // Validate input
  const validatedData = waitlistSubmissionSchema.parse(data);

  const response = await apiClient.post<WaitlistEntryDto>(
    WAITLIST_BASE_PATH,
    validatedData
  );

  // Validate response
  return waitlistEntryDtoSchema.parse(response.data);
}

/**
 * Get waitlist count
 */
export async function getWaitlistCount(): Promise<WaitlistStats> {
  const response = await apiClient.get<WaitlistStats>(
    `${WAITLIST_BASE_PATH}/count`
  );

  // Validate response
  return waitlistStatsSchema.parse(response.data);
}

// React Query hooks

/**
 * Hook to submit to waitlist
 */
export const useSubmitToWaitlist = () => {
  return useMutation<WaitlistEntryDto, Error, WaitlistSubmission>({
    mutationFn: submitToWaitlist,
  });
};

/**
 * Hook to get waitlist count
 */
export const useGetWaitlistCount = () => {
  return useQuery<WaitlistStats, Error>({
    queryKey: ["waitlist", "count"],
    queryFn: getWaitlistCount,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

const waitlistService = {
  submitToWaitlist,
  getWaitlistCount,
  // React Query hooks
  useSubmitToWaitlist,
  useGetWaitlistCount,
};

export default waitlistService;
