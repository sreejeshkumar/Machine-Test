import {
  Menu,
  Bell
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Header = ({ setIsOpen }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={23} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800">
          Welcome, {user?.name || "User"}!
        </h2>
      </div>

      <div className="flex items-center gap-4">
       
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-gray-500">
              {user?.email || ""}
            </p>
          </div>

         
        </div>
      </div>
    </header>
  );
};

export default Header;