"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateLeadStatus } from "@/actions/lead.actions";
import { ILead } from "@/models/Lead";
import { Phone, BookOpen, User, CalendarDays, Edit } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const statuses = [
  "Interested",
  "Discussing in Home",
  "Discussion Completed",
  "Will Do (Needed Time)",
  "This Month Admission",
];

export function LeadCard({ lead, onEdit }: { lead: ILead; onEdit: (lead: ILead) => void }) {
  const [loading, setLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateLeadStatus(String(lead._id), newStatus);
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Interested":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Discussing in Home":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Discussion Completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Will Do (Needed Time)":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "This Month Admission":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DialogTrigger
        render={
          <Card className="w-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-primary/50 group" />
        }
      >
        <CardContent className="p-3">
          <h4 className="font-bold text-sm group-hover:text-primary transition-colors truncate">{lead.name}</h4>
          <p className="text-xs text-muted-foreground truncate">{lead.course}</p>
        </CardContent>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <DialogTitle className="text-xl font-bold">{lead.name}</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setIsDetailOpen(false);
              onEdit(lead);
            }} 
            className="text-gray-500 hover:text-blue-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Badge className={`${getStatusColor(lead.status)} border-none font-semibold shadow-sm mb-2`}>
            {lead.status}
          </Badge>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone
              </Label>
              <p className="text-sm font-medium">{lead.phone}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Course
              </Label>
              <p className="text-sm font-medium">{lead.course}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" /> Setter
              </Label>
              <p className="text-sm font-medium">{lead.setter}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Created
              </Label>
              <p className="text-sm font-medium">{new Date(lead.timestamp).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Change Status</Label>
            <Select
              disabled={loading}
              defaultValue={lead.status}
              onValueChange={(val) => val && handleStatusChange(val)}
            >
              <SelectTrigger className="w-full bg-muted/50 focus:ring-1 focus:ring-primary focus:bg-background transition-colors">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
