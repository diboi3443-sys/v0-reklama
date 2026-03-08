import { getSupabase } from '../supabase'

const STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'higgsfield-media'

export interface UploadOptions {
  userId: string
  jobId: string
  type: 'image' | 'video' | 'audio'
  contentType?: string
}

/**
 * Upload file buffer to Supabase Storage
 */
export async function uploadToStorage(
  buffer: Buffer,
  options: UploadOptions
): Promise<string> {
  const supabase = getSupabase() // <-- ВНУТРИ функции!
  const { userId, jobId, type, contentType } = options
  
  // Generate unique filename
  const extension = getExtension(contentType || 'image/png')
  const fileName = `${userId}/${jobId}/${Date.now()}.${extension}`
  
  // Ensure bucket exists
  await ensureBucket()
  
  // Upload file
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, buffer, {
      contentType: contentType || 'image/png',
      upsert: false,
    })
  
  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`)
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName)
  
  return publicUrl
}

/**
 * Upload from URL (download first, then upload)
 */
export async function uploadFromUrl(
  url: string,
  options: UploadOptions
): Promise<string> {
  // Download file
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download file from ${url}`)
  }
  
  const buffer = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type') || undefined
  
  // Upload to storage
  return uploadToStorage(buffer, {
    ...options,
    contentType,
  })
}

/**
 * Delete file from storage
 */
export async function deleteFromStorage(filePath: string): Promise<void> {
  const supabase = getSupabase() // <-- ВНУТРИ функции!
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([filePath])
  
  if (error) {
    throw new Error(`Storage delete failed: ${error.message}`)
  }
}

/**
 * Ensure storage bucket exists (create if not)
 */
async function ensureBucket(): Promise<void> {
  const supabase = getSupabase() // <-- ВНУТРИ функции!
  const { data: buckets } = await supabase.storage.listBuckets()
  
  const bucketExists = buckets?.some(b => b.name === STORAGE_BUCKET)
  
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: 100 * 1024 * 1024, // 100MB
    })
    
    if (error) {
      throw new Error(`Failed to create bucket: ${error.message}`)
    }
  }
}

/**
 * Get file extension from MIME type
 */
function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
  }
  
  return map[mimeType] || 'bin'
}
