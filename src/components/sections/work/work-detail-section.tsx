"use client";

export function WorkDetailSection({ slug }: { slug: string }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">Work: {slug}</h1>
      <p className="mt-4 text-muted-foreground">
        Coming soon...
      </p>
    </div>
  );
}
