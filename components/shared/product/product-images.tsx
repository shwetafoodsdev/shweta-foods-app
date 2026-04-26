"use client";

import { useState } from "react";
import Image from "next/image";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className=" flex items-center justify-center bg-white">
        <Image
          src={images[current]}
          alt="product image"
          width={500}
          height={500}
          className="object-contain h-[300px] w-full"
          priority
          sizes="(max-width: 768px) 100vw, 500px"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.map((image, index) => (
          <div
            key={`${index}-${image}`}
            onClick={() => setCurrent(index)}
            className={`border rounded-md p-1 cursor-pointer transition
              ${current === index ? "border-blue-500" : "border-gray-200"}
            `}
          >
            <Image
              src={image}
              alt={`thumb-${index}`}
              width={60}
              height={60}
              className="object-contain h-[60px] w-[60px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
