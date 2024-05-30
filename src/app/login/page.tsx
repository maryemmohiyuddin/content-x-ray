"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { Form } from "../../components/form";
import { SubmitButton } from "../../components/submit-button";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (formData: FormData) => {
    setLoading(true);
    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        toast.error(error.message);
        console.error("Authentication error:", error);
        return;
      }
      if (data) {
        window.location.href = "/upload";
      }
    } catch (error) {
      setLoading(false);
      console.error("Authentication error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center text-black bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <ToastContainer />
          <h3 className="text-xl font-semibold text-black">Sign In</h3>
          <p className="text-sm text-gray-500">
            Use your email and password to sign in
          </p>
        </div>
        <div className={`${loading ? "opacity-60 pointer-events-none" : ""}`}>
          <Form action={handleSignIn}>
            <SubmitButton>
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Sign in"}
            </SubmitButton>
            <p className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/signup" className="font-semibold text-gray-800">
                Sign up
              </Link>
              {" for free."}
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}
