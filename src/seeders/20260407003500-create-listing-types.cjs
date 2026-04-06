'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('listing_types', [
      {
        id : "5dc97639-02a1-4c92-9dfc-7e9e70067fbb",
        code : "ROOM",
        name : "Phòng trọ",
        description : "Phòng cho thuê riêng lẻ, thường có diện tích nhỏ, phù hợp sinh viên hoặc người đi làm.",
        created_at : new Date("2026-01-22T04:20:47.633Z"),
        updated_at : new Date("2026-01-22T04:20:47.633Z")
      },
      {
        id : "833adfd0-9a60-4249-9f4b-28b99de802e9",
        code : "STUDIO",
        name : "Căn hộ studio",
        description : "Căn hộ khép kín gồm phòng ngủ, bếp và nhà vệ sinh trong cùng một không gian.",
        created_at : new Date("2026-01-22T04:20:47.633Z"),
        updated_at : new Date("2026-01-22T04:20:47.633Z")
      },
      {
        id : "cee04b26-aa85-4053-aab9-1a512c2026a2",
        code : "MINI_APARTMENT",
        name : "Chung cư mini",
        description : "Căn hộ nhỏ trong tòa nhà mini, có lối đi riêng và tiện ích cơ bản.",
        created_at : new Date("2026-01-22T04:20:47.633Z"),
        updated_at : new Date("2026-01-22T04:20:47.633Z")
      },
      {
        id : "fddd3b7b-6d5d-4972-9c99-933a787bd0a4",
        code : "APARTMENT",
        name : "Căn hộ",
        description : "Căn hộ trong khu chung cư, đầy đủ tiện nghi, phù hợp hộ gia đình hoặc người đi làm.",
        created_at : new Date("2026-01-22T04:20:47.633Z"),
        updated_at : new Date("2026-01-22T04:20:47.633Z")
      },
      {
        id : "84c381d4-41ca-4907-9d24-55543c8614bd",
        code : "SHARED_ROOM",
        name : "Phòng ở ghép",
        description : "Phòng cho nhiều người thuê chung nhằm tiết kiệm chi phí.",
        created_at : new Date("2026-01-22T04:20:47.633Z"),
        updated_at : new Date("2026-01-22T04:20:47.633Z")
      },
      {
        id : "7b2b5694-6412-4097-ac8e-e33b3f97f2ef",
        code : "HOUSE",
        name : "Nhà nguyên căn",
        description : "Nhà cho thuê toàn bộ, phù hợp gia đình hoặc nhóm người thuê dài hạn.",
        created_at : new Date("2026-01-22T04:20:47.633Z"),
        updated_at : new Date("2026-01-22T04:20:47.633Z")
      },
      {
        id : "3f5ddfd8-5b0f-4eb0-935e-aa38b13a66bf",
        code : "DORMITORY",
        name : "Ký túc xá",
        description : "Chỗ ở tập thể dành cho sinh viên hoặc người lao động, chi phí thấp.",
        created_at : new Date("2026-01-22T04:20:47.633Z"),
        updated_at : new Date("2026-01-22T04:20:47.633Z")
      },
      {
        id : "48c44680-a20a-4378-b67c-16a2d2fb5a90",
        code : "SHARED_APARTMENT",
        name : "Căn hộ chung chủ",
        description : "",
        created_at : new Date("2026-03-13T16:59:50.613Z"),
        updated_at : new Date("2026-03-13T16:59:50.613Z")
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('listing_types', null, {});
  }
};
