import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import SearchBar from "../../components/searchBar/SearchBar";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  return (
    <div className="flex h-full">
      <div className="flex-[3]">
        <div className="pr-[100px] flex flex-col justify-center gap-[50px] h-full max-[1366px]:pr-[50px] max-[1024px]:p-0 max-[738px]:justify-start">
          <h1 className="text-[64px] font-bold max-[1366px]:text-[48px] leading-[1.2]">Find Real Estate & Get Your Dream Place</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
            explicabo suscipit cum eius, iure est nulla animi consequatur
            facilis id pariatur fugit quos laudantium temporibus dolor ea
            repellat provident impedit!
          </p>
          <SearchBar />
          <div className="flex justify-between max-[738px]:hidden">
            <div className="box">
              <h1 className="text-4xl max-[1366px]:text-[32px] font-bold">16+</h1>
              <h2 className="text-xl font-light">Years of Experience</h2>
            </div>
            <div className="box">
              <h1 className="text-4xl max-[1366px]:text-[32px] font-bold">200</h1>
              <h2 className="text-xl font-light">Award Gained</h2>
            </div>
            <div className="box">
              <h1 className="text-4xl max-[1366px]:text-[32px] font-bold">2000+</h1>
              <h2 className="text-xl font-light">Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-[2] bg-[#fcf5f3] relative flex items-center max-[1024px]:hidden">
        <img className="w-[115%] absolute right-0 max-[1366px]:w-[105%]" src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
