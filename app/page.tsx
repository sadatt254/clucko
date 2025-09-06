"use client"

import { Header } from "@/components/Header";
import Image from "next/image";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

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
  // Sample mission data with state
  const [missions, setMissions] = useState([
    {
      title: "Provide Liquidity on Hyperion",
      subtitle: "Add Liquidity to any pool on Hyperion",
      protocolLogo: "/hyperion-logo.svg",
      feeds: 100,
      isActive: true,
    },
    {
      title: "Stake Tokens on Aave",
      subtitle: "Stake assets in Aave protocol",
      protocolLogo: "/aave-logo.svg",
      feeds: 150,
      isActive: false,
    },
    {
      title: "Vote on Compound",
      subtitle: "Participate in Compound governance",
      protocolLogo: "/compound-logo.svg",
      feeds: 80,
      isActive: true,
    },
    {
      title: "Swap on Uniswap",
      subtitle: "Execute trades on Uniswap",
      protocolLogo: "/uniswap-logo.svg",
      feeds: 120,
      isActive: true,
    },
  ]);

  // State for create mission modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMission, setNewMission] = useState({
    title: "",
    subtitle: "",
    protocolLogo: "",
    feeds: "",
    isActive: "true",
  });

  const handleCreateMission = () => {
    if (!newMission.title || !newMission.subtitle || !newMission.protocolLogo || !newMission.feeds) {
      alert("Please fill in all fields");
      return;
    }
    setMissions([
      ...missions,
      {
        title: newMission.title,
        subtitle: newMission.subtitle,
        protocolLogo: newMission.protocolLogo,
        feeds: parseInt(newMission.feeds),
        isActive: newMission.isActive === "true",
      },
    ]);
    setNewMission({ title: "", subtitle: "", protocolLogo: "", feeds: "", isActive: "true" });
    setIsCreateModalOpen(false);
  };

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0E0F0E] p-4 rounded-xl">
            {missions.map((mission, index) => (
              <Card
                key={index}
                className="relative bg-[#151515] rounded-2xl border-transparent text-muted-foreground flex flex-col h-64"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl mb-2 text-white">
                        {mission.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {mission.subtitle}
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
                      <img
                        src={mission.protocolLogo}
                        alt={`${mission.title} logo`}
                        className="h-8 w-8 rounded-full object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-1 text-[#65ec72] font-medium">
                      <Wheat className="size-4" />
                      {mission.feeds} Feeds
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
        </div>
      </main>

      {/* Create Mission Modal */}
      <Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4 text-white">Create New Mission</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={newMission.title}
              onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
              placeholder="e.g., Provide Liquidity on Hyperion"
              className="bg-[#292e33] text-white border-[#3a3f45] placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <Label htmlFor="subtitle" className="text-white">Subtitle</Label>
            <Input
              id="subtitle"
              value={newMission.subtitle}
              onChange={(e) => setNewMission({ ...newMission, subtitle: e.target.value })}
              placeholder="e.g., Add Liquidity to any pool on Hyperion"
              className="bg-[#292e33] text-white border-[#3a3f45] placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <Label htmlFor="protocolLogo" className="text-white">Protocol Logo URL</Label>
            <Input
              id="protocolLogo"
              value={newMission.protocolLogo}
              onChange={(e) => setNewMission({ ...newMission, protocolLogo: e.target.value })}
              placeholder="e.g., /hyperion-logo.svg"
              className="bg-[#292e33] text-white border-[#3a3f45] placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <Label htmlFor="feeds" className="text-white">Feeds</Label>
            <Input
              id="feeds"
              type="number"
              value={newMission.feeds}
              onChange={(e) => setNewMission({ ...newMission, feeds: e.target.value })}
              placeholder="e.g., 100"
              className="bg-[#292e33] text-white border-[#3a3f45] placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <Label htmlFor="isActive" className="text-white">Status</Label>
            <Select
              value={newMission.isActive}
              onValueChange={(value) => setNewMission({ ...newMission, isActive: value })}
            >
              <SelectTrigger className="bg-[#292e33] text-white border-[#3a3f45]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full bg-[#65EC72] text-[#171617] hover:bg-green-700 rounded-full"
            onClick={handleCreateMission}
          >
            Create Mission
          </Button>
          <Button
            className="w-full bg-transparent text-muted-foreground hover:text-white"
            onClick={() => setIsCreateModalOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}