"use client";

import { useForm } from "react-hook-form";
import React from "react";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { formState } = useForm();

  return (
    <button
      type={formState.isSubmitting ? "button" : "submit"}
      aria-disabled={formState.isSubmitting}
      className="flex h-10 w-full bg-theme text-white items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
    >
      {children}
      {formState.isSubmitting && (
        <svg
          className="animate-spin ml-2 h-4 w-4 text-black"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      <span aria-live="polite" className="sr-only text-black" role="status">
        {formState.isSubmitting ? "Loading" : "Submit form"}
      </span>
    </button>
  );
}
