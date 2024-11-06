// src/utils/imageUtils.js
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    
    // If the image path is a full URL, return it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Otherwise, append the API base URL
    return `${import.meta.env.VITE_API_BASE_URL_IMG}${imagePath}`;
  };