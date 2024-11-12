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
      {product?.image && product.image.length > 1 && (
        <div className="absolute left-8 top-8 z-10 flex flex-col gap-2 md:mb-0">
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative h-full w-full">
        {product?.image &&
          product.image.map((image, index) => (
            <div
              key={index}
              className={`absolute h-full w-full transition-opacity duration-300 ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className="relative h-full w-full overflow-hidden"
                onMouseMove={handleMouseMove}
                // onMouseLeave={() => setZoomPosition({ x: 0, y: 0 })}
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
                  alt={`Main image ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={100}
                  style={{
                    transformOrigin: `${zoomPosition.x * 100}% ${
                      zoomPosition.y * 100
                    }%`,
                    transform: `scale(${isZoomed ? 2 : 1})`,
                    // objectPosition: "39% 50%",
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
});

export default ProductSwiper;
