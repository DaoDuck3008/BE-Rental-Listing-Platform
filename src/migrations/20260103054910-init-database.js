// migrations/XXXXXX-create-initial-tables.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable pgcrypto extension for UUID generation
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto"'
    );

    // Create roles table
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
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // Create users table
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "role_id",
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
      passwordHash: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: "password_hash",
      },
      phone_number: {
        type: Sequelize.STRING(11),
        allowNull: false,
        field: "phone_number",
      },
      full_name: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: "full_name",
      },
      gender: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      avatar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
        defaultValue: Sequelize.NOW,
      },
      provider: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      provider_user_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: "provider_user_id",
      },
    });

    // Create listing_types table
    await queryInterface.createTable("listing_types", {
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
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // Create listings table
    await queryInterface.createTable("listings", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "owner_id",
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      listingTypeId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: "listing_type_id",
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
        type: Sequelize.TEXT,
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
      latitude: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DOUBLE,
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
      expiredAt: {
        type: Sequelize.DATE,
        field: "expired_at",
        allowNull: true,
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        field: "deleted_at",
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // Create listing_images table
    await queryInterface.createTable("listing_images", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      listingId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "listing_id",
        references: {
          model: "listings",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      imageUrl: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: "image_url",
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        field: "sort_order",
      },
      public_id: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: "public_id",
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // Create amenities table
    await queryInterface.createTable("amenities", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      icon: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // Create listing_amenities table
    await queryInterface.createTable("listing_amenities", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      listingId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "listing_id",
        references: {
          model: "listings",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      amenitiesId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "amenity_id",
        references: {
          model: "amenities",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // Create comments table
    await queryInterface.createTable("comments", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      listingId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "listing_id",
        references: {
          model: "listings",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      parentId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: "parent_id",
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
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: Sequelize.DATE,
        field: "deleted_at",
        allowNull: true,
      },
    });

    // Create comment_likes table
    await queryInterface.createTable("comment_likes", {
      id: {
        type: Sequelize.UUID,
        autoIncrement: true,
        primaryKey: true,
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

    // Unique constraint for comment_id + user_id to prevent duplicate likes
    await queryInterface.addConstraint("comment_likes", {
      fields: ["comment_id", "user_id"],
      type: "unique",
      name: "uq_comment_likes_user",
    });

    // Create chats table
    await queryInterface.createTable("chats", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      listingId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "listing_id",
        references: {
          model: "listings",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      tenantId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: "tenant_id",
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: "owner_id",
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // Create messages table
    await queryInterface.createTable("messages", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      chatId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "chat_id",
        references: {
          model: "chats",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      senderId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: "sender_id",
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      messageType: {
        type: Sequelize.STRING(20),
        defaultValue: "text",
        field: "message_type",
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // Create favorites table
    await queryInterface.createTable("favorites", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      listingId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "listing_id",
        references: {
          model: "listings",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // Create notifications table
    await queryInterface.createTable("notifications", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "user_id",
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
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: "is_read",
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // Create audit_logs table
    await queryInterface.createTable("audit_logs", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: "user_id",
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
      entityType: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: "entity_type",
      },
      entityId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: "entity_id",
      },
      oldValue: {
        type: Sequelize.JSONB,
        allowNull: true,
        field: "old_value",
      },
      newValue: {
        type: Sequelize.JSONB,
        allowNull: true,
        field: "new_value",
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // Create event_logs table
    await queryInterface.createTable("event_logs", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      eventType: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "event_type",
      },
      entityType: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: "entity_type",
      },
      entityId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: "entity_id",
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
      },
    });

    // =============== ADD INDEXES ===============

    // Users table indexes
    await queryInterface.addIndex("users", ["role_id"]);
    await queryInterface.addIndex("users", ["status"]);
    await queryInterface.addIndex("users", ["created_at"]);

    // Listings table indexes
    await queryInterface.addIndex("listings", ["owner_id"]);
    await queryInterface.addIndex("listings", ["listing_type_id"]);
    await queryInterface.addIndex("listings", ["status"]);
    await queryInterface.addIndex("listings", ["expired_at"]);
    await queryInterface.addIndex("listings", ["created_at"]);
    await queryInterface.addIndex("listings", ["price"]);
    await queryInterface.addIndex("listings", ["area"]);
    await queryInterface.addIndex("listings", ["bedroom"]);
    await queryInterface.addIndex("listings", ["bathroom"]);
    await queryInterface.addIndex("listings", ["latitude", "longitude"]);
    await queryInterface.addIndex("listings", ["deleted_at"]);

    // Listing images indexes
    await queryInterface.addIndex("listing_images", ["listing_id"]);
    await queryInterface.addIndex("listing_images", ["sort_order"]);

    // Listing amenities indexes
    await queryInterface.addIndex("listing_amenities", ["listing_id"]);
    await queryInterface.addIndex("listing_amenities", ["amenity_id"]);
    // Unique constraint for listing_id + amenity_id
    await queryInterface.addConstraint("listing_amenities", {
      fields: ["listing_id", "amenity_id"],
      type: "unique",
      name: "uq_listing_amenities",
    });

    // Comments indexes
    await queryInterface.addIndex("comments", ["listing_id"]);
    await queryInterface.addIndex("comments", ["user_id"]);
    await queryInterface.addIndex("comments", ["parent_id"]);
    await queryInterface.addIndex("comments", ["created_at"]);

    // Comment likes indexes
    await queryInterface.addIndex("comment_likes", ["comment_id"]);
    await queryInterface.addIndex("comment_likes", ["user_id"]);

    // Chats indexes
    await queryInterface.addIndex("chats", ["listing_id"]);
    await queryInterface.addIndex("chats", ["tenant_id"]);
    await queryInterface.addIndex("chats", ["owner_id"]);
    await queryInterface.addIndex("chats", ["updated_at"]);

    // Messages indexes
    await queryInterface.addIndex("messages", ["chat_id"]);
    await queryInterface.addIndex("messages", ["sender_id"]);
    await queryInterface.addIndex("messages", ["created_at"]);

    // Favorites indexes
    await queryInterface.addIndex("favorites", ["user_id"]);
    await queryInterface.addIndex("favorites", ["listing_id"]);
    await queryInterface.addIndex("favorites", ["created_at"]);
    // Unique constraint for user_id + listing_id
    await queryInterface.addConstraint("favorites", {
      fields: ["user_id", "listing_id"],
      type: "unique",
      name: "uq_favorites",
    });

    // Notifications indexes
    await queryInterface.addIndex("notifications", ["user_id"]);
    await queryInterface.addIndex("notifications", ["is_read"]);
    await queryInterface.addIndex("notifications", ["created_at"]);

    // Audit logs indexes
    await queryInterface.addIndex("audit_logs", ["user_id"]);
    await queryInterface.addIndex("audit_logs", ["entity_type", "entity_id"]);
    await queryInterface.addIndex("audit_logs", ["created_at"]);

    // Event logs indexes
    await queryInterface.addIndex("event_logs", ["user_id"]);
    await queryInterface.addIndex("event_logs", ["event_type"]);
    await queryInterface.addIndex("event_logs", ["entity_type", "entity_id"]);
    await queryInterface.addIndex("event_logs", ["created_at"]);
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order to avoid foreign key constraints
    const tables = [
      "event_logs",
      "audit_logs",
      "notifications",
      "favorites",
      "messages",
      "chats",
      "comments",
      "comment_likes",
      "listing_amenities",
      "amenities",
      "listing_images",
      "listings",
      "listing_types",
      "users",
      "roles",
    ];

    for (const table of tables) {
      await queryInterface.dropTable(table);
    }

    // Disable pgcrypto extension
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "pgcrypto"');
  },
};
