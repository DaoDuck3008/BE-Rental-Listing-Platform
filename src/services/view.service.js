import { getRedis } from "../config/redis.js";

export const increaseViewListingIfNeeded = async ({ listingId, viewerKey }) => {
  const viewedKey = `listing:viewed:${listingId}:${viewerKey}`;
  const viewCountKey = `listing:views:${listingId}`;

  try {
    const redis = getRedis();

    // Kiểm tra xem viewer này đã xem listing này trong 15 phút qua chưa
    const alreadyViewed = await redis.exists(viewedKey);
    if (alreadyViewed) return; // Nếu đã xem rồi thì không tăng lượt xem

    await redis.set(viewedKey, 1, "EX", 15 * 60);

    await redis.incr(viewCountKey);
  } catch (error) {
    console.error("Lỗi khi tăng lượt xem listing:", error);
  }
};
