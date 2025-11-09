import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
// We need to tell Vercel to run this function on the Edge Runtime
// for @vercel/og to work.
export const runtime = 'edge'

// Helper function to fetch fonts
// @vercel/og needs the font data (ArrayBuffer) to render text.
// We are fetching Inter font from Google Fonts.
async function getFontData() {
  const InterRegular = fetch(
    new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FfAGk-q5w-Qp-EC.woff', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const InterBold = fetch(
    new URL('https://fonts.gstatic.com/s/inter/v13/UcC73FfXr-iS8PCLq8-k.woff', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return Promise.all([InterRegular, InterBold]);
}

export async function GET(request: NextRequest) {
  // 1. Get the 'id' from the URL query string
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return new Response('Missing quote ID', { status: 400 })
  }

  try {
    // 2. Fetch the quote data from the database using the id
    // We must use 'await' here
    const quoteEntry = await prisma.quoteImage.findUnique({
      where: { id: id },
    })

    if (!quoteEntry) {
      return new Response('Quote not found', { status: 404 })
    }

    const { quote, author } = quoteEntry
    const [interRegularData, interBoldData] = await getFontData();

    // 3. Use @vercel/og to generate an image
    // This is essentially writing HTML/CSS (using JSX)
    // that gets turned into a PNG.
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#1a202c', // Dark background
            color: '#e2e8f0', // Light text
            padding: '60px',
            fontFamily: '"Inter"', // Use the font
            textAlign: 'center',
          }}
        >
          {/* Main Quote Text */}
          <p
            style={{
              fontSize: '60px',
              fontWeight: 700, // Bold
              lineHeight: '1.2',
              marginBottom: '40px',
              maxWidth: '90%',
            }}
          >
            &ldquo;{quote}&rdquo;
          </p>
          
          {/* Author Text (only if it exists) */}
          {author && (
            <p
              style={{
                fontSize: '40px',
                fontWeight: 400, // Regular
                color: '#a0aec0', // Muted text color
              }}
            >
              — {author}
            </p>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // Pass the font data to ImageResponse
        fonts: [
          {
            name: 'Inter',
            data: interRegularData,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: interBoldData,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    )
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}