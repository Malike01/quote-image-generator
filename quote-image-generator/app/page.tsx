import { ModeToggle } from "@/components/mode-toggle";
import { QuoteForm } from "@/components/QuoteForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <QuoteForm />
    </main>
  );
}