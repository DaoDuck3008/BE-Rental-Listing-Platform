"use strict";
const crypto = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const defaultDate = new Date();

    // 1. Bảo đảm có quyền 'LANDLORD'
    let [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE code = 'LANDLORD' LIMIT 1;`
    );
    let roleId;
    if (roles.length > 0) {
      roleId = roles[0].id;
    } else {
      roleId = crypto.randomUUID();
      await queryInterface.bulkInsert("roles", [
        {
          id: roleId,
          code: "LANDLORD",
          name: "Landlord",
          created_at: defaultDate,
          updated_at: defaultDate,
        },
      ]);
    }

    // 2. Bảo đảm có tài khoản User (Chủ nhà)
    let [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'seeder.host@example.com' LIMIT 1;`
    );
    let ownerId;
    if (users.length > 0) {
      ownerId = users[0].id;
    } else {
      ownerId = crypto.randomUUID();
      await queryInterface.bulkInsert("users", [
        {
          id: ownerId,
          role_id: roleId,
          email: "seeder.host@example.com",
          full_name: "Demo Host (Seeder)",
          password_hash: "seed_no_password_needed",
          is_locked: false,
          is_email_verified: true,
          created_at: defaultDate,
          updated_at: defaultDate,
        },
      ]);
    }

    // 3. Bảo đảm có Loại hình (Listing Type)
    let [types] = await queryInterface.sequelize.query(
      `SELECT id FROM listing_types LIMIT 1;`
    );
    let listingTypeId;
    if (types.length > 0) {
      listingTypeId = types[0].id;
    } else {
      listingTypeId = crypto.randomUUID();
      await queryInterface.bulkInsert("listing_types", [
        {
          id: listingTypeId,
          name: "Apartment",
          description: "Căn hộ hiện đại",
          created_at: defaultDate,
          updated_at: defaultDate,
        },
      ]);
    }

    // 4. Khởi tạo mảng dữ liệu
    const listings = [];
    const images = [];

    // Các ảnh phòng đẹp lấy từ Unsplash (Có giới hạn Quality & Resize nhanh)
    const unsplashImages = [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200", // Phòng khách đẹp
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200", // Phòng ngủ sang trọng
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200", // Phòng tắm kính hiện đại
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200", // Bếp cực rộng
      "https://images.unsplash.com/photo-1502672260266-1c1e5250f225?q=80&w=1200", // Nội thất concept
    ];

    // Mảng toạ độ tập trung tại TP. Hồ Chí Minh
    const hcmLocations = [
      { lat: 10.7769, lng: 106.7009, addr: "Đường Đồng Khởi, Quận 1, TP. HCM" },
      { lat: 10.795, lng: 106.7218, addr: "Vinhomes Central Park, Bình Thạnh, TP.HCM" },
      { lat: 10.8043, lng: 106.738, addr: "Đường Xuân Thuỷ, Thảo Điền, Quận 2, TP.HCM" },
      { lat: 10.761, lng: 106.698, addr: "Bến Vân Đồn, Quận 4, TP. HCM" },
      { lat: 10.73, lng: 106.72, addr: "Nguyễn Văn Linh, Quận 7, TP. HCM" },
    ];

    const listingTitles = [
      "Siêu Căn hộ Dịch Vụ trung tâm Quận 1",
      "Studio ánh sáng ngập tràn view Landmark 81",
      "Penthouse Tân Cổ Điển siêu sang tại Thảo Điền",
      "Căn hộ 2 Phòng Ngủ cao cấp view sông Quận 4",
      "Villa yên tĩnh nội thất cực chill Quận 7",
    ];

    // Bắt đầu tạo dữ liệu 5 bài đăng & 15 Ảnh
    for (let i = 0; i < 5; i++) {
        const listingId = crypto.randomUUID();
        const loc = hcmLocations[i];

        // Tạo Listing
        listings.push({
            id: listingId,
            owner_id: ownerId,
            listing_type_id: listingTypeId,
            title: listingTitles[i],
            description: "Dữ liệu được Seed hoàn toàn tự động bằng công cụ Sequelize Seeder. Căn hộ này có view 360 độ ngắm toàn thành phố, nội thất sử dụng gỗ Óc Chó nhập khẩu, thiết bị điện thông minh smarthome. Hình ảnh được render real-time từ Unsplash.",
            price: 5000000 + (Math.random() * 15000000), // Random 5tr - 20tr
            area: 40 + (Math.random() * 80), // Random 40m - 120m
            address: loc.addr,
            province_code: 79, // Mã của TP.HCM
            ward_code: null,
            longitude: loc.lng,
            latitude: loc.lat,
            // Sử dụng PostGIS literal để an toàn tuyệt đối khi bulkInsert
            location: Sequelize.literal(`ST_SetSRID(ST_MakePoint(${loc.lng}, ${loc.lat}), 4326)`),
            bedrooms: Math.floor(Math.random() * 3) + 1,
            bathrooms: Math.floor(Math.random() * 2) + 1,
            views: Math.floor(Math.random() * 1000), // Traffic giả lập
            capacity: Math.floor(Math.random() * 4) + 2,
            rules: JSON.stringify(["Không mang thú cưng", "Giữ yên tĩnh sau 22:00"]),
            utilities: JSON.stringify(["Wifi miễn phí", "Bể bơi vô cực", "Phòng Gym"]),
            status: "PUBLISHED",
            show_phone_number: true,
            published_at: defaultDate,
            created_at: defaultDate,
            updated_at: defaultDate,
        });

        // Mỗi bài có 3 ảnh
        images.push({
            id: crypto.randomUUID(),
            listing_id: listingId,
            image_url: unsplashImages[0], // Ảnh PK
            sort_order: 1,
            public_id: `unsplash-demo-1-${i}`,
            created_at: defaultDate,
        });
        images.push({
            id: crypto.randomUUID(),
            listing_id: listingId,
            image_url: i % 2 === 0 ? unsplashImages[1] : unsplashImages[3], // Layout ngẫu nhiên
            sort_order: 2,
            public_id: `unsplash-demo-2-${i}`,
            created_at: defaultDate,
        });
        images.push({
            id: crypto.randomUUID(),
            listing_id: listingId,
            image_url: unsplashImages[2], // Ảnh PN
            sort_order: 3,
            public_id: `unsplash-demo-3-${i}`,
            created_at: defaultDate,
        });
    }

    // Execute Bulk Insert
    await queryInterface.bulkInsert("listings", listings);
    await queryInterface.bulkInsert("listing_images", images);
  },

  down: async (queryInterface, Sequelize) => {
    // Để an toàn khi Undo, chúng ta có thể xóa dựa trên Email người dũng đã tạo
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'seeder.host@example.com';`
    );
    if (users.length > 0) {
      const demoOwnerId = users[0].id;
      // Việc xóa Listing sẽ tự động CASCADE sang Xoá Images dựa trên Schema setup
      await queryInterface.bulkDelete("listings", { owner_id: demoOwnerId }, {});
    }
  },
};
