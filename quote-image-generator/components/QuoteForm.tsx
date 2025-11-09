"use client";

import * as React from "react";
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

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { generateQuoteImage, type ActionState } from "@/app/actions";

const initialState: ActionState = {
  error: undefined,
  imageId: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ImageIcon className="mr-2 h-4 w-4" />
      )}
      {pending ? "Generating Image..." : "Generate Image"}
    </Button>
  );
}

export function QuoteForm() {
  const [state, formAction] = useActionState(generateQuoteImage, initialState);

  const [inputs, setInputs] = React.useState({
    quote:
      "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
  });

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    if (state.imageId) {
      formRef.current?.reset();
      setInputs({
        quote: "",
        author: "",
      });
    }
  }, [state]); 

  const imageUrl = state.imageId ? `/api/og?id=${state.imageId}` : null;

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
      
      {/* 8. The <form> now uses the 'action' prop */}
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
          {/* Quote Textarea */}
          <div className="space-y-2">
            <Label htmlFor="quote">Quote</Label>
            <Textarea
              id="quote"
              name="quote"
              placeholder="Enter your quote..."
              value={inputs.quote} 
              onChange={handleChange} 
              rows={4}
              maxLength={280}
              required
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground text-right">
              {inputs.quote.length} / 280
            </p>
          </div>

          {/* Author Input */}
          <div className="space-y-2">
            <Label htmlFor="author">Author / Source (Optional)</Label>
            <Input
              id="author"
              name="author"
              placeholder="e.g., Nelson Mandela or @username"
              value={inputs.author}
              onChange={handleChange} 
              maxLength={50}
            />
          </div>

          {/* 9. Error Alert reads from the action state */}
          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-stretch space-y-4">
          <SubmitButton />
        </CardFooter>
      </form>

      {/* This section only appears *after* the image is generated */}
      {imageUrl && (
        <CardFooter className="flex flex-col items-stretch space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-center">Your Image</h3>
          
          <div className="rounded-lg border bg-muted/30 overflow-hidden">
            <img
              src={imageUrl}
              alt="Generated quote"
              className="w-full h-auto aspect-video object-cover"
              key={state.imageId}
            />
          </div>

          <Button asChild variant="secondary">
            <a href={imageUrl} download="quote.png">
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}