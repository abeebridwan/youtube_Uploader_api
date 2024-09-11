"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const YoutubePageComponent = () => {
  const [videoUploaded, setVideoUploaded] = useState<boolean>(false);

   
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

        <Button className="mb-4">
          Sign Out
        </Button>
     

      {!videoUploaded && (
        <Input
          type="file"
          accept="video/mp4,video/x-m4v,video/*"
          onChange={handleUpload}
          className="mb-4 w-min"
        />
      )}

      {videoUploaded && (
        <p className="text-green-500">Your YouTube Short has been uploaded and completed.</p>
      )}
    </div>
  );
};

export default YoutubePageComponent;
