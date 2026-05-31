import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title as string,
          price: parseInt(inputs.price as string),
          address: inputs.address as string,
          city: inputs.city as string,
          bedroom: parseInt(inputs.bedroom as string),
          bathroom: parseInt(inputs.bathroom as string),
          type: inputs.type as string,
          property: inputs.property as string,
          latitude: inputs.latitude as string,
          longitude: inputs.longitude as string,
          images: images,
        },
        postDetail: {
          desc: inputs.desc as string,
          utilities: inputs.utilities as string,
          pet: inputs.pet as string,
          income: inputs.income as string,
          size: parseInt(inputs.size as string),
          school: parseInt(inputs.school as string),
          bus: parseInt(inputs.bus as string),
          restaurant: parseInt(inputs.restaurant as string),
        },
      });
      console.log(res);
      navigate("/" + res.data.id);
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-[3] overflow-scroll">
        <h1 className="text-2xl font-bold">Add New Post</h1>
        <div className="my-[30px] mr-[50px] mb-[100px] ml-0">
          <form onSubmit={handleSubmit} className="flex justify-between flex-wrap gap-5">
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                min={0}
                name="price"
                type="number"
                required
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px] description">
              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                name="desc"
                required
                className="rounded-md p-[10px] border border-gray-300 h-[55px]"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                required
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input
                min={0}
                id="bedroom"
                name="bedroom"
                type="number"
                required
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input
                min={0}
                id="bathroom"
                name="bathroom"
                type="number"
                required
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                required
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                required
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="type">Type</label>
              <select name="type" className="p-[19px] rounded-md border border-gray-300">
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="type">Property</label>
              <select name="property" className="p-[19px] rounded-md border border-gray-300">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" className="p-[19px] rounded-md border border-gray-300">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" className="p-[19px] rounded-md border border-gray-300">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="size">Total Size (sqft)</label>
              <input
                min={0}
                id="size"
                name="size"
                type="number"
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="school">School</label>
              <input
                min={0}
                id="school"
                name="school"
                type="number"
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="bus">bus</label>
              <input
                min={0}
                id="bus"
                name="bus"
                type="number"
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <div className="w-[30%] flex flex-col gap-[5px]">
              <label htmlFor="restaurant">Restaurant</label>
              <input
                min={0}
                id="restaurant"
                name="restaurant"
                type="number"
                className="p-5 rounded-md border border-gray-300"
              />
            </div>
            <button className="w-[30%] h-[55px] rounded-md border-none bg-teal-600 text-white font-bold cursor-pointer">
              Add
            </button>
            {error && <span className="text-red-500">{error}</span>}
          </form>
        </div>
      </div>
      <div className="flex-[2] bg-[#fcf5f3] flex flex-col gap-5 items-center justify-center max-[1024px]:hidden">
        {images.map((img, i) => (
          <img key={i} src={img} alt="" className="w-1/2 h-[180px] object-cover rounded-md" />
        ))}
        <UploadWidget
          uwConfig={{
            cloudName: "leonwu",
            uploadPreset: "estate",
            multiple: true,
            maxImageFileSize: 10000000,
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
