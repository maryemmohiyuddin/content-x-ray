"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Upload from "../../components/upload";
import Navbar from "../../components/navbar";
export default function UploadPage() {
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setLoading(false);
    }
    getUser();
  }, []);

  return (
    <div className="h-screen">
      <div className="h-full flex flex-col bg-gray-100">
        <Navbar />
        <div className="px-40 py-24 bg-gray-100">
          <Upload />
        </div>
      </div>
    </div>
  );
}
