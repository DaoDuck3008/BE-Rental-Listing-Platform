import {
  getOverviewStats,
  getGrowthCharts,
  getListingPieChart,
  getRecentLists,
} from "../services/dashboard.service.js";

export const getOverviewStatsForAdmin = async (req, res, next) => {
  try {
    const data = await getOverviewStats();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getGrowthChartsForAdmin = async (req, res, next) => {
  try {
    const data = await getGrowthCharts();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getListingPieChartForAdmin = async (req, res, next) => {
  try {
    const data = await getListingPieChart();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentListsForAdmin = async (req, res, next) => {
  try {
    const data = await getRecentLists();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
