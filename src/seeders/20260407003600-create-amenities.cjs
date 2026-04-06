'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const fixedDate = new Date("2026-04-06T12:00:00.000Z");
    
    return queryInterface.bulkInsert('amenities', [
      {
        id : "74b126f2-3b7d-4c33-91cb-d377b743f797",
        name : "Wifi",
        icon : "Wifi",
        created_at : new Date("2026-01-19T16:08:17.072Z"),
        updated_at : new Date("2026-01-19T16:08:17.072Z")
      },
      {
        id : "b6bd53cd-fe43-4253-b3ad-0401b3e7b133",
        name : "Máy lạnh",
        icon : "Snowflake",
        created_at : new Date("2026-01-19T16:08:17.072Z"),
        updated_at : new Date("2026-01-19T16:08:17.072Z")
      },
      {
        id : "28383a88-ebfb-4973-a849-a130658092fa",
        name : "Chỗ để xe",
        icon : "ParkingSquare",
        created_at : new Date("2026-01-19T16:08:17.072Z"),
        updated_at : new Date("2026-01-19T16:08:17.072Z")
      },
      {
        id : "f0f25795-a0c2-45d2-ab36-188295becff1",
        name : "Nhà vệ sinh riêng",
        icon : "Bath",
        created_at : new Date("2026-01-19T16:08:17.072Z"),
        updated_at : new Date("2026-01-19T16:08:17.072Z")
      },
      {
        id : "83e6a97c-d4de-4817-936d-4eaff2ff5381",
        name : "Bếp",
        icon : "UtensilsCrossed",
        created_at : new Date("2026-01-19T16:08:17.072Z"),
        updated_at : new Date("2026-01-19T16:08:17.072Z")
      },
      {
        id : "99e90d60-6764-48e3-beff-1342a57ca355",
        name : "Tủ lạnh",
        icon : "Refrigerator",
        created_at : new Date("2026-01-19T16:08:17.072Z"),
        updated_at : new Date("2026-01-19T16:08:17.072Z")
      },
      {
        id : "fae94038-77cb-49ea-845f-b93bdc9fdecb",
        name : "Máy giặt",
        icon : "WashingMachine",
        created_at : new Date("2026-01-19T16:08:17.072Z"),
        updated_at : new Date("2026-01-19T16:08:17.072Z")
      },
      {
        id : "b7ef52c7-2380-44cb-a429-f4bf28c92ea2",
        name : "Camera an ninh",
        icon : "Cctv",
        created_at : new Date("2026-01-19T16:08:17.072Z"),
        updated_at : new Date("2026-01-19T16:08:17.072Z")
      },
      {
        id : "db2cf875-0f73-41f0-acda-9a9b6f3647d9",
        name : "Ban công",
        icon : "DoorOpen",
        created_at : new Date("2026-01-19T16:08:17.072Z"),
        updated_at : new Date("2026-01-19T16:08:17.072Z")
      },
      {
        id : "62b52c52-7e15-4bc1-882b-ea9a9043c664",
        name : "Thang máy",
        icon : "ArrowUpDown",
        created_at : new Date("2026-01-19T16:08:17.072Z"),
        updated_at : new Date("2026-01-19T16:08:17.072Z")
      },
      /* --- Custom Generates: 13 New Amenities --- */
      {
        id : "d71720d4-1a2f-4889-8d7b-bc4a0e911270",
        name : "Giường ngủ",
        icon : "Bed",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "8ef8ecbc-3eb3-4bed-bcb0-18e388ffc735",
        name : "Tủ quần áo",
        icon : "Shirt",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "3c8d9e60-4c3e-4d43-98fa-d6c1f9fdc758",
        name : "Bình nóng lạnh",
        icon : "Droplet",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "a21b3f71-2ed9-49ff-820d-7dbfc9fbfdf1",
        name : "Tivi",
        icon : "Tv",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "5f91e92d-ecc4-4b52-acc9-cd8b024443af",
        name : "Bảo vệ 24/7",
        icon : "ShieldCheck",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "1852c42d-fceb-47e5-bab4-62da8dcf4db9",
        name : "Khóa vân tay",
        icon : "Fingerprint",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "bb0b05b3-3a81-420a-b30f-b054238c6412",
        name : "Lò vi sóng",
        icon : "Microwave",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "7de41e6c-7f55-4ceb-aa64-9a3d4f0d367c",
        name : "Nuôi thú cưng",
        icon : "Dog",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "00b3fde6-6afc-4c4f-9e58-6923cfcd1a47",
        name : "Giờ giấc tự do",
        icon : "Clock",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "3d9fbbfa-ef67-4e92-ace7-2ea2c99f187a",
        name : "Chỗ phơi đồ",
        icon : "Shirt",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "a8b2dfa6-f7aa-4fbd-8207-628d3e911a7a",
        name : "Internet cáp quang",
        icon : "Globe",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "92fd8c8e-5bca-4e50-9fbb-fa8db8b3b3a6",
        name : "Máy sấy quần áo",
        icon : "Wind",
        created_at : fixedDate,
        updated_at : fixedDate
      },
      {
        id : "12afc8f8-b391-4bc5-a189-e7bbfad372e1",
        name : "Sofa",
        icon : "Armchair",
        created_at : fixedDate,
        updated_at : fixedDate
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('amenities', null, {});
  }
};
