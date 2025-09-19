"use client";

import { Header } from "@/components/Header";
import { Wheat, Plus } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, ChangeEvent, FormEvent } from "react";
import { useMissionManagement } from "@/hooks/GetMissions";

const Modal = ({
  children,
  open,
  onClose,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="bg-[#171617] rounded-lg p-8 shadow-crypto border border-[#292e33] w-full max-w-[400px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default function Home() {
  // Wagmi custom hook integration
  const {
    missions,
    isMissionsLoading,
    missionsError,
    refetchMissions,
    createMission,
    isPending,
    txHash,
    error,
  } = useMissionManagement();

  // Modal state for create mission
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // State for form values
  const [newMission, setNewMission] = useState({
    missionName: "",
    missionDescription: "",
    targetContract: "",
    rewardAmount: "",
    feedsToken: "",
  });
  const [abiText, setAbiText] = useState("");

  function handleAbiFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => setAbiText((evt.target?.result as string) || "");
    reader.readAsText(file);
  }

  async function handleCreateMission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !newMission.missionName ||
      !newMission.missionDescription ||
      !newMission.targetContract ||
      !newMission.rewardAmount ||
      !newMission.feedsToken
    ) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await createMission(
        newMission.missionName,
        newMission.missionDescription,
        newMission.targetContract as `0x${string}`,
        BigInt(newMission.rewardAmount),
        newMission.feedsToken as `0x${string}`
      );
      setNewMission({
        missionName: "",
        missionDescription: "",
        targetContract: "",
        rewardAmount: "",
        feedsToken: "",
      });
      setIsCreateModalOpen(false);
      await refetchMissions(); // Refresh mission list after new mission
    } catch (err) {
      alert(`Error creating mission: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return (
    <div className="bg-[#0e0f11f2] font-sans relative min-h-screen p-2 sm:p-6">
      <Header />
      <main className="flex flex-col items-center justify-center w-full flex-1 pt-24 md:pt-28">
        <div className="w-full mx-5 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
                Missions
              </h2>
              <p className="text-sm text-muted-foreground">
                Explore and complete missions to earn rewards
              </p>
            </div>
            <Button
              className="bg-[#65EC72] text-[#171617] hover:bg-green-700 rounded-full"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="size-4 mr-2" />
              Create Mission
            </Button>
          </div>
          {isMissionsLoading ? (
            <div className="py-8 text-center text-lg text-muted-foreground">
              Loading missions...
            </div>
          ) : missionsError ? (
            <div className="py-8 text-center text-red-400">
              Error loading missions: {String(missionsError.message || missionsError)}
            </div>
          ) : Array.isArray(missions) && missions.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl">
              {missions.map((mission: any, index: number) => (
                <Card
                  key={mission.id || index}
                  className="relative bg-[#151515] rounded-2xl border-transparent text-muted-foreground flex flex-col h-64"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl sm:text-2xl mb-2 text-white">
                          {mission.missionName}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {mission.missionDescription}
                        </CardDescription>
                      </div>
                      <Badge
                        className={mission.isActive ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}
                      >
                        {mission.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        {/* You may update this image logic if missions include logos */}
                        <img
                          src="/logo.svg"
                          alt={`${mission.missionName} logo`}
                          className="h-8 w-8 rounded-full object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-1 text-[#65ec72] font-medium">
                        <Wheat className="size-4" />
                        {String(mission.rewardAmount)} Feeds
                      </div>
                    </div>
                    <Button
                      className="bg-[#65EC72] text-[#171617] hover:bg-green-700 rounded-full"
                    >
                      Start Mission
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-lg text-muted-foreground">
              No missions found.
            </div>
          )}
        </div>
      </main>

      {/* Create Mission Modal (unchanged) */}
      <Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-6 text-white text-center tracking-tight">
          New Mission Setup
        </h2>
        <form className="space-y-6" onSubmit={handleCreateMission}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="missionName" className="text-sm text-muted-foreground mb-1 block">
                Mission Name
              </Label>
              <Input
                id="missionName"
                value={newMission.missionName}
                onChange={e => setNewMission({ ...newMission, missionName: e.target.value })}
                placeholder="e.g. Provide Liquidity on Hyperion"
                className="bg-[#212127] border-[#32343a] rounded-xl text-lg py-3 px-4 placeholder:text-[#68697a] text-white focus:ring-[#65EC72]"
              />
            </div>
            <div>
              <Label htmlFor="targetContract" className="text-sm text-muted-foreground mb-1 block">
                Target Contract Address
              </Label>
              <Input
                id="targetContract"
                value={newMission.targetContract}
                onChange={e => setNewMission({ ...newMission, targetContract: e.target.value })}
                placeholder="0xABC…123 - e.g. protocol pool"
                className="bg-[#212127] border-[#32343a] rounded-xl text-lg py-3 px-4 placeholder:text-[#68697a] text-white focus:ring-[#65EC72]"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="missionDescription" className="text-sm text-muted-foreground mb-1 block">
                Mission Description
              </Label>
              <Input
                id="missionDescription"
                value={newMission.missionDescription}
                onChange={e => setNewMission({ ...newMission, missionDescription: e.target.value })}
                placeholder="Describe the mission clearly so users know what to do…"
                className="bg-[#212127] border-[#32343a] rounded-xl text-lg py-3 px-4 placeholder:text-[#68697a] text-white focus:ring-[#65EC72]"
              />
            </div>
            <div>
              <Label htmlFor="rewardAmount" className="text-sm text-muted-foreground mb-1 block">
                Reward Amount
              </Label>
              <Input
                id="rewardAmount"
                type="number"
                value={newMission.rewardAmount}
                min={0}
                onChange={e => setNewMission({ ...newMission, rewardAmount: e.target.value })}
                placeholder="e.g. 500"
                className="bg-[#212127] border-[#32343a] rounded-xl text-lg py-3 px-4 placeholder:text-[#68697a] text-white focus:ring-[#65EC72]"
              />
            </div>
            <div>
              <Label htmlFor="feedsToken" className="text-sm text-muted-foreground mb-1 block">
                Reward Token Address
              </Label>
              <Input
                id="feedsToken"
                value={newMission.feedsToken}
                onChange={e => setNewMission({ ...newMission, feedsToken: e.target.value })}
                placeholder="0xDEF…456 - e.g. FEEDS token"
                className="bg-[#212127] border-[#32343a] rounded-xl text-lg py-3 px-4 placeholder:text-[#68697a] text-white focus:ring-[#65EC72]"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground mb-1 block">
              Contract ABI (Paste or Upload)
            </Label>
            <textarea
              value={abiText}
              onChange={e => setAbiText(e.target.value)}
              placeholder='Paste contract ABI JSON here for contract interaction…'
              rows={4}
              className="bg-[#181820] border-[#32343a] text-white w-full rounded-xl p-4 placeholder:text-[#68697a] text-sm focus:ring-[#65EC72] mb-2"
            />
            <Input
              type="file"
              accept=".json,.txt,application/json"
              onChange={handleAbiFileUpload}
              className="bg-[#181820] text-white border-none file:bg-[#65EC72] file:text-[#222] file:rounded-lg"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-6 bg-[#65EC72] text-[#171617] font-bold text-lg rounded-full py-3 hover:bg-green-700 transition-colors"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Mission"}
          </Button>
          {error && (
            <div className="text-red-500 text-sm py-2">{String(error.message || error)}</div>
          )}
          {txHash && (
            <div className="text-green-500 text-sm py-2">
              Mission submitted! Tx: {txHash}
            </div>
          )}
          <Button
            className="w-full bg-transparent text-muted-foreground hover:text-white"
            type="button"
            onClick={() => setIsCreateModalOpen(false)}
          >
            Cancel
          </Button>
        </form>
      </Modal>
    </div>
  );
}
