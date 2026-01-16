import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "");

export async function POST(req: Request) {
    try {
        const { fid, adId, referredBy } = await req.json();

        if (!fid || !adId) {
            return NextResponse.json({ error: "Missing fid or adId" }, { status: 400 });
        }

        // 1. Check cooldown in Redis (24h cooldown per FID)
        const cooldownKey = `watch_cooldown:${fid}`;
        const onCooldown = await redis.get(cooldownKey);
        if (onCooldown) {
            return NextResponse.json({ error: "One ad watch per 24 hours allowed" }, { status: 429 });
        }

        // 2. Check if already watched today in DB (extra safety)
        const existingWatch = await prisma.watchHistory.findFirst({
            where: {
                fid: parseInt(fid),
                adId: adId,
                timestamp: {
                    gt: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }
        });

        if (existingWatch) {
            return NextResponse.json({ error: "Already watched this ad" }, { status: 400 });
        }

        // 3. Record watch and award $BADS
        // 3. Record watch and award $BADS
        const rewardAmount = 50;
        const referralBonus = 10;

        const operations = [
            prisma.watchHistory.create({
                data: {
                    fid: parseInt(fid),
                    adId: adId,
                    rewardAmount: rewardAmount
                }
            }),
            prisma.user.update({
                where: { fid: parseInt(fid) },
                data: { balance: { increment: rewardAmount } }
            })
        ];

        if (referredBy && referredBy !== fid) {
            operations.push(
                prisma.user.update({
                    where: { fid: parseInt(referredBy) },
                    data: { balance: { increment: referralBonus } }
                })
            );
            operations.push(
                prisma.referralReward.create({
                    data: {
                        referrerFid: parseInt(referredBy),
                        refereeFid: parseInt(fid),
                        adId: adId,
                        amount: referralBonus
                    }
                }) as any
            );
        }

        await prisma.$transaction(operations);

        // 4. Set cooldown in Redis
        await redis.set(cooldownKey, "1", "EX", 24 * 60 * 60);

        return NextResponse.json({ success: true, reward: rewardAmount });
    } catch (error) {
        console.error("Watch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
