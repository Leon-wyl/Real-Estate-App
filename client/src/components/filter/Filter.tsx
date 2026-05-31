import { useSearchParams } from "react-router-dom";
import { useState } from "react";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || 0,
    maxPrice: searchParams.get("maxPrice") || 9999999999,
    bedroom: searchParams.get("bedroom") || undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuery({
      ...query,
      [name]: value,
    });
  };

  const handleFilter = () => {
    const params: Record<string, string> = {};
    Object.entries(query).forEach(([key, value]) => {
      if (value) params[key] = value.toString();
    });
    setSearchParams(params);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <h1 className="font-light text-2xl">
        Search results for <b>{searchParams.get("city")}</b>
      </h1>
      <div className="">
        <div className="flex flex-col gap-0.5">
          <label htmlFor="city" className="text-[10px]">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City Location"
            onChange={handleChange}
            defaultValue={query.city}
            className="w-full p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm"
          />
        </div>
      </div>
      <div className="flex justify-between flex-wrap gap-5">
        <div className="flex flex-col gap-0.5">
          <label htmlFor="type" className="text-[10px]">Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
            className="w-[100px] p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm"
          >
            <option value="">any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="property" className="text-[10px]">Property</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
            className="w-[100px] p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm"
          >
            <option value="">any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="minPrice" className="text-[10px]">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.minPrice}
            className="w-[100px] p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="maxPrice" className="text-[10px]">Max Price</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.maxPrice}
            className="w-[100px] p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor="bedroom" className="text-[10px]">Bedroom</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.bedroom}
            className="w-[100px] p-[10px] border border-[#e0e0e0] rounded-[5px] text-sm"
          />
        </div>
        <button
          onClick={handleFilter}
          className="w-[100px] p-[10px] border-none cursor-pointer bg-[#fece51] flex items-center justify-center"
        >
          <img src="/search.png" alt="" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
