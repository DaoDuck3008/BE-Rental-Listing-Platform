export const buildSwaggerSpecForEnvironment = (swaggerSpec) => {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) return swaggerSpec;

  // Hide admin endpoints from public docs in production.
  const publicSpec = JSON.parse(JSON.stringify(swaggerSpec));

  if (Array.isArray(publicSpec.tags)) {
    publicSpec.tags = publicSpec.tags.filter((tag) => tag?.name !== "Admin");
  }

  if (publicSpec.paths && typeof publicSpec.paths === "object") {
    const filteredPaths = {};

    for (const [path, pathItem] of Object.entries(publicSpec.paths)) {
      const filteredPathItem = {};

      for (const [method, operation] of Object.entries(pathItem || {})) {
        const operationTags = Array.isArray(operation?.tags) ? operation.tags : [];
        const hasAdminTag = operationTags.includes("Admin");

        if (!hasAdminTag) {
          filteredPathItem[method] = operation;
        }
      }

      if (Object.keys(filteredPathItem).length > 0) {
        filteredPaths[path] = filteredPathItem;
      }
    }

    publicSpec.paths = filteredPaths;
  }

  return publicSpec;
};
