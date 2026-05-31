import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const username = form.get("username");
    const email = form.get("email");
    const password = form.get("password");
    
    try {
      await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-full flex">
      <div className="flex-[3] h-full flex items-center justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold">Create an Account</h1>
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="p-5 border border-gray-300 rounded-md"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="p-5 border border-gray-300 rounded-md"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="p-5 border border-gray-300 rounded-md"
          />
          <button
            disabled={isLoading}
            className="p-5 rounded-md border-none bg-teal-600 text-white font-bold cursor-pointer disabled:bg-[#BED9D8] disabled:cursor-not-allowed"
          >
            Register
          </button>
          {error && <span className="text-[rgba(255,0,0,0.591)]">{error}</span>}
          <Link to="/login" className="text-sm text-gray-500 border-b border-gray-500 w-max">
            Do you have an account?
          </Link>
        </form>
      </div>
      <div className="flex-[2] bg-[#fcf5f3] flex items-center justify-center max-[1024px]:hidden">
        <img src="/bg.png" alt="" className="w-full" />
      </div>
    </div>
  );
}

export default Register;
