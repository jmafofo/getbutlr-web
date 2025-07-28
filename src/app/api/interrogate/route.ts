import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()

  const imageFile = formData.get('image_file')
  const imageUrl = formData.get('image_url')

  if (!imageFile && !imageUrl) {
    return NextResponse.json(
      { error: 'Either image_file or image_url must be provided.' },
      { status: 400 }
    )
  }

  const backendUrl = process.env.BACKEND_URL
  
  const backendFormData = new FormData()
  if (imageFile) backendFormData.append('image_file', imageFile as Blob)
  if (imageUrl) backendFormData.append('image_url', imageUrl as string)

  try {
    const response = await fetch(`${backendUrl}/api/v1/interrogate`, {
      method: 'POST',
      body: backendFormData,
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: result.detail || 'Backend error' },
        { status: response.status }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to backend.', detail: String(error) },
      { status: 500 }
    )
  }
}
