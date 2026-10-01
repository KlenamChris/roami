import Link from "next/link";
import React from "react";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center text-center h-screen w-screen">
      <div className="border p-6 rounded-2xl backdrop-blur-xs">
        <h1 className="text-7xl">Sign Up</h1>
        <p className="text-lg font-bold">
          Hello there! Let&apos;s get you started...
        </p>
        <form className="font-serif text-black flex flex-col">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
            className="border rounded-md text-sm p-2 m-2 border-black"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            className="border w-xs rounded-md text-sm p-2 m-2 border-black"
          />
          <button className="text-white bg-blue-800 p-2 m-2 rounded-md">
            Create Account
          </button>
          <button className="text-white bg-blue-800 p-2 m-2 rounded-md">
            Sign up with GitHub
          </button>
        </form>
        <p className="font-bold">
          Have an account? <Link href={"/login"} className="underline transition-all hover:text-blue-800 hover:duration-300">Log in here</Link>
        </p>
      </div>
    </div>
  );
}
