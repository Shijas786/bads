import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { fid, amount, adTitle, mediaUrl, ctaLink } = await req.json();

        if (!fid || !amount || !adTitle) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Check if user has enough balance (if Phase 2, this would be on-chain)
        const user = await prisma.user.findUnique({ where: { fid: parseInt(fid) } });
        if (!user || user.balance < amount) {
            return NextResponse.json({ error: "Insufficient $BADS balance" }, { status: 400 });
        }

        // 2. Create Ad and Bid
        const result = await prisma.$transaction(async (tx) => {
            // Deduct balance
            await tx.user.update({
                where: { fid: parseInt(fid) },
                data: { balance: { decrement: amount } }
            });

            // Create Ad
            const ad = await tx.ad.create({
                data: {
                    advertiserFid: parseInt(fid),
                    title: adTitle,
                    mediaUrl: mediaUrl || "",
                    ctaLink: ctaLink || "",
                    status: "PENDING"
                }
            });

            // Create Bid
            const bid = await tx.bid.create({
                data: {
                    adId: ad.id,
                    advertiserFid: parseInt(fid),
                    amount: amount
                }
            });

            return { ad, bid };
        });

        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error("Bid error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
