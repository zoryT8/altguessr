import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, User } from "lucide-react";
import { useUserStore } from "../store/useUserStore";

function Navbar() {
  const { username } = useUserStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHomePage = pathname === "/";

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-screen mx-auto">
        <div className="navbar px-8 min-h-[4rem] justify-between">
          {/* LOGO */}
          <div className="flex-1 lg:flex-none">
            <button
              className="hover:opacity-80 transition-opacity cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="flex items-center gap-2">
                <MapPin className="size-9 text-primary" />
                <span
                  className="font-extrabold text-2xl 
                    bg-clip-text"
                >
                  AltGuessr
                </span>
              </div>
            </button>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2">
            <div className="font-bold">{username}</div>
            <div className="indicator">
              <div className="dropdown dropdown-hover dropdown-end p-2 rounded-full hover:bg-base-200 transition-colors">
                <User tabIndex={0} role="button" className="size-5" />
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                  <li>
                    <button
                      className="font-bold cursor-pointer"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <button
                      className="font-bold cursor-pointer"
                      onClick={() => navigate("/register")}
                    >
                      Register
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
