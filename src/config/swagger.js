import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Rental Listing Platform API",
      version: "1.0.0",
      description: "API Documentation for the Rental Listing Platform project",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to files containing API documentation
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
