import mongoose, { Schema, Document } from "mongoose";

export interface ILead {
  _id: string;
  name: string;
  phone: number;
  course: string;
  setter: string;
  status: string;
  timestamp: Date;
}

export interface ILeadDocument extends ILead, mongoose.Document {
  _id: any;
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  course: { type: String, required: true },
  setter: {
    type: String,
    enum: ["Bashid", "Albirt", "Aslam", "Asla", "Athira", "Farsana", "Shahna"],
    required: true
  },
  status: {
    type: String,
    enum: ["Next Month", "Discussing in Home", "Will Do (Needed Time)", "This Month Admission"],
    default: "Discussing in Home",
    required: true
  },
  timestamp: { type: Date, default: Date.now },
});

export const Lead = mongoose.models.Lead || mongoose.model<ILeadDocument>("Lead", LeadSchema);
