'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('destinations', [
      {
        id: "e03e121d-6cd1-4e60-b067-9f107cb1de8d",
        name: "ĐH Bách Khoa Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8432 21.0054)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "0037aeba-a61a-4a19-ae50-ca7e6000f9a2",
        name: "ĐH Kinh tế Quốc dân",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8438 21.0015)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "97067a3e-5471-4ecf-b6c9-1bed87322893",
        name: "ĐH Xây dựng Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8429 21.0032)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "b353a54a-ef49-46fb-b9cc-8aeadde76b4c",
        name: "ĐH Thương mại",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7766 21.0367)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "9f738bd7-2afe-4075-be01-0902fb915c40",
        name: "ĐH Quốc gia Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7846 21.037)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "bc7de9e1-da48-4fbc-a67f-b4375b398727",
        name: "ĐH Công nghiệp Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7451 21.0526)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "59922348-91a0-4c8a-bb33-dc8e3294bfe3",
        name: "ĐH FPT",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.5275 21.0135)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "2bc062bd-20c7-44fb-aeb2-269b45ee1f29",
        name: "ĐH Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8064 20.9894)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "ddf98b35-cc35-438d-a89e-1a8aab4b003a",
        name: "ĐH Ngoại thương",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8058 21.0232)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "ded5ca06-4339-4e46-b603-b2b5b8e79031",
        name: "Học viện Ngân hàng",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8076 21.0235)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "a326a252-1a6b-4977-8b2f-1219a0e87489",
        name: "Học viện Tài chính",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7761 21.0402)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "dde88225-9ab2-4fe6-8ff0-24f7e012caab",
        name: "ĐH Giao thông Vận tải",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8026 21.0282)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "8d91e89e-320d-4252-a486-9e2f39765ba3",
        name: "ĐH Mỏ - Địa chất",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7726 21.0722)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "c2128d1b-fc72-48c5-9de9-49d187389427",
        name: "ĐH Kiến trúc Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7893 20.9974)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "ab84addc-0217-4f52-aa65-d53b01714421",
        name: "ĐH Điện lực",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7721 21.072)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "1ef229ea-65f7-4099-9d78-806d56c93f11",
        name: "ĐH Sư phạm Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7762 21.0379)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "bebb2f6b-75e8-4287-abf7-b894db13b0b2",
        name: "Học viện Báo chí & Tuyên truyền",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8051 21.037)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "5b571721-a6c2-4f00-953b-f3861a1688cf",
        name: "ĐH Luật Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8003 21.023)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "a8a86dfb-fcad-4c57-8971-fbf46a35b3ba",
        name: "ĐH Thăng Long",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.796 20.9748)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "e5f483cf-94f8-4670-ac90-2ddf5bdedf02",
        name: "ĐH Công nghệ Đông Á",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7801 21.0301)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "6f592b26-e8e6-4bea-8616-755073e8a45c",
        name: "ĐH Phenikaa",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.732 20.9856)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "48fcbce4-dca9-42fc-9330-6b3e50356e97",
        name: "ĐH Đại Nam",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7876 20.9932)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "6a845f28-5a32-4b4f-af19-c2d3ae3ebf86",
        name: "ĐH Mở Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8563 21.0163)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "9dc435dc-b450-48a8-85c5-3c0cc1cf974d",
        name: "ĐH Khoa học Tự nhiên",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7849 21.0381)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "efb949b7-cb1a-45b7-bf9f-f485b543c216",
        name: "ĐH Khoa học Xã hội & Nhân văn",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7852 21.0375)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "43cf21dd-3e2d-4001-8468-2e0cdd3231cd",
        name: "Học viện Nông nghiệp Việt Nam",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.9386 21.0123)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "a295ff67-15eb-4658-8bbf-46f8867ba4bb",
        name: "ĐH Thủy lợi",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8337 21.004)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "0a27a8a9-7246-4414-9a00-2d2a7ee05e80",
        name: "ĐH Lao động - Xã hội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8054 21.0386)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "faca9350-2e39-4bfd-9e7a-021c060ffa39",
        name: "ĐH Công nghệ GTVT",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.789 21.033)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "493827fb-039f-4fb2-9a78-a3b337a8ce6f",
        name: "ĐH Nội vụ Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7785 21.0611)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "8c79fb6c-0dc1-4add-8073-bbd0e5737e57",
        name: "ĐH Văn hóa Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7976 21.0285)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "eb31933a-8ae4-409f-a0fb-c52de8c71d29",
        name: "ĐH Mỹ thuật Công nghiệp",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8251 21.012)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "6547a643-775e-4b2a-9957-9c1612edc473",
        name: "ĐH Sân khấu Điện ảnh",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.783 21.0351)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "8f2f12ba-ba29-43e8-81af-499cf6dcfd06",
        name: "ĐH Y tế Công cộng",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8345 21.0021)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "38524aa0-926d-4b3a-8576-e6bd5835d353",
        name: "ĐH Quốc tế Bắc Hà",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7802 21.0402)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "db423b05-fe05-4c0b-9f5f-aeb693852858",
        name: "ĐH Phương Đông",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8002 21.0154)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "a61367dd-f631-4ce3-8ed5-af62888e41da",
        name: "ĐH Thành Đô",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7052 21.0524)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "a71c45ac-d1bb-4556-828d-8681ebd99100",
        name: "ĐH Đông Đô",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8024 21.018)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "1a6aaf09-d372-46ba-9970-ce0c9b51cdf8",
        name: "ĐH Kinh doanh & Công nghệ",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8572 21.0122)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "f625a890-6bd6-4e1b-bbef-db38064ddf20",
        name: "Vincom Bà Triệu",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8485 21.0113)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "db143a08-6fbc-4df3-8780-0cc8185bbbd8",
        name: "Vincom Nguyễn Chí Thanh",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.809 21.0202)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "2a431534-d686-465e-907f-712bb3ff8cc3",
        name: "Vincom Trần Duy Hưng",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8015 21.0122)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "c8fbbb7b-d8ef-4cf6-8362-22ed8ef145e2",
        name: "Aeon Mall Long Biên",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.9164 21.0301)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "63d3174b-8104-44c1-8047-234c237f066c",
        name: "Aeon Mall Hà Đông",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.757 20.9672)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "16773214-7b77-49bb-b36d-26281fecace7",
        name: "Lotte Center Hà Nội",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.812 21.0337)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "4d64f960-56c4-4de8-a01e-b636a45f1ca3",
        name: "Royal City",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.815 20.9983)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "f6f566ef-82d9-497f-9402-5b0cda6a9a2e",
        name: "Times City",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.868 20.9951)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "0064e65a-f5c5-4296-b8ca-d7e03e71bee5",
        name: "Tràng Tiền Plaza",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.854 21.0245)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "628da06f-9550-40ad-b0fa-830adc26846d",
        name: "Savico Megamall",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.9113 21.036)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "9387326c-891d-4e13-9145-85d6a345f6b7",
        name: "Big C Thăng Long",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7981 21.0074)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "38cd4b89-f858-468d-ba8a-9af8df322b3b",
        name: "Big C Long Biên",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.9144 21.0431)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "d42b34f6-07ba-4def-bf75-1818e0a390c5",
        name: "Vincom Bắc Từ Liêm",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7602 21.0544)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "2fd8f9b4-54e3-4771-bceb-159716ddf809",
        name: "Vincom Phạm Ngọc Thạch",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.835 21.0076)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "f215279f-a214-4e7c-b33b-81475be61154",
        name: "Discovery Complex",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7815 21.0372)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "6e09758d-232d-4a11-ab3f-19af969a9f43",
        name: "Indochina Plaza",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7823 21.0364)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "08bbb289-fcef-4fcd-8065-6b5299455d7f",
        name: "The Garden",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7746 21.0187)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "a4b254b0-8a04-4348-a66d-6e7339affad5",
        name: "Vincom Smart City",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7484 21.0012)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "c3a37a46-ffc2-4dc8-bc04-3a92c1162956",
        name: "Mê Linh Plaza",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.74 21.1832)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "43de90e6-874d-4807-994e-79c89ae92080",
        name: "Hà Nội Center",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8463 21.0205)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "64e49c52-80c5-4d15-99fc-279a5de45ed7",
        name: "Parkson Keangnam",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7831 21.016)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "73466821-1a16-42be-bb69-b5910a6d862e",
        name: "Melinh Plaza Hà Đông",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.746 20.9741)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "7816d9a6-7663-475e-8549-20bca9f67356",
        name: "Mipec Long Biên",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.906 21.043)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "2e8a6b8e-165a-477d-aff9-4489e34be3ff",
        name: "Vincom Plaza Skylake",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7819 21.0191)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "708452c5-357d-4634-9e70-71f08d4a05f0",
        name: "BRG Mart",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.85 21.03)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "707ff815-4f96-4dcd-9033-58bb7ec67d5c",
        name: "Hapro Mart",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.86 21.025)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "79ba3818-59e0-450b-884f-c4a74691b03e",
        name: "Metro Hà Đông",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7465 20.9675)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "172201e3-28fb-4949-bcab-74de776942a9",
        name: "Chợ Đồng Xuân",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8513 21.0385)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "9e7b0380-58f2-49f8-9435-4ab526888471",
        name: "Vincom Plaza Hà Đông",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.756 20.9678)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "759f475f-af3e-4196-95b8-4ba56a5f8525",
        name: "Platinum Mall",
        type: "MALL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.842 21.015)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "8646bccc-5f30-413c-bcc8-fdc04a633bca",
        name: "Bệnh viện Bạch Mai",
        type: "HOSPITAL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8425 21.0013)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "73b18352-a099-45d4-b97b-6dfe08f2ff5d",
        name: "Bệnh viện Việt Đức",
        type: "HOSPITAL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8505 21.0275)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "166a27e9-5d65-459a-a269-2670d12de143",
        name: "Bệnh viện 108",
        type: "HOSPITAL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8615 21.0246)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "38775c41-f6c0-470c-a1f7-11ebb196d6aa",
        name: "Bệnh viện Nhi Trung Ương",
        type: "HOSPITAL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8092 21.0322)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "d344b330-58b8-4067-b3cc-a4bf98fd20ca",
        name: "Bệnh viện Thanh Nhàn",
        type: "HOSPITAL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8641 21.0131)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "590becea-089a-484e-aa46-014db58e59b5",
        name: "Bệnh viện Xanh Pôn",
        type: "HOSPITAL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8392 21.0324)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "be927f83-e0b8-49e7-88c1-57333c511ff7",
        name: "Bệnh viện E",
        type: "HOSPITAL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.785 21.0415)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "5fa5701d-8d15-4be7-ae5c-91505bb202fc",
        name: "Bệnh viện Đức Giang",
        type: "HOSPITAL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.9141 21.0423)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "301152b4-acb5-4d13-90dc-efe0c7e3d83e",
        name: "Bệnh viện Hà Đông",
        type: "HOSPITAL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7582 20.9673)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "66f2299d-708e-4c6c-83fa-ed0b7d20f08b",
        name: "Bệnh viện Đại học Y Hà Nội",
        type: "HOSPITAL",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8314 21.0045)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "f8c38a91-1f40-4c76-aec0-f0508025adbf",
        name: "Công viên Thống Nhất",
        type: "PARK",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8482 21.0142)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "9ee5fd28-2147-4d60-a8ae-0fdf6fa895d2",
        name: "Công viên Cầu Giấy",
        type: "PARK",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7817 21.0335)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "577578c6-5ed0-4c24-8240-4f5d95a4420f",
        name: "Công viên Yên Sở",
        type: "PARK",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8687 20.9701)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "3df2872f-1b77-495a-a023-2b59d507878c",
        name: "Công viên Nghĩa Đô",
        type: "PARK",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7921 21.0372)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "78d371ad-5cd9-4adb-86ee-fd487bacf3c0",
        name: "Công viên Bách Thảo",
        type: "PARK",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8372 21.0405)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "54266146-e3c0-484c-8dac-1aa31240cabb",
        name: "Công viên Hòa Bình",
        type: "PARK",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7981 21.0714)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "aaec44fe-7f83-4eff-8c56-c078a36f8fd6",
        name: "Công viên Indira Gandhi",
        type: "PARK",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8201 21.0112)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "ee2e0c7d-197a-432a-aaba-824e350400d2",
        name: "Công viên Chu Văn An",
        type: "PARK",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8302 20.9495)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "85a082bf-7a3e-4854-8aae-a1f6a9727e1e",
        name: "Công viên Linh Đàm",
        type: "PARK",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.82 20.9652)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "a5bf812c-5bcf-455e-b802-49d731d84125",
        name: "Công viên Long Biên",
        type: "PARK",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.911 21.0431)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-20T16:09:37.911Z")
      },
      {
        id: "4756fb42-747a-4faf-8957-4cc6543ed19c",
        name: "ĐH Tài Chính - Ngân Hàng Hà Nội (CS2 - Dịch Vọng Hậu)",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.78702360391617 21.03198047226112)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-21T06:49:20.429Z"),
        updated_at: new Date("2026-02-21T14:34:42.988Z")
      },
      {
        id: "2a5064d4-7565-4379-b4b5-f5b5cb546320",
        name: "ĐH Tài Chính - Ngân Hàng (CS1 - Mê Linh)",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.7572743 21.1633832)', 4326)"),
        province_code: 1,
        ward_code: 9022,
        created_at: new Date("2026-02-21T14:35:38.997Z"),
        updated_at: new Date("2026-02-21T14:35:38.997Z")
      },
      {
        id: "25deec95-2a69-4843-a7ec-629684e6c444",
        name: "ĐH Thủ Đô Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.8014939 21.036318)', 4326)"),
        province_code: 1,
        ward_code: 166,
        created_at: new Date("2026-02-21T15:37:04.673Z"),
        updated_at: new Date("2026-02-21T15:37:04.673Z")
      },
      {
        id: "c6cd33f9-cf7b-4161-8fd5-75173bdbef9a",
        name: "ĐH Y Hà Nội",
        type: "UNIVERSITY",
        location: Sequelize.literal("ST_GeomFromText('POINT (105.83074831719664 21.003216355861806)', 4326)"),
        province_code: null,
        ward_code: null,
        created_at: new Date("2026-02-20T16:09:37.911Z"),
        updated_at: new Date("2026-02-21T15:47:46.817Z")
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('destinations', null, {});
  }
};
