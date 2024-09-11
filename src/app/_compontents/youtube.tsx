
"use client";

import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface UploadResponse {
  success: boolean;
  videoId?: string;
  error?: string;
}

const YoutubePageComponent: React.FC = () => {
  const [videoUploaded, setVideoUploaded] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", "My YouTube Short"); 
    formData.append("description", "This is a short video uploaded via API");
    formData.append("tags", "API,upload,short");

    try {
      const response = await fetch("/api/youtube/upload", {
        method: "POST",
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (response.ok && result.success) {
        console.log("Video uploaded successfully. Video ID:", result.videoId);
        setVideoUploaded(true);
        setVideoId(result.videoId || null);
      } else {
        console.error("Failed to upload video:", result.error);
        setError(result.error || "Failed to upload video. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setError("An error occurred while uploading. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Button className="mb-4">
        Sign Out
      </Button>

      {!videoUploaded && !isUploading && (
        <Input
          type="file"
          accept="video/mp4,video/x-m4v,video/*"
          onChange={handleUpload}
          className="mb-4 w-min"
        />
      )}

      {isUploading && <p>Uploading your video...</p>}

      {videoUploaded && (
        <p className="text-green-500">
          Your YouTube Short has been uploaded and completed.
          {videoId && <span> Video ID: {videoId}</span>}
        </p>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default YoutubePageComponent;