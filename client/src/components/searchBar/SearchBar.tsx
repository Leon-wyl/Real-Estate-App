import { useState } from "react";
import { Link } from "react-router-dom";

const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: 0,
    maxPrice: 9999999,
  });

  const switchType = (val: "buy" | "rent") => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="">
      <div className="">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type as "buy" | "rent")}
            className={`py-4 px-9 border border-[#999] border-b-0 cursor-pointer bg-white capitalize first:rounded-tl-[5px] first:border-r-0 last:rounded-tr-[5px] last:border-l-0 ${
              query.type === type ? "!bg-black text-white" : ""
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <form className="border border-[#999] flex justify-between h-16 gap-[5px] max-[738px]:flex-col max-[738px]:border-none max-[738px]:h-auto">
        <input
          className="border-none px-[10px] w-[200px] max-[1366px]:px-[5px] max-[1024px]:w-[200px] max-[738px]:w-auto max-[738px]:p-5 max-[738px]:border max-[738px]:border-[#999]"
          type="text"
          name="city"
          placeholder="City Location"
          onChange={handleChange}
        />
        <input
          className="border-none px-[10px] w-[200px] max-[1366px]:px-[5px] max-[1366px]:w-[140px] max-[1024px]:w-[200px] max-[738px]:w-auto max-[738px]:p-5 max-[738px]:border max-[738px]:border-[#999]"
          type="number"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          onChange={handleChange}
        />
        <input
          className="border-none px-[10px] w-[200px] max-[1366px]:px-[5px] max-[1366px]:w-[140px] max-[1024px]:w-[200px] max-[738px]:w-auto max-[738px]:p-5 max-[738px]:border max-[738px]:border-[#999]"
          type="number"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          onChange={handleChange}
        />
        <Link
          className="bg-[#fece51] flex flex-1 justify-center items-center"
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
        >
          <button className="border-none cursor-pointer bg-[#fece51] flex-1 max-[738px]:p-[10px]">
            <img className="w-6 h-6 mx-auto" src="/search.png" alt="" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
