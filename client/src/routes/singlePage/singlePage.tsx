import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useLoaderData } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { Post } from "../../lib/types";

function SinglePage() {
  const post = useLoaderData() as Post;
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    // after react 19 use use() hook
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", {
        postId: post.id,
      });
    } catch (error) {
      console.log(error);
      setSaved((prev) => !prev);
    }
  };

  return (
    <div className="flex h-full max-[1024px]:flex-col max-[1024px]:overflow-scroll">
      <div className="flex-[3] h-full overflow-y-scroll max-[1024px]:flex-none max-[1024px]:h-max max-[1024px]:mb-[50px]">
        <div className="pr-[50px] max-[1366px]:pr-5 max-[1024px]:pr-0">
          <Slider images={post.images} />
          <div className="mt-[50px]">
            <div className="flex justify-between max-[738px]:flex-col max-[738px]:gap-5">
              <div className="flex flex-col gap-5">
                <h1 className="font-normal text-2xl">{post.title}</h1>
                <div className="flex gap-[5px] items-center text-gray-500 text-sm">
                  <img src="/pin.png" alt="" className="w-4 h-4" />
                  <span>{post.address}</span>
                </div>
                <div className="p-[5px] bg-[rgba(254,205,81,0.438)] rounded-md w-max text-xl font-light">
                  $ {post.price}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-5 px-[50px] rounded-[10px] bg-[rgba(254,205,81,0.209)] font-semibold max-[738px]:py-5">
                <img
                  src={post.user?.avatar || "/noavatar.jpg"}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <span>{post.user?.username}</span>
              </div>
            </div>
            <div className="mt-[50px] text-[#555] leading-5">{post?.postDetail?.desc}</div>
          </div>
        </div>
      </div>
      <div className="flex-[2] bg-[#fcf5f3] h-full overflow-y-scroll max-[1024px]:flex-none max-[1024px]:h-max max-[1024px]:mb-[50px]">
        <div className="px-5 flex flex-col gap-5 max-[1024px]:p-5">
          <p className="font-bold text-lg mb-[10px]">General</p>
          <div className="flex flex-col gap-5 py-5 px-[10px] bg-white rounded-[10px]">
            <div className="flex items-center gap-[10px]">
              <img src="/utility.png" alt="" className="w-6 h-6 bg-[rgba(254,205,81,0.209)]" />
              <div className="featureText">
                <span className="font-bold">Utilities</span>
                {post.postDetail?.utilities === "owner" ? (
                  <p className="text-sm">Owner is responsible</p>
                ) : (
                  <p className="text-sm">Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <img src="/pet.png" alt="" className="w-6 h-6 bg-[rgba(254,205,81,0.209)]" />
              <div className="featureText">
                <span className="font-bold">Pet Policy</span>
                {post.postDetail?.pet === "Allowed" ? (
                  <p className="text-sm">Pets are allowed</p>
                ) : (
                  <p className="text-sm">Pets not allowed</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <img src="/fee.png" alt="" className="w-6 h-6 bg-[rgba(254,205,81,0.209)]" />
              <div className="featureText">
                <span className="font-bold">Property Fees</span>
                <p className="text-sm">{post.postDetail?.income}</p>
              </div>
            </div>
          </div>
          <p className="font-bold text-lg mb-[10px]">Sizes</p>
          <div className="flex justify-between max-[1366px]:text-xs">
            <div className="flex items-center gap-[10px] bg-white p-[10px] rounded-md">
              <img src="/size.png" alt="" className="w-6 h-6" />
              <span>{post.postDetail?.size}sqft</span>
            </div>
            <div className="flex items-center gap-[10px] bg-white p-[10px] rounded-md">
              <img src="/bed.png" alt="" className="w-6 h-6" />
              <span>{post.bedroom} bedrooms</span>
            </div>
            <div className="flex items-center gap-[10px] bg-white p-[10px] rounded-md">
              <img src="/bath.png" alt="" className="w-6 h-6" />
              <span>{post.bathroom} bathrooms</span>
            </div>
          </div>
          <p className="font-bold text-lg mb-[10px]">Nearby Places</p>
          <div className="flex justify-between py-5 px-[10px] bg-white rounded-[10px]">
            <div className="flex items-center gap-[10px]">
              <img src="/school.png" alt="" className="w-6 h-6 bg-[rgba(254,205,81,0.209)]" />
              <div className="featureText">
                <span className="font-bold">School</span>
                <p className="text-sm">{post.postDetail?.school}m away</p>
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <img src="/pet.png" alt="" className="w-6 h-6 bg-[rgba(254,205,81,0.209)]" />
              <div className="featureText">
                <span className="font-bold">Bus Stop</span>
                <p className="text-sm">{post.postDetail?.bus}m away</p>
              </div>
            </div>
            <div className="flex items-center gap-[10px]">
              <img src="/fee.png" alt="" className="w-6 h-6 bg-[rgba(254,205,81,0.209)]" />
              <div className="featureText">
                <span className="font-bold">Restaurant</span>
                <p className="text-sm">{post.postDetail?.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="font-bold text-lg mb-[10px]">Location</p>
          <div className="w-full h-[200px]">
            <Map items={[post]} />
          </div>
          <div className="flex justify-between">
            <button className="p-5 flex items-center gap-[5px] bg-white border border-[#fece51] rounded-md cursor-pointer">
              <img src="/chat.png" alt="" className="w-4 h-4" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              className="p-5 flex items-center gap-[5px] border border-[#fece51] rounded-md cursor-pointer"
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" className="w-4 h-4" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
