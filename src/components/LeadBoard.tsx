"use client";

import { useState } from "react";
import { ILead } from "@/models/Lead";
import { LeadCard } from "./LeadCard";
import { LeadModal } from "./LeadModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Users, ChevronLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const statuses = [
  "Interested",
  "Discussing in Home",
  "Discussion Completed",
  "Will Do (Needed Time)",
  "This Month Admission",
];

const setters = ["All", "Bashid", "Albirt", "Athira", "Farsana", "Shahna"];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statuses.map((status) => (
            <Card 
              key={status} 
              className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
              onClick={() => setActiveStage(status)}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 max-w-[70%]">{status}</h3>
                  <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
                    {getStageCount(status)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground font-medium group-hover:text-primary transition-colors">
                  View Leads <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
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
