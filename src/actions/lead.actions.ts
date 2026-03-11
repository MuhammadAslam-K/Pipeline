"use server";

import connectToDatabase from "@/lib/db";
import { Lead } from "@/models/Lead";
import { revalidatePath } from "next/cache";

export async function getLeads() {
  await connectToDatabase();
  try {
    const leads = await Lead.find({}).sort({ timestamp: -1 }).lean();
    return JSON.parse(JSON.stringify(leads));
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    throw new Error("Failed to fetch leads");
  }
}

export async function createLead(data: {
  name: string;
  phone: number;
  course: string;
  setter: string;
}) {
  await connectToDatabase();
  try {
    const newLead = await Lead.create({ ...data });
    revalidatePath("/");
    return JSON.parse(JSON.stringify(newLead));
  } catch (error) {
    console.error("Failed to create lead:", error);
    throw new Error("Failed to create lead");
  }
}

export async function updateLead(
  id: string,
  data: { name: string; phone: number; course: string; setter: string }
) {
  await connectToDatabase();
  try {
    const updatedLead = await Lead.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/");
    return JSON.parse(JSON.stringify(updatedLead));
  } catch (error) {
    console.error("Failed to update lead:", error);
    throw new Error("Failed to update lead");
  }
}

export async function updateLeadStatus(id: string, newStatus: string) {
  await connectToDatabase();
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );
    revalidatePath("/");
    return JSON.parse(JSON.stringify(updatedLead));
  } catch (error) {
    console.error("Failed to update lead status:", error);
    throw new Error("Failed to update lead status");
  }
}
