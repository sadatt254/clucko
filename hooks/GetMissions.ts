import { useMemo } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { CluckoMain, ABI_URL } from "@/lib/constants";

// The ABI_URL must have the getMissions() function signature and Mission struct!
export function useMissionManagement() {
  const { address: userAddress } = useAccount();

  const { data: missionFee } = useReadContract({
    address: CluckoMain,
    abi: ABI_URL,
    functionName: "missionFee",
  }) as { data: bigint | undefined };

  // READ missions from contract using getMissions (returns Mission[])
  const {
    data: missions,
    isLoading: isMissionsLoading,
    error: missionsError,
    refetch: refetchMissions,
  } = useReadContract({
    address: CluckoMain,
    abi: ABI_URL,
    functionName: "getMissions",
    watch: true, // watches for blockchain changes, optional
  });

  // create mission write logic as before
  const { writeContract, isPending, data: txHash, error } = useWriteContract();

  async function createMission(
    _missionName: string,
    _missionDescription: string,
    _targetContract: `0x${string}`,
    _rewardAmount: bigint,
    _feedsToken: `0x${string}`
  ) {
    return await writeContract({
      address: CluckoMain,
      abi: ABI_URL,
      functionName: "createMission",
      args: [
        _missionName,
        _missionDescription,
        _targetContract,
        _rewardAmount,
        _feedsToken,
      ],
      value: missionFee ?? BigInt(0),
    });
  }

  return useMemo(
    () => ({
      missions,           // will be Mission[] if ABI decodes correctly
      isMissionsLoading,
      missionsError,
      refetchMissions,
      createMission,
      isPending,
      txHash,
      error,
    }),
    [
      missions,
      isMissionsLoading,
      missionsError,
      refetchMissions,
      isPending,
      txHash,
      error,
      createMission,
    ]
  );
}
