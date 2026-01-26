import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (file, folder, public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `${process.env.CLOUDINARY_ROOT_FOLDER_IMAGES}/${folder}`,
          resource_type: "image",
          public_id: `${public_id}`,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      )
      .end(file.buffer);
  });
};

export const destroyImage = async (folder, public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      `${process.env.CLOUDINARY_ROOT_FOLDER_IMAGES}/${folder}/${public_id}`,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
  });
};

export const destroyImages = async (folder, public_ids) => {
  if (!public_ids || public_ids.length === 0) return;

  const full_public_ids = public_ids.map(
    (id) => `${process.env.CLOUDINARY_ROOT_FOLDER_IMAGES}/${folder}/${id}`
  );

  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(full_public_ids, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

