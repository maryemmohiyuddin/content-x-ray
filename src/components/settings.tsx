import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { GiGearStickPattern } from "react-icons/gi";
import { Input } from "@nextui-org/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@nextui-org/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
type UpdateData = {
  email: string;
  password?: string;
  data: {
    budget: string;
    phone_number: string;
  };
};
export default function Settings() {
  const supabase = createClientComponentClient();
  const [initialEmail, setInitialEmail] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedAnimal, setSelectedAnimal] = useState(new Set<string>());

  const selectOptions = [
    { label: "OpenAI", value: "OpenAI" },
    { label: "Claude", value: "Claude" },
  ];

  const handleSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys).join("");
    setSelectedAnimal(keys);
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const updateData: UpdateData = {
        email: email,
        data: { budget: budget, phone_number: phoneNumber },
      };

      if (password) {
        updateData.password = password;
      }

      const { data: user, error } = await supabase.auth.updateUser(updateData);

      if (error) {
        setLoading(false);
        toast.error(error.message);
        console.error("Update error:", error);
        return;
      }

      if (user) {
        setLoading(false);
        if (email !== initialEmail) {
          toast.success("Email verification link sent to new email.");
        } else {
          toast.success("User updated successfully");
        }
      } else {
        setLoading(false);
        toast.error("Error occurred");
        return;
      }
    } catch (error) {
      setLoading(false);
      console.error("Update error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userEmail = user?.email || "";
      const newEmail = user?.new_email || "";

      setEmail(userEmail);
      setInitialEmail(newEmail);
      setBudget(user?.user_metadata.budget || "");
      setPhoneNumber(user?.user_metadata.phone_number || "");
    }

    getUser();
  }, [supabase]);
  return (
    <div className="flex space-x-10 !text-black items-center h-full justify-center">
      <div className="w-[20%] self-start  rounded-lg   h-full">
        <ToastContainer />
        <h1 className="text-xl font-semibold mb-6">Settings</h1>
        <ul className="list-none space-y-2">
          <li
            className={`py-2 px-3 cursor-pointer flex items-center gap-2 rounded-md ${
              activeTab === "profile"
                ? "bg-theme text-white"
                : "hover:bg-theme hover:bg-opacity-25 transition-all duration-150"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <CgProfile />
            Profile
          </li>
          <li
            className={`py-2 px-3 cursor-pointer flex items-center gap-2 rounded-md ${
              activeTab === "llm"
                ? "bg-theme text-white"
                : "hover:bg-theme hover:bg-opacity-25 transition-all duration-150 "
            }`}
            onClick={() => setActiveTab("llm")}
          >
            <GiGearStickPattern />
            LLM
          </li>
        </ul>
      </div>
      <div className="h-full w-[80%] py-10 px-10 rounded-lg bg-white border">
        {activeTab === "profile" && (
          <>
            <h1 className="text-xl font-semibold">Profile</h1>
            <p className="text-sm">You can edit your profile data here</p>
            <form className="grid grid-cols-2 py-6 space-x-6">
              <div className="col col-span-1 space-y-4">
                <Input
                  type="email"
                  label="Email"
                  variant="bordered"
                  placeholder="Enter your email"
                  value={email}
                  className="w-full"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div>
                  <Input
                    label="Password"
                    variant="bordered"
                    placeholder="Enter your password"
                    type="password"
                    className="w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p className="text-xs ps-2 mt-1">
                    Keep the password empty if you don't want to update it.
                  </p>
                </div>
              </div>
              <div className="col col-span-1 space-y-4">
                <Input
                  type="text"
                  label="Phone number"
                  variant="bordered"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  className="w-full"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Input
                  type="text"
                  label="Budget"
                  variant="bordered"
                  placeholder="Enter your budget"
                  value={budget}
                  className="w-full"
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </form>
            <div className="flex justify-end">
              <Button onClick={handleUpdate} className="bg-theme text-white">
                {loading ? "Updating..." : "Update"}
              </Button>
            </div>
          </>
        )}
        {activeTab === "llm" && (
          <>
            <h1 className="text-xl font-semibold">LLM</h1>
            <p className="text-sm">You can edit your LLM settings here.</p>
            <form className="py-6 !text-black space-y-4">
              <Select
                items={selectOptions}
                label="LLM Model"
                placeholder="Select an LLM model"
                selectedKeys={selectedAnimal}
                onSelectionChange={handleSelectionChange}
              >
                {(item) => (
                  <SelectItem key={item.value}>{item.label}</SelectItem>
                )}
              </Select>
              <Textarea
                label="Prompt"
                placeholder="Enter your prompt"
                className="w-full"
              />
            </form>
            <div className="flex justify-end">
              <Button className="bg-theme text-white">
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
