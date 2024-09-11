/* eslint-disable  @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { google, youtube_v3 } from 'googleapis';
import { cookies } from 'next/headers';
import fs from 'fs';
import os from 'os';
import path from 'path';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BASE_URL}/api/auth/callback`
);

interface UploadVideoParams {
  auth: any;
  videoFilePath: string;
  title: string;
  description: string;
  tags: string[];
}

async function uploadVideo({
  auth,
  videoFilePath,
  title,
  description,
  tags
}: UploadVideoParams): Promise<youtube_v3.Schema$Video> {
  const youtube = google.youtube({ version: 'v3', auth });

  try {
    const fileSize = fs.statSync(videoFilePath).size;
    const res = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: '22' // category 22,
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
    },
      {
        onUploadProgress: (evt: any) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          console.log(`${progress.toFixed(2)}% complete`);
        },
      });

    console.log('Video uploaded. Video ID:', res.data.id);
    return res.data;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const cookieStore = cookies();
  const tokensCookie = cookieStore.get('youtube_tokens');

  if (!tokensCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const tokens = JSON.parse(tokensCookie.value);
  oauth2Client.setCredentials(tokens);

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const title = formData.get('title') as string | null;
  const description = formData.get('description') as string | null;
  const tags = (formData.get('tags') as string | null)?.split(',') ?? [];

  if (!file || !title || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const tempFilePath = path.join(os.tmpdir(), file.name);
  const fileBuffer = await file.arrayBuffer();

  fs.writeFileSync(tempFilePath, Buffer.from(fileBuffer));

  try {
    const videoData = await uploadVideo({
      auth: oauth2Client,
      videoFilePath: tempFilePath,
      title,
      description,
      tags
    });
    return NextResponse.json({ success: true, videoId: videoData.id });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  } finally {
    fs.unlinkSync(tempFilePath);
  }
}