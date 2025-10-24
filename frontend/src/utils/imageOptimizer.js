// Image optimization utility
export const getOptimizedImageUrl = (originalUrl, width = 300, quality = 80) => {
  if (!originalUrl) return '/placeholder.jpg';
  
  // If URL already includes http/https, return as is
  if (originalUrl.startsWith('http')) {
    return originalUrl;
  }
  
  // Prepend API URL for local file paths
  return `${process.env.REACT_APP_API_URL}/${originalUrl}`;
};

// Preload critical images
export const preloadImage = (src) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

// Lazy load images with intersection observer
export const createImageObserver = (callback) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
  }
  return null;
};