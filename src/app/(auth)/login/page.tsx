import React from "react";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center text-center h-screen w-screen">
      <div className="border p-20 rounded-2xl backdrop-blur-xs">
        <h1 className="text-7xl">Login</h1>
        <p className="text-lg font-bold">Welcome back!</p>
        <form className="font-serif text-black flex flex-col">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
            className="border-2 rounded-md p-2 m-2 border-black"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            className="border-2 w-xs rounded-md p-2 m-2 border-black"
          />
          <button className="bg-blue-500 p-2 m-2 rounded-md">
                Log in
          </button>
        </form>
        <p className="flex justify-between font-bold">Forgot Password? <span>Create Account</span></p>
      </div>
    </div>
  );
}
