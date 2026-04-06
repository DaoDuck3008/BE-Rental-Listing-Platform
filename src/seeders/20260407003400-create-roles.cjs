'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        id: "2b242502-3298-4652-b748-30dff683bf01",
        code: "USER",
        name: "Người dùng",
        created_at: new Date("2026-04-05T17:39:07.740Z"),
        updated_at: new Date("2026-04-05T17:39:07.740Z")
      },
      {
        id: "3304e751-22c3-4b81-83e7-8910bc0d0024",
        code: "LANDLORD",
        name: "Chủ cho thuê",
        created_at: new Date("2026-04-05T16:20:41.384Z"),
        updated_at: new Date("2026-04-05T16:20:41.384Z")
      },
      {
        id: "0029848d-5398-4e3b-9f6c-6fc796cd2c35",
        code: "ADMIN",
        name: "Quản trị viên",
        created_at: new Date("2026-04-05T17:39:20.602Z"),
        updated_at: new Date("2026-04-05T17:39:20.602Z")
      },
      {
        id: "e495dcd5-c17b-4ed9-b8be-1597f3fc8341",
        code: "TENANT",
        name: "Người đi thuê",
        created_at: new Date("2026-04-06T08:46:12.349Z"),
        updated_at: new Date("2026-04-06T08:46:12.349Z")
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
