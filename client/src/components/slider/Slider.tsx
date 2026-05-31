import { useState } from "react";

function Slider({ images }: { images: string[] }) {
  const [imageIndex, setImageIndex] = useState<number | null>(null);

  const changeSlide = (direction: "left" | "right") => {
    if (imageIndex === null) return;

    if (direction === "left") {
      if (imageIndex === 0) {
        setImageIndex(images.length - 1);
      } else {
        setImageIndex(imageIndex - 1);
      }
    } else {
      if (imageIndex === images.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  };

  return (
    <div className="w-full h-[350px] flex gap-5 max-[738px]:h-[280px]">
      {imageIndex !== null && (
        <div className="absolute w-screen h-screen top-0 left-0 bg-black flex justify-between items-center z-[9999]">
          <div className="flex-1 flex items-center justify-center cursor-pointer" onClick={() => changeSlide("left")}>
            <img className="w-[50px] max-[1024px]:w-[30px] max-[738px]:w-5" src="/arrow.png" alt="" />
          </div>
          <div className="flex-[10]">
            <img className="w-full h-full object-cover" src={images[imageIndex]} alt="" />
          </div>
          <div className="flex-1 flex items-center justify-center cursor-pointer" onClick={() => changeSlide("right")}>
            <img className="w-[50px] max-[1024px]:w-[30px] max-[738px]:w-5 rotate-180" src="/arrow.png" alt="" />
          </div>
          <div className="absolute top-0 right-0 text-white text-4xl font-bold p-12 cursor-pointer" onClick={() => setImageIndex(null)}>
            X
          </div>
        </div>
      )}
      <div className="flex-[3] max-[738px]:flex-2">
        <img className="w-full h-full object-cover rounded-[10px] cursor-pointer" src={images[0]} alt="" onClick={() => setImageIndex(0)} />
      </div>
      <div className="flex-1 flex flex-col justify-between gap-5">
        {images.slice(1).map((image, index) => (
          <img
            className="w-full h-[100px] max-[738px]:h-20 object-cover rounded-[10px] cursor-pointer"
            src={image}
            alt=""
            key={index}
            onClick={() => setImageIndex(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
