"use server";

import Link from "next/link";
import { doSearch } from "./actions";

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">CRE Tenant Finder</h1>
        <p className="mt-2 text-muted-foreground">
          Find Google-registered businesses at any commercial address
        </p>
      </div>

      <form action={doSearch} className="flex w-full max-w-md gap-2">
        <input
          type="text"
          name="address"
          placeholder="Enter a commercial address..."
          required
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
        >
          Search
        </button>
      </form>

      <Link href="/history" className="text-sm text-muted-foreground hover:underline">
        View search history
      </Link>
    </main>
  );
}
