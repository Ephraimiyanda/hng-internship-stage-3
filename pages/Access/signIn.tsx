import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { useAuth } from "../../context/authContext"; // Import useAuth hook
import { useRouter } from "next/router"; // Import useRouter hook

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login,error } = useAuth(); // Use the useAuth hook to access authentication functions
  const router = useRouter(); // Use the useRouter hook to navigate

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here, you can perform your login logic
    login({ username, password }); // Call the login function from the useAuth hook
    // Reset the form field
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <form onSubmit={handleSubmit}  className="flex flex-col gap-3  bg-white p-5 rounded-[15px]">
      <div className="flex justify-center"><h1 className="w-fit text-xl font-sm">Login</h1></div>
        <div className="mb-4">
          <Input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            fullWidth
            isClearable
            label="Username"
            labelPlacement="outside"
          />
        </div>
        <div className="mb-4">
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            errorMessage={error&&"please enter a valid password or email"}
            label="Password"
            labelPlacement="outside"
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
