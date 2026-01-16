import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { fid, username, displayName, pfpUrl, custodial, verifications } = await req.json();

        if (!fid) {
            return NextResponse.json({ error: "Missing fid" }, { status: 400 });
        }

        const walletAddress = verifications?.[0] || "";

        const user = await prisma.user.upsert({
            where: { fid: parseInt(fid) },
            update: {
                username,
                displayName,
                pfpUrl,
                walletAddress: walletAddress || undefined
            },
            create: {
                fid: parseInt(fid),
                username,
                displayName,
                pfpUrl,
                walletAddress: walletAddress || "",
                balance: 100 // Welcome bonus
            }
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
