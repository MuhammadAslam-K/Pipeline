"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateLeadStatus } from "@/actions/lead.actions";
import { ILead } from "@/models/Lead";
import { Phone, BookOpen, User, CalendarDays, Edit, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const statuses = [
  "Interested",
  "Discussing in Home",
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
      <div className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b last:border-b-0 group relative">
        <DialogTrigger
          render={
            <div className="flex-1 flex items-center justify-between cursor-pointer mr-12" />
          }
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg leading-none">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-left">
              <h4 className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors">{lead.name}</h4>
              <p className="text-sm text-gray-500">{lead.phone}</p>
            </div>
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2 justify-end">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <span className="text-xs font-semibold text-gray-700">{lead.setter}</span>
            </div>
          </div>
        </DialogTrigger>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const phone = String(lead.phone).replace(/\D/g, "");
            const isAndroid = /Android/i.test(navigator.userAgent);
            
            if (isAndroid) {
              // Try to force WhatsApp Business on Android
              window.location.href = `intent://send/${phone}#Intent;scheme=smsto;package=com.whatsapp.w4b;action=android.intent.action.SENDTO;end`;
            } else {
              // Standard link for iOS and Desktop
              window.open(`https://wa.me/${phone}`, "_blank", "noreferrer");
            }
          }}
          className="absolute right-4 p-2 text-[#25D366] hover:bg-green-50 rounded-full transition-colors z-20 flex items-center justify-center h-10 w-10"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </button>
      </div>
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
