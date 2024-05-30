"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Form } from "../../components/form";
import { SubmitButton } from "../../components/submit-button";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Signup() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (formData: FormData) => {
    setLoading(true);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClientComponentClient();

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setLoading(false);

        toast.error(error.message);
        console.error("Authentication error:", error);
        return;
      }

      if (data && phoneNumber) {
        const res = await supabase.from("user_profiles").insert([
          {
            user_id: data?.user?.id,
            phone_number: phoneNumber,
            budget: budget,
          },
        ]);
        console.log(res.status);

        if (res.status === 201) {
          window.location.href = "/login";
        } else {
          setLoading(false);

          toast.error("Error occurred");
          return;
        }
      }
    } catch (error) {
      setLoading(false);

      console.error("Sign up error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 text-black">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <ToastContainer />

          <h3 className="text-xl font-semibold">Sign Up</h3>
          <p className="text-sm text-gray-500">
            Create an account with your email, phone number, and password
          </p>
        </div>
        <div className={`${loading ? "pointer-events-none opacity-70" : ""}`}>
          <Form action={handleSignUp}>
            <div className="text-xs  text-gray-600 uppercase">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+920987654321"
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
              />
            </div>
            <div className="text-xs  text-gray-600 uppercase">
              <label htmlFor="budget">Possible Budget</label>
              <input
                id="budget"
                name="budget"
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="50,000"
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
              />
            </div>
            <SubmitButton>
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Sign Up"}
            </SubmitButton>
            <p className="text-center text-sm text-gray-600">
              {"Already have an account? "}
              <Link href="/login" className="font-semibold text-gray-800">
                Sign in
              </Link>
              {" instead."}
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}
