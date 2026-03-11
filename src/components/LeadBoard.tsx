"use client";

import { useState } from "react";
import { ILead } from "@/models/Lead";
import { LeadCard } from "./LeadCard";
import { LeadModal } from "./LeadModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Users, ChevronLeft, ArrowRight, UserPlus, MessageSquare, DollarSign, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const statuses = [
  "Interested",
  "Discussing in Home",
  "Will Do (Needed Time)",
  "This Month Admission",
];

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  "Interested": { color: "bg-[#39B5A3]", icon: UserPlus, label: "Interested" },
  "Discussing in Home": { color: "bg-[#4D96F1]", icon: MessageSquare, label: "Discussing in Home" },
  "Will Do (Needed Time)": { color: "bg-[#F8A651]", icon: Clock, label: "Will Do (Needed Time)" },
  "This Month Admission": { color: "bg-[#F16C91]", icon: Star, label: "This Month Admissions" },
};

const setters = ["All", "Bashid", "Aslam", "Asla", "Albirt", "Athira", "Farsana", "Shahna"];

export function LeadBoard({ initialLeads }: { initialLeads: ILead[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSetter, setFilterSetter] = useState("All");
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<ILead | null>(null);

  const handleEdit = (lead: ILead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const filteredLeads = initialLeads.filter((lead) => {
    return (
      (filterSetter === "All" || lead.setter === filterSetter) &&
      (lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.course.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getStageCount = (status: string) => {
    return filteredLeads.filter((l) => l.status === status).length;
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center gap-2">
            {activeStage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveStage(null)}
                className="mr-1"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="bg-primary/10 p-2 rounded-lg">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {activeStage || "Pipeline Stages"}
            </h2>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="lg:hidden gap-1 shadow-sm">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-muted/50 focus:bg-background transition-colors h-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={filterSetter} onValueChange={(val) => val && setFilterSetter(val)}>
              <SelectTrigger className="w-full lg:w-[140px] bg-muted/50 h-9 text-sm">
                <SelectValue placeholder="Setter" />
              </SelectTrigger>
              <SelectContent>
                {setters.map((setter) => (
                  <SelectItem key={setter} value={setter}>
                    {setter === "All" ? "All Setters" : setter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={() => setIsModalOpen(true)} className="hidden lg:flex gap-2 shadow-sm h-9">
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </div>
        </div>
      </div>

      {!activeStage ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6">
          {statuses.map((status) => {
            const config = statusConfig[status];
            const StatusIcon = config.icon;
            return (
              <Card
                key={status}
                className={`${config.color} border-none shadow-lg hover:brightness-95 transition-all cursor-pointer rounded-3xl overflow-hidden min-h-[160px] relative group`}
                onClick={() => setActiveStage(status)}
              >
                <CardContent className="p-5 sm:p-8 h-full flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl sm:text-4xl font-bold opacity-90">{getStageCount(status)}</span>
                    <StatusIcon className="w-8 h-8 sm:w-10 h-10 opacity-80" />
                  </div>
                  <div className="mt-4">
                    <p className="text-lg sm:text-2xl font-bold leading-tight break-words">{config.label}</p>
                  </div>

                  {/* Subtle hover indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 p-2 rounded-full">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-2 duration-300 bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border overflow-hidden">
          {filteredLeads
            .filter((lead) => lead.status === activeStage)
            .map((lead) => (
              <LeadCard key={String(lead._id)} lead={lead} onEdit={handleEdit} />
            ))}

          {filteredLeads.filter((l) => l.status === activeStage).length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No leads found in this stage</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveStage(null)}
              >
                Go back to stages
              </Button>
            </div>
          )}
        </div>
      )}

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
        lead={editingLead}
      />
    </div>
  );
}
