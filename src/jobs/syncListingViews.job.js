import cron from "node-cron";
import db from "../models/index.js";
import { getRedis } from "../config/redis.js";
import sequelize from "../config/database.js";

const { Listing } = db;

export const startSyncListingViewsJob = () => {
  const redis = getRedis();
  cron.schedule("*/5 * * * *", async () => {
    console.log(">>> Starting sync listing views job...");

    const keys = await redis.keys("listing:views:*");

    if (keys.length === 0) {
      console.log(">>> No listing views to sync.");
      console.log(">>> Sync listing views job completed.");
      return;
    }

    console.log(`>>> Syncing ${keys.length} listings...`);

    const t = await sequelize.transaction();
    try {
      for (const key of keys) {
        const listingId = key.split(":")[2];
        const views = parseInt(await redis.get(key)) || 0;

        if (views > 0) {
          await Listing.update(
            {
              views: sequelize.literal(`views + ${views}`),
            },
            {
              where: { id: listingId },
              transaction: t,
            }
          );
        }

        await redis.del(key);
      }

      await t.commit();
      console.log(">>> Sync listing views job completed.");
    } catch (error) {
      if (t) await t.rollback();
      console.error(">>> Error in sync listing views job:", error);
    }
  });
};
