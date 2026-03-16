import db from "../models/index.js";
import { Op } from "sequelize";
import moment from "moment";
import { getAllModatedListingsService } from "./listing.service.js";

const { User, Listing, ListingType } = db;

export const getOverviewStats = async () => {
  const totalUsers = await User.count();
  const totalPosts = await Listing.count();
  const pendingPosts = await Listing.count({
    where: { status: "PENDING" },
  });
  const reportedPosts = 0;

  const lastMonthStart = moment().subtract(1, "months").startOf("month").toDate();
  const lastMonthEnd = moment().subtract(1, "months").endOf("month").toDate();
  const thisMonthStart = moment().startOf("month").toDate();

  const usersThisMonth = await User.count({
    where: { createdAt: { [Op.gte]: thisMonthStart } },
  });
  const usersLastMonth = await User.count({
    where: { createdAt: { [Op.between]: [lastMonthStart, lastMonthEnd] } },
  });
  const userGrowthPercent = usersLastMonth === 0 ? 100 : Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100);

  const postsThisMonth = await Listing.count({
    where: { createdAt: { [Op.gte]: thisMonthStart } },
  });
  const postsLastMonth = await Listing.count({
    where: { createdAt: { [Op.between]: [lastMonthStart, lastMonthEnd] } },
  });
  const postGrowthPercent = postsLastMonth === 0 ? 100 : Math.round(((postsThisMonth - postsLastMonth) / postsLastMonth) * 100);

  return {
    totalUsers,
    totalPosts,
    pendingPosts,
    reportedPosts,
    userGrowthPercent,
    postGrowthPercent,
  };
};

export const getGrowthCharts = async () => {
  const thirtyDaysAgo = moment().subtract(29, "days").startOf("day");

  const postGrowthRaw = await Listing.findAll({
    attributes: [
      [db.sequelize.fn("DATE", db.sequelize.col("created_at")), "date"],
      [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
    ],
    where: { createdAt: { [Op.gte]: thirtyDaysAgo.toDate() } },
    group: [db.sequelize.fn("DATE", db.sequelize.col("created_at"))],
    raw: true,
  });

  const userGrowthRaw = await User.findAll({
    attributes: [
      [db.sequelize.fn("DATE", db.sequelize.col("created_at")), "date"],
      [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
    ],
    where: { createdAt: { [Op.gte]: thirtyDaysAgo.toDate() } },
    group: [db.sequelize.fn("DATE", db.sequelize.col("created_at"))],
    raw: true,
  });

  const postGrowth = [];
  const userGrowth = [];

  for (let i = 29; i >= 0; i--) {
    const targetDate = moment().subtract(i, "days");
    const formattedDate = targetDate.format("DD/MM");
    const compareString = targetDate.format("YYYY-MM-DD");

    const pRecord = postGrowthRaw.find((r) => moment(r.date).format("YYYY-MM-DD") === compareString);
    const uRecord = userGrowthRaw.find((r) => moment(r.date).format("YYYY-MM-DD") === compareString);

    postGrowth.push({ name: formattedDate, count: pRecord ? Number(pRecord.count) : 0 });
    userGrowth.push({ name: formattedDate, count: uRecord ? Number(uRecord.count) : 0 });
  }

  return { postGrowth, userGrowth };
};

export const getListingPieChart = async () => {
  const listingsByTypeRaw = await Listing.findAll({
    attributes: [
      "listing_type_id",
      [db.sequelize.fn("COUNT", db.sequelize.col("Listing.id")), "count"],
    ],
    include: [{ model: ListingType, as: "listing_type", attributes: ["name"] }],
    group: ["listing_type_id", "listing_type.id"],
    raw: true,
    nest: true,
  });

  return listingsByTypeRaw.map((item) => ({
    name: item.listing_type?.name || "Khác",
    value: Number(item.count),
  }));
};

export const getRecentLists = async () => {
  const pendingResult = await getAllModatedListingsService(1, 5);
  const pendingListings = pendingResult.data;

  const recentPosts = await Listing.findAll({
    where: {
      status: { [Op.notIn]: ["DRAFT", "DELETED", "EDIT_DRAFT"] },
    },
    order: [["createdAt", "DESC"]],
    limit: 5,
    include: [{ model: db.ListingImage, as: "images", attributes: ["image_url"] }],
  });

  return { pendingListings, recentPosts };
};
