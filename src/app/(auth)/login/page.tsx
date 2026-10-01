import Link from "next/link";
import React from "react";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center text-center h-screen w-screen">
      <div className="border p-6 rounded-2xl backdrop-blur-xs">
        <h1 className="text-7xl">Login</h1>
        <p className="text-lg font-bold">Welcome back!</p>
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
          <button className="bg-blue-500 p-2 m-2 rounded-md">Log in</button>
        </form>
        <p className="flex justify-between font-bold">
          Forgot Password? <Link href={"/signup"} className="hover:underline transition-all hover:text-blue-800 duration-300">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

