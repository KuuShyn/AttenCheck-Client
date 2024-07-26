"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

const SignoutPage = () => {
  useEffect(() => {
    const handleSignOut = async () => {
      await signOut({
        callbackUrl: "/",
      });
    };

    handleSignOut();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Signing you out...</h1>
        <svg
          className="animate-spin h-5 w-5 text-gray-900"
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default SignoutPage;
