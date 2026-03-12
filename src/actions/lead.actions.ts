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
export async function syncLeads(leads: any[]) {
  await connectToDatabase();
  try {
    // Clear existing leads and replace with new ones
    // Or we could do an upsert. Given the request, replacing might be cleaner to ensure parity.
    // But deleting everything might be risky. Let's do a replace since it's a "sync".
    await Lead.deleteMany({});
    const leadsWithIds = leads.map(l => {
      const { _id, ...rest } = l;
      return rest;
    });
    await Lead.insertMany(leadsWithIds);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to sync leads:", error);
    throw new Error("Failed to sync leads");
  }
}

export async function deleteLead(id: string) {
  await connectToDatabase();
  try {
    await Lead.findByIdAndDelete(id);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete lead:", error);
    throw new Error("Failed to delete lead");
  }
}
