"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Settings from "../../components/settings";
import Navbar from "../../components/navbar";
export default function SettingsPage() {
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
    <div className="h-screen bg-gray-100">
      <Navbar />
      <div className="mx-40 my-24">
        <Settings />
      </div>
    </div>
  );
}
