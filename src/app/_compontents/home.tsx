"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


const HomePageComponent = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [videoUploaded, setVideoUploaded] = useState<boolean>(false);

  const handleAuth = async () => {
    try {
      const response = await fetch("/api/auth");
      if (response.redirected) {
        setIsSignedIn(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setVideoUploaded(true);
      } else {
        console.error("Failed to upload video:", await response.text());
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {!isSignedIn ? (
        <Button onClick={handleAuth} className="mb-4">
          Login
        </Button>
      ) : (
        <Button onClick={() => setIsSignedIn(false)} className="mb-4">
          Sign Out
        </Button>
      )}

      {isSignedIn && !videoUploaded && (
        <Input
          type="file"
          accept="video/mp4,video/x-m4v,video/*"
          onChange={handleUpload}
          className="mb-4"
        />
      )}

      {videoUploaded && (
        <p className="text-green-500">Your YouTube Short has been uploaded and completed.</p>
      )}
    </div>
  );
};

export default HomePageComponent;
