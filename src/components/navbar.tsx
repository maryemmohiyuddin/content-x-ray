import React, { useState, useEffect } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

function Navbar() {
  const [activePage, setActivePage] = useState("/");
  const [currentRoute, setCurrentRoute] = useState("/");

  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleClick = (route: string) => {
    setActivePage(route);
    router.push(route);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };
  useEffect(() => {
    const currentRoute = window.location.pathname;
    setCurrentRoute(currentRoute);
  });

  return (
    <div>
      <nav className="bg-white w-full px-14 z-20 top-0 shadow-sm start-0 text-black ">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center gap-2">
            <img src="header-logo.svg" alt="" className="w-36" />
            {/* <p className="text-xl font-semibold">ImplementAI</p> */}
          </div>
          <div>
            <ul className="flex space-x-6">
              <li
                className={`flex cursor-pointer text-sm items-center space-x-2 py-4 pr-2 ${
                  currentRoute === "/upload" ? "border-b-2 border-theme" : ""
                }`}
                onClick={() => handleClick("/upload")}
              >
                <AiOutlineUpload fontSize="20px" />
                <span>Upload</span>
              </li>
              <li
                className={`flex cursor-pointer text-sm items-center space-x-2 py-4 pr-2 ${
                  currentRoute === "/settings" ? "border-b-2 border-theme " : ""
                }`}
                onClick={() => handleClick("/settings")}
              >
                <CiSettings fontSize="20px" />
                <span>Settings</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center  items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button className="bg-transparent !py-2">
                  <img
                    src="2.jpg"
                    className="w-10 h-10 cursor-pointer"
                    alt="Profile"
                  />
                  <div className="text-xs">
                    <p>Username</p>
                    <p className="opacity-60 !ml-0 !ms-0 !self-start">Admin</p>
                  </div>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Action event example"
                onAction={handleLogout}
              >
                <DropdownItem className="text-danger hover:bg-gray-100">
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
