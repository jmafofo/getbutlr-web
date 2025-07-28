import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/src/app/utils/supabase/server';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const formData = await req.formData();

  // Get File & Required Fields
  const file = formData.get('file') as File;
  const thumbnail = formData.get('thumbnail') as File | null;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const visibility = formData.get('visibility') as string;
  const audience = formData.get('audience') as string;

  if (!file || !title) {
    return NextResponse.json({ error: 'Missing file or title' }, { status: 400 });
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch Google Tokens
  const { data: tokenData, error: tokenError } = await supabase
    .from('google_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (tokenError || !tokenData) {
    return NextResponse.json({ error: 'No tokens found' }, { status: 400 });
  }

  // Google OAuth
  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
  );

  oauth2Client.setCredentials({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expiry_date: tokenData.expiry_date,
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload Video to YouTube
    const uploadResponse = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags: formData.get('tags')?.toString().split(',').map((tag) => tag.trim()) || [],
          categoryId: getCategoryId(formData.get('category') as string) || '22', // '22' = People & Blogs (default)
        },
        status: {
          privacyStatus: visibility || 'private',
          selfDeclaredMadeForKids: audience === 'yes',
          license: formData.get('license') as string || 'youtube',
          embeddable: formData.get('allowEmbedding') === 'true',
          publicStatsViewable: true,
        },
      },
      media: {
        body: Readable.from(fileBuffer),
      },
    });

    const videoId = uploadResponse.data.id;

    if (!videoId) {
      throw new Error("Failed to get video ID from YouTube.");
    }

    if (thumbnail) {
      console.log(`Uploading thumbnail for video ID: ${videoId}`);
      const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
      try {
        await youtube.thumbnails.set({
            videoId: videoId,
            media: {
                mimeType: thumbnail.type,
                body: Readable.from(thumbnailBuffer),
            },
        });
        console.log("Thumbnail uploaded successfully.");
      } catch (thumbError: any) {
        // Log the thumbnail error but don't fail the entire upload
        console.error('Could not upload thumbnail:', thumbError.response?.data?.error || thumbError.message);
      }
    }

    let thumbnailUrl: string | null = null;

    if (thumbnail) {
      const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
      const fileExt = thumbnail.name.split('.').pop();
      const filePath = `thumbnails/${videoId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('youtube-thumbnails') // Bucket name
        .upload(filePath, thumbnailBuffer, {
          contentType: thumbnail.type,
          upsert: true,
        });

      if (uploadError) {
        console.error('Error uploading thumbnail to Supabase Storage:', uploadError);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('youtube-thumbnails')
          .getPublicUrl(filePath);
        thumbnailUrl = publicUrlData.publicUrl;
      }
    }

    // Insert Metadata to Supabase
    const { error: insertError } = await supabase.from('youtube_uploads').insert({
      user_id: userId,
      video_id: videoId,
      title,
      description,
      visibility,
      audience,
      paid_promotion: formData.get('paidPromotion') === 'true',
      altered_content: formData.get('alteredContent') as string,
      tags: formData.get('tags')?.toString().split(',').map((tag) => tag.trim()) || [],
      language: formData.get('language') as string,
      caption_certification: formData.get('captionCertification') as string,
      recording_date: formData.get('recordingDate') as string,
      video_location: formData.get('videoLocation') as string,
      license: formData.get('license') as string,
      allow_embedding: formData.get('allowEmbedding') === 'true',
      notify_subscribers: formData.get('notifySubscribers') === 'true',
      remix_option: formData.get('remixOption') as string,
      category: formData.get('category') as string,
      comments: formData.get('comments') as string,
      moderation: formData.get('moderation') as string,
      sort_comments_by: formData.get('sortCommentsBy') as string,
      file_name: file.name,
      file_size: file.size,
      thumbnail_url: thumbnailUrl,
    });

    if (insertError) {
      console.error('Supabase Insert Error:', insertError);
    }

    return NextResponse.json({ success: true, videoId }, { status: 200 });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper: Map Category Name to YouTube Category ID
function getCategoryId(category: string) {
  const categories: Record<string, string> = {
    Gaming: '20',
    Education: '27',
    Entertainment: '24',
    'Science & Technology': '28',
    'People & Blogs': '22',
    Music: '10',
    News: '25',
    Sports: '17',
    Travel: '19',
    Comedy: '23',
    Film: '1',
  };

  return categories[category] || '22'; // Default to 'People & Blogs'
}
