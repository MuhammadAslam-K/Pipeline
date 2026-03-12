"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ILead } from "@/models/Lead";
import { Phone, BookOpen, User, CalendarDays, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const statuses = [
  "Interested",
  "Discussing in Home",
  "Will Do (Needed Time)",
  "This Month Admission",
];

export function LeadCard({ 
  lead, 
  onEdit, 
  onStatusChange,
  onDelete
}: { 
  lead: ILead; 
  onEdit: (lead: ILead) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onDelete: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    onStatusChange(String(lead._id), newStatus);
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
              window.location.href = `intent://send/${phone}#Intent;scheme=smsto;package=com.whatsapp.w4b;action=android.intent.action.SENDTO;end`;
            } else {
              window.open(`https://wa.me/${phone}`, "_blank", "noreferrer");
            }
          }}
          className="absolute right-4 p-2 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white rounded-full shadow-md hover:shadow-lg transition-all z-20 flex items-center justify-center h-8 w-8"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <DialogTitle className="text-xl font-bold">{lead.name}</DialogTitle>
          <div className="flex items-center gap-1">
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsDetailOpen(false);
                onDelete(String(lead._id));
              }}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
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
