import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Find the current winning ad (status ACTIVE)
        let ad = await prisma.ad.findFirst({
            where: { status: "ACTIVE" },
            orderBy: { scheduledFor: "desc" }
        });

        // If no active ad, pick one from PENDING (winning bid distribution logic would usually be a cron job)
        if (!ad) {
            ad = await prisma.ad.findFirst({
                where: { status: "PENDING" },
                orderBy: { winningBid: "desc" }
            });

            // If still no ad, return a default/internal ad
            if (!ad) {
                return NextResponse.json({
                    id: "internal-default",
                    title: "Join the BADS community",
                    mediaUrl: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format",
                    ctaLink: "https://warpcast.com/bads",
                    advertiserName: "BADS Team"
                });
            }
        }

        return NextResponse.json(ad);
    } catch (error) {
        console.error("Fetch ad error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
