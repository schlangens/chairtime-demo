import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChairTime — find & book a barber (Demo)",
  description:
    "ChairTime — a demo booking marketplace for barbers: discover providers near you, book a time slot, manage appointments, and a provider dashboard with free-trial-to-yearly subscriptions. Mock data, Stripe test mode.",
  openGraph: { title: "ChairTime — find & book a barber (Demo)", description: "A mobile-first booking marketplace with provider subscriptions." },
};

const jsonLd = { "@context": "https://schema.org", "@type": "WebApplication", name: "ChairTime",
  applicationCategory: "LifestyleApplication", description: "Find and book a barber near you.", url: "https://chairtime-demo.vercel.app" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
