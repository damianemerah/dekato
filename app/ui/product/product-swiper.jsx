import Image from "next/image";
import { memo } from "react";

const ProductSwiper = memo(function ProductSwiper({
  product,
  activeIndex,
  setActiveIndex,
  handleMouseMove,
  handleImageClick,
  isZoomed,
  zoomPosition,
}) {
  return (
    <>
      {/* Dots navigation for small to medium screens */}
      {product?.image && product.image.length > 1 && (
        <div className="absolute left-0 right-0 top-4 z-10 hidden justify-center gap-2 sm:flex md:hidden">
          {product.image.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === activeIndex ? "w-4 bg-primary" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail navigation for medium screens and up */}
      {product?.image && product.image.length > 1 && (
        <div className="absolute left-8 top-8 z-10 hidden flex-col gap-2 md:flex">
          {product.image.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-16 shadow-shadowSm transition-all ${
                index === activeIndex ? "border-2 border-primary" : ""
              }`}
            >
              <Image
                className="block h-full w-full object-cover"
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image swiper */}
      <div className="relative h-full w-full overflow-hidden">
        {/* Mobile slider */}
        <div
          className="flex h-full sm:hidden"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: "transform 300ms ease-in-out",
          }}
        >
          {product?.image &&
            product.image.map((image, index) => (
              <div key={index} className="h-full min-w-full shrink-0">
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    className="block h-full w-full object-cover"
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    quality={100}
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Desktop view */}
        <div className="hidden h-full w-full sm:block">
          {product?.image &&
            product.image.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
                  index === activeIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  className="relative h-full w-full overflow-hidden"
                  onMouseMove={handleMouseMove}
                  onClick={handleImageClick}
                  style={{
                    cursor: `url("data:image/svg+xml,${encodeURIComponent(
                      isZoomed
                        ? '<svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="1.8rem" viewBox="0 0 15 15"><path fill="none" stroke="white" d="M4 7.5h7m-3.5 7a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z"/></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="1.8rem" viewBox="0 0 15 15"><path fill="none" stroke="white" d="M7.5 4v7M4 7.5h7m-3.5 7a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z"/></svg>',
                    )}") 24 24, auto`,
                  }}
                >
                  <Image
                    className="block h-full w-full object-cover transition-transform duration-200 ease-out"
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="50vw"
                    quality={100}
                    style={{
                      transformOrigin: `${zoomPosition.x * 100}% ${
                        zoomPosition.y * 100
                      }%`,
                      transform: `scale(${isZoomed ? 2 : 1})`,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
});

export default ProductSwiper;
