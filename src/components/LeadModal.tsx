"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ILead } from "@/models/Lead";
import { Label } from "./ui/label";

type LeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lead?: ILead | null;
  onSave: (data: Partial<ILead>) => void;
};

const setters = ["Bashid", "Albirt", "Aslam", "Asla", "Athira", "Farsana", "Shahna"];
const statuses = ["Interested", "Discussing in Home", "Will Do (Needed Time)", "This Month Admission"];

export function LeadModal({ isOpen, onClose, lead, onSave }: LeadModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "",
    setter: setters[0],
    status: statuses[0],
  });

  // Sync form data when lead changes or modal opens
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        phone: lead.phone?.toString() || "",
        course: lead.course || "",
        setter: lead.setter || setters[0],
        status: lead.status || statuses[0],
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        course: "",
        setter: setters[0],
        status: statuses[0],
      });
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSave({ ...formData, phone: Number(formData.phone) });
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save lead");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{lead ? "Edit Lead" : "Add New Lead"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="number"
              placeholder="1234567890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Course/University</Label>
            <Input
              id="course"
              placeholder="Course/University"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="setter">Setter</Label>
            <Select
              value={formData.setter}
              onValueChange={(value) => value && setFormData({ ...formData, setter: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a setter" />
              </SelectTrigger>
              <SelectContent>
                {setters.map((setter) => (
                  <SelectItem key={setter} value={setter}>
                    {setter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => value && setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Lead"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
