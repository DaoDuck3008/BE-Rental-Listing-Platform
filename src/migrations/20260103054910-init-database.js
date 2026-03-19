"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable pgcrypto extension for UUID generation
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto"'
    );

    // 1. Create roles table
    await queryInterface.createTable("roles", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 2. Create users table
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone_number: {
        type: Sequelize.STRING(11),
        allowNull: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue: "Male",
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: "Active",
      },
      provider: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: "Local",
      },
      provider_user_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_locked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 3. Create listing_types table
    await queryInterface.createTable("listing_types", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 4. Create listings table
    await queryInterface.createTable("listings", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      owner_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      listing_type_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "listing_types",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      parent_listing_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "listings",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      area: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      province_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ward_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      location: {
        type: Sequelize.GEOGRAPHY("POINT", 4326),
        allowNull: true,
      },
      bedrooms: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bathrooms: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      views: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      rules: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      utilities: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "DRAFT",
      },
      show_phone_number: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      expired_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 5. Create listing_images table
    await queryInterface.createTable("listing_images", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      listing_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "listings",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      public_id: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 6. Create amenities table
    await queryInterface.createTable("amenities", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      icon: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 7. Create listing_amenities table
    await queryInterface.createTable("listing_amenities", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      listing_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "listings",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      amenity_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "amenities",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 8. Create comments table
    await queryInterface.createTable("comments", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      listing_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "listings",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      parent_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "comments",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      like_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 9. Create comment_likes table
    await queryInterface.createTable("comment_likes", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      comment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "comments",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 10. Create chats table
    await queryInterface.createTable("chats", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      owner_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 11. Create messages table
    await queryInterface.createTable("messages", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      chat_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "chats",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      sender_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      message_type: {
        type: Sequelize.ENUM("text", "image", "file"),
        allowNull: false,
        defaultValue: "text",
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 12. Create favorites table
    await queryInterface.createTable("favorites", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      listing_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "listings",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 13. Create notifications table
    await queryInterface.createTable("notifications", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      recipient_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reference_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 14. Create audit_logs table
    await queryInterface.createTable("audit_logs", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      old_data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      new_data: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // 15. Create destinations table
    await queryInterface.createTable("destinations", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.GEOGRAPHY("POINT", 4326),
        allowNull: false,
      },
      province_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ward_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // =============== ADD INDEXES ===============

    // Users
    await queryInterface.addIndex("users", ["role_id"]);
    await queryInterface.addIndex("users", ["status"]);
    await queryInterface.addIndex("users", ["created_at"]);

    // Listings
    await queryInterface.addIndex("listings", ["owner_id"]);
    await queryInterface.addIndex("listings", ["listing_type_id"]);
    await queryInterface.addIndex("listings", ["status"]);
    await queryInterface.addIndex("listings", ["expired_at"]);
    await queryInterface.addIndex("listings", ["created_at"]);
    await queryInterface.addIndex("listings", ["price"]);
    await queryInterface.addIndex("listings", ["area"]);
    await queryInterface.addIndex("listings", ["bedrooms"]);
    await queryInterface.addIndex("listings", ["bathrooms"]);
    await queryInterface.addIndex("listings", ["latitude", "longitude"]);
    await queryInterface.addIndex("listings", ["deleted_at"]);
    await queryInterface.sequelize.query(
      "CREATE INDEX idx_listings_location ON listings USING GIST (location)"
    );

    // Listing Images
    await queryInterface.addIndex("listing_images", ["listing_id"]);
    await queryInterface.addIndex("listing_images", ["sort_order"]);

    // Listing Amenities
    await queryInterface.addIndex("listing_amenities", ["listing_id"]);
    await queryInterface.addIndex("listing_amenities", ["amenity_id"]);
    await queryInterface.addConstraint("listing_amenities", {
      fields: ["listing_id", "amenity_id"],
      type: "unique",
      name: "uq_listing_amenities",
    });

    // Comments
    await queryInterface.addIndex("comments", ["listing_id"]);
    await queryInterface.addIndex("comments", ["user_id"]);
    await queryInterface.addIndex("comments", ["parent_id"]);
    await queryInterface.addIndex("comments", ["created_at"]);

    // Comment Likes
    await queryInterface.addIndex("comment_likes", ["comment_id"]);
    await queryInterface.addIndex("comment_likes", ["user_id"]);
    await queryInterface.addConstraint("comment_likes", {
      fields: ["comment_id", "user_id"],
      type: "unique",
      name: "uq_comment_likes_user",
    });

    // Chats
    await queryInterface.addIndex("chats", ["tenant_id"]);
    await queryInterface.addIndex("chats", ["owner_id"]);
    await queryInterface.addIndex("chats", ["updated_at"]);
    await queryInterface.addConstraint("chats", {
      fields: ["tenant_id", "owner_id"],
      type: "unique",
      name: "uq_chats_participants",
    });

    // Messages
    await queryInterface.addIndex("messages", ["chat_id"]);
    await queryInterface.addIndex("messages", ["sender_id"]);
    await queryInterface.addIndex("messages", ["created_at"]);

    // Favorites
    await queryInterface.addIndex("favorites", ["user_id"]);
    await queryInterface.addIndex("favorites", ["listing_id"]);
    await queryInterface.addIndex("favorites", ["created_at"]);
    await queryInterface.addConstraint("favorites", {
      fields: ["user_id", "listing_id"],
      type: "unique",
      name: "uq_favorites",
    });

    // Notifications
    await queryInterface.addIndex("notifications", ["recipient_id"]);
    await queryInterface.addIndex("notifications", ["is_read"]);
    await queryInterface.addIndex("notifications", ["created_at"]);

    // Audit Logs
    await queryInterface.addIndex("audit_logs", ["user_id"]);
    await queryInterface.addIndex("audit_logs", ["entity_type", "entity_id"]);
    await queryInterface.addIndex("audit_logs", ["created_at"]);

    // Destinations
    await queryInterface.sequelize.query(
      "CREATE INDEX idx_destinations_location ON destinations USING GIST (location)"
    );
    await queryInterface.addIndex("destinations", ["type"]);
    await queryInterface.addIndex("destinations", ["province_code"]);
  },

  async down(queryInterface, Sequelize) {
    // Drop in reverse order
    await queryInterface.dropTable("destinations");
    await queryInterface.dropTable("audit_logs");
    await queryInterface.dropTable("notifications");
    await queryInterface.dropTable("favorites");
    await queryInterface.dropTable("messages");
    await queryInterface.dropTable("chats");
    await queryInterface.dropTable("comment_likes");
    await queryInterface.dropTable("comments");
    await queryInterface.dropTable("listing_amenities");
    await queryInterface.dropTable("amenities");
    await queryInterface.dropTable("listing_images");
    await queryInterface.dropTable("listings");
    await queryInterface.dropTable("listing_types");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("roles");

    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "pgcrypto"');
  },
};
