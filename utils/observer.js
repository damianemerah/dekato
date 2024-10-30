// utils/observer.js
export const observeElement = (
  element,
  callback,
  options = { threshold: 0.1 },
) => {
  if (!element) return; // Guard clause in case element is not available

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(); // Trigger the lazy loading callback
          observer.unobserve(entry.target); // Stop observing once the element is visible
        }
      });
    },
    options, // Customize the threshold, root, etc., if needed
  );

  observer.observe(element); // Start observing the element
};
