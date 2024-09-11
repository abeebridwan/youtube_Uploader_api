"use client"

import { Button } from "@/components/ui/button"

const HomePage = () => {
  const handleAuth = async () => {
    try {
      window.location.href = '/api/auth';
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Button onClick={handleAuth} className="mb-4">
          Login
        </Button>
    </div>
  );
};

export default HomePage