"use client";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">
          © {new Date().getFullYear()} StarByte Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
