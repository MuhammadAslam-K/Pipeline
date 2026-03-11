import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  name: string;
  phone: number;
  course: string;
  setter: string;
  status: string;
  timestamp: Date;
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  course: { type: String, required: true },
  setter: { 
    type: String, 
    enum: ["Bashid", "Albirt", "Athira", "Farsana", "Shahna"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Interested", "Discussing in Home", "Discussion Completed", "Will Do (Needed Time)", "This Month Admission"],
    default: "Interested",
    required: true
  },
  timestamp: { type: Date, default: Date.now },
});

export const Lead = mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
