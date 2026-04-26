import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_MANAGED_FOLDER = process.env.CLOUDINARY_PRODUCTS_FOLDER || "shwetafoods/products";

let isConfigured = false;

function getCloudinary() {
  if (!isConfigured) {
    cloudinary.config({
      secure: true,
    });
    isConfigured = true;
  }
  return cloudinary;
}

export function getCloudinaryManagedFolder() {
  return CLOUDINARY_MANAGED_FOLDER;
}

export async function uploadProductImageToCloudinary(params: {
  bytes: Buffer;
  slug: string;
  index: number;
}) {
  const base64Image = params.bytes.toString("base64");
  const dataUri = `data:image/jpeg;base64,${base64Image}`;

  const result = await getCloudinary().uploader.upload(dataUri, {
    folder: CLOUDINARY_MANAGED_FOLDER,
    public_id: `${params.slug}-${params.index}`,
    overwrite: true,
    resource_type: "image",
  });

  return result.secure_url;
}

export function getCloudinaryPublicIdFromUrl(imageUrl: string) {
  try {
    const parsed = new URL(imageUrl);
    if (!parsed.hostname.includes("res.cloudinary.com")) {
      return null;
    }

    const parts = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = parts.findIndex((segment) => segment === "upload");

    if (uploadIndex === -1) {
      return null;
    }

    const afterUpload = parts.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments = versionIndex >= 0 ? afterUpload.slice(versionIndex + 1) : afterUpload;

    if (publicIdSegments.length === 0) {
      return null;
    }

    const lastIndex = publicIdSegments.length - 1;
    publicIdSegments[lastIndex] = publicIdSegments[lastIndex].replace(/\.[^.]+$/, "");

    return publicIdSegments.join("/");
  } catch {
    return null;
  }
}

export async function deleteCloudinaryAssetByPublicId(publicId: string) {
  await getCloudinary().uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
}
