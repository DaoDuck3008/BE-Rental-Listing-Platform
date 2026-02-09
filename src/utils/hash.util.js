import crypto from "crypto";

export const hashIP = (rawIP) => {
  return crypto.createHash("md5").update(rawIP).digest("hex");
};
