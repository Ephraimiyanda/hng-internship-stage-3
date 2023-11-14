// SignIn.tsx

import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/router";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuth();
  const router = useRouter();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here, you can perform your login logic
    login({ username, password });
    // Reset the form fields
    setUsername("");
    setPassword("");
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4  bg-white p-5 rounded-[15px]">
        <p>use <span className="font-semibold">user@example.com</span> and <span className="font-semibold">1Password<span/> as the username and password</p>
        <div className="flex justify-center">
          <h1 className="w-fit text-xl font-sm">Login</h1>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            fullWidth
            isClearable
            label="Username"
            labelPlacement="outside"
            className="text-black"
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            errorMessage={error}
            label="Password"
            labelPlacement="outside"
            className="text-black"
          />
        </div>
        <div className="mb-4">
          <Button type="submit" color="primary" fullWidth>
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
