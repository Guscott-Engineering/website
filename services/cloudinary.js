const CLOUD_NAME = 'YOUR_CLOUDINARY_CLOUD_NAME';

export const fetchFolderImages = async (tagName) => {
  try {
    // Fetches a JSON list of all images with the specified tag
    const response = await fetch(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tagName}.json`
    );
    const data = await response.json();
    
    // Map response into formatted image URLs
    return data.resources.map((item) => ({
      id: item.public_id,
      url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/${item.public_id}.${item.format}`
    }));
  } catch (error) {
    console.error(`Error fetching photos for tag ${tagName}:`, error);
    return [];
  }
};
