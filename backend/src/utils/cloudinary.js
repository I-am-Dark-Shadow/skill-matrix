import cloudinary from '../config/cloudinary.js';
import DatauriParser from 'datauri/parser.js';
import path from 'path';

const parser = new DatauriParser();

/**
 * Formats a file buffer into a Data URI string.
 * @param {object} file - The file object from Multer (req.file).
 * @returns {object} A Data URI object.
 */
const formatBufferToDataURI = (file) =>
  parser.format(path.extname(file.originalname).toString(), file.buffer);

/**
 * Uploads a file to Cloudinary.
 * @param {object} file - The file object from Multer.
 * @returns {Promise<object|null>} The Cloudinary upload result or null on failure.
 */
export const uploadOnCloudinary = async (file) => {
  if (!file) return null;

  try {
    const fileDataUri = formatBufferToDataURI(file);
    const result = await cloudinary.uploader.upload(fileDataUri.content, {
      resource_type: 'auto',
      folder: 'teamsync_projects', // Optional: A folder in Cloudinary to keep things organized
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
};

/**
 * Deletes a file from Cloudinary.
 * @param {string} public_id - The public ID of the file to delete.
 * @returns {Promise<object|null>} The Cloudinary deletion result or null on failure.
 */
export const deleteFromCloudinary = async (public_id) => {
    if (!public_id) return null;
    try {
        // We only care about deleting images for projects for now
        const result = await cloudinary.uploader.destroy(public_id, { resource_type: 'image' });
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return null;
    }
}