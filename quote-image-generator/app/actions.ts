'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma' 
import { revalidatePath } from 'next/cache'

export type ActionState = {
  error?: string
  imageId?: string 
}

// 1. Define the validation schema using Zod
const QuoteSchema = z.object({
  quote: z
    .string()
    .min(10, { message: 'Quote must be at least 10 characters long.' })
    .max(280, { message: 'Quote must be 280 characters or less.' }),
  author: z
    .string()
    .max(50, { message: 'Author name must be 50 characters or less.' })
    .optional() 
    .or(z.literal('')), 
})

// 2. Create the Server Action
export async function generateQuoteImage(
  prevState: ActionState,
  formData: FormData,   
): Promise<ActionState> {
  
  // 3. Validate the form data
  const validatedFields = QuoteSchema.safeParse({
    quote: formData.get('quote'),
    author: formData.get('author'),
  })

  // 4. If validation fails, return the error
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.quote?.[0] 
             || validatedFields.error.flatten().fieldErrors.author?.[0]
             || 'Invalid input.',
    }
  }

  try {
    const { quote, author } = validatedFields.data

    const entry = await prisma.quoteImage.create({
      data: {
        quote: quote,
        author: author || null,
      },
    })

    // 6. Invalidate cache (good practice)
    revalidatePath('/')

    // 7. Return the ID of the newly created database entry
    return { imageId: entry.id }

  } catch (e) {
    console.error(e)
    return { error: 'Database error: Failed to create quote.' }
  }
}