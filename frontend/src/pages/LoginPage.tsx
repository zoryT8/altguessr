import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  CircleX,
  MapPin,
  SaveIcon,
  ShieldAlert,
  Trash2Icon,
  View,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../App";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { useUserStore } from "../store/useUserStore";

interface FormData {
  username: string;
  password: string;
}

function LoginPage() {
  const { setUsername } = useUserStore();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string>();

  const login = async () => {
    setLoadingState(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, formData);
      toast.success("Login successful", {
        style: {
          borderRadius: "6px",
          background: "#333",
          color: "#fff",
        },
      });
      setUsername(formData.username);
      navigate("/");
    } catch (error) {
      toast.error("Username or password was incorrect", {
        style: {
          borderRadius: "6px",
          background: "#333",
          color: "#fff",
        },
      });
      console.log("Error in login function", error);
    } finally {
      setLoadingState(false);
    }
  };

  if (loadingState) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (errorState) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="bg-base-100 rounded-full p-6">
          <ShieldAlert className="size-12" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold ">Something went wrong.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen overflow-auto">
      <Navbar></Navbar>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* LOGIN FORM */}
        <div className="card bg-base-100 shadow-lg max-h-10/12 overflow-auto">
          <div className="card-body">
            <div className="flex justify-center">
              <h2 className="card-title text-2xl mb-6 font-extrabold text-accent">
                Login
              </h2>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
              className="space-y-6"
            >
              {/* USERNAME INPUT */}
              <div className="form-control">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username"
                    className="input input-bordered w-full pl-4 py-3 focus:input-primary transition-colors duration-200"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* PASSWORD INPUT */}
              <div className="form-control">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Password"
                    className="input input-bordered w-full pl-4 py-3 focus:input-primary transition-colors duration-200"
                    value={"*".repeat(formData.password.length)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* FORM ACTIONS */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="btn btn-primary transition w-full
            duration-300 ease-in-out hover:-translate-y-1"
                  disabled={
                    !formData.username ||
                    !formData.password ||
                    loadingState ||
                    formData.username.toLowerCase() == "guest"
                  }
                >
                  {loadingState ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <div>Login</div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
