"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Download,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";

// Define the component's state
type FormState = {
  quote: string;
  author: string;
  isLoading: boolean;
  error: string | null;
  imageUrl: string | null;
};

export function QuoteForm() {
  const [state, setState] = React.useState<FormState>({
    quote:
      "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    isLoading: false,
    error: null,
    imageUrl: null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      imageUrl: null,
    }));

    console.log("Form Submitted:", {
      quote: state.quote,
      author: state.author,
    });

    // Simulate a fake API call (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setState((prev) => ({
      ...prev,
      isLoading: false,
      // We use a placeholder image for now
      imageUrl: `https://placehold.co/1200x630/1a202c/e2e8f0?text=${encodeURIComponent(
        `"${prev.quote.substring(0, 50)}..."`
      )}`,
    }));
  };

  // Helper function to update state on input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    // Main card wrapping the entire UI
    <Card className="w-full max-w-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Quote Image Generator
        </CardTitle>
        <CardDescription>
          Turn your text into a beautiful, shareable image.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Quote Textarea */}
          <div className="space-y-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea
              id="quote"
              name="quote"
              placeholder="Enter your quote..."
              value={state.quote}
              onChange={handleChange}
              rows={4}
              maxLength={280}
              required
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground text-right">
              {state.quote.length} / 280
            </p>
          </div>

          {/* Author Input */}
          <div className="space-y-2">
            <Label htmlFor="author">Author / Source (Optional)</Label>
            <Input
              id="author"
              name="author"
              placeholder="e.g., Nelson Mandela or @username"
              value={state.author}
              onChange={handleChange}
              maxLength={50}
            />
          </div>

          {/* Error Alert */}
          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-stretch space-y-4">
          {/* Submit Button */}
          <Button type="submit" disabled={state.isLoading} className="w-full">
            {state.isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="mr-2 h-4 w-4" />
            )}
            {state.isLoading ? "Generating Image..." : "Generate Image"}
          </Button>
        </CardFooter>
      </form>

      {/* --- RESULT PREVIEW --- */}
      {/* This section only appears *after* the image is generated */}
      {state.imageUrl && !state.isLoading && (
        <CardFooter className="flex flex-col items-stretch space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-center">Your Image</h3>
          
          {/* Image Preview */}
          <div className="rounded-lg border bg-muted/30 overflow-hidden">
            <img
              src={state.imageUrl}
              alt="Generated quote"
              className="w-full h-auto aspect-video object-cover"
            />
          </div>

          {/* Download Button */}
          <Button asChild variant="secondary">
            <a href={state.imageUrl} download="quote.png">
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}