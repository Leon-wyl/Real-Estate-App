import { Link } from "react-router-dom";

import { Post } from "../../lib/types";

function Card({ item }: { item: Post }) {
  console.log(item);
  return (
    <div className="flex gap-5">
      <Link to={`/${item.id}`} className="flex-[2] h-[200px] max-[1024px]:hidden">
        <img
          src={item.img ? item.img : item.images[0]}
          alt=""
          className="w-full h-full object-cover rounded-[10px]"
        />
      </Link>
      <div className="flex-[3] flex flex-col justify-between gap-2.5">
        <h2 className="text-xl font-semibold text-[#444] transition-all duration-400 ease-in-out hover:text-black hover:scale-[1.01]">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="text-sm flex items-center gap-[5px] text-[#888]">
          <img src="/pin.png" alt="" className="w-4 h-4" />
          <span>{item.address}</span>
        </p>
        <p className="text-xl font-light p-[5px] rounded-[5px] bg-[#fecd516f] w-max">
          $ {item.price}
        </p>
        <div className="flex justify-between gap-2.5">
          <div className="flex gap-5 text-sm">
            <div className="flex items-center gap-[5px] bg-[#f5f5f5] p-[5px] rounded-[5px]">
              <img src="/bed.png" alt="" className="w-4 h-4" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="flex items-center gap-[5px] bg-[#f5f5f5] p-[5px] rounded-[5px]">
              <img src="/bath.png" alt="" className="w-4 h-4" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="border border-[#999] px-[5px] py-0.5 rounded-[5px] cursor-pointer flex items-center justify-center hover:bg-[#d3d3d3]">
              <img src="/save.png" alt="" className="w-4 h-4" />
            </div>
            <div className="border border-[#999] px-[5px] py-0.5 rounded-[5px] cursor-pointer flex items-center justify-center hover:bg-[#d3d3d3]">
              <img src="/chat.png" alt="" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
