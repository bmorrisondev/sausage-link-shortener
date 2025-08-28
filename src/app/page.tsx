import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee, Sparkles, Link as LinkIcon, QrCode, ChartBar, Copy, Egg } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background-oats">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center max-w-6xl mx-auto">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Sausage Link Shortener
                  </h1>
                  <p className="text-xl text-foreground-base">
                    A deliciously different way to share links with fun emoji slugs
                  </p>
                </div>
                <p className="text-foreground-light">
                  Every short link comes with 12 breakfast-themed emojis instead of boring IDs.
                  Free to use, easy to share, and absolutely delightful!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href="/sign-in" 
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md p-4 rounded-2xl bg-background-toast shadow-lg">
                  <div className="p-4 rounded-xl bg-background-oats">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-accent-strawberry rounded-full w-3 h-3"></div>
                      <div className="bg-accent-yolk rounded-full w-3 h-3"></div>
                      <div className="bg-accent-avocado rounded-full w-3 h-3"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-sm">sausage.link/l/🥓🍳🥞🧇🍞🥐🥯🧀🍖🥚🍳🥓</div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-foreground-light">
                        <span className="font-medium">Original URL:</span> https://example.com/very-long-url-that-needs-shortening
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background-oats">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Features that Sizzle
                </h2>
                <p className="text-foreground-base max-w-[700px] mx-auto">
                  Our breakfast-themed link shortener comes packed with all the ingredients you need
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <Card className="bg-background-oats">
                <CardHeader className="flex flex-col items-center">
                  <Egg className="h-10 w-10 text-accent-yolk mb-2" />
                  <CardTitle>Emoji Slugs</CardTitle>
                  <CardDescription>
                    Every link gets a unique 12-emoji combination that&apos;s fun and memorable
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-light">
                    Say goodbye to boring alphanumeric codes and hello to breakfast emojis that bring a smile
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background-oats">
                <CardHeader className="flex flex-col items-center">
                  <Coffee className="h-10 w-10 text-accent-strawberry mb-2" />
                  <CardTitle>Chat Interface</CardTitle>
                  <CardDescription>
                    Simply paste your link and get a shortened version through our friendly chat interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-light">
                    No complicated forms or settings - just chat naturally to create and manage your links
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background-oats">
                <CardHeader className="flex flex-col items-center">
                  <Coffee className="h-10 w-10 text-background-latte mb-2" />
                  <CardTitle>100% Free</CardTitle>
                  <CardDescription>
                    Create as many links as you need without any cost or hidden fees
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-light">
                    Enjoy unlimited link creation and sharing without spending a dime
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background-oats">
                <CardHeader className="flex flex-col items-center">
                  <QrCode className="h-10 w-10 text-foreground-dark mb-2" />
                  <CardTitle>QR Codes</CardTitle>
                  <CardDescription>
                    Every shortened link comes with a downloadable QR code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-light">
                    Perfect for print materials, business cards, or sharing in the physical world
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background-oats">
                <CardHeader className="flex flex-col items-center">
                  <LinkIcon className="h-10 w-10 text-accent-avocado mb-2" />
                  <CardTitle>Link Management</CardTitle>
                  <CardDescription>
                    Easily manage all your shortened links in one place
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-light">
                    View, organize, and track all your links from a simple dashboard
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background-oats">
                <CardHeader className="flex flex-col items-center">
                  <ChartBar className="h-10 w-10 text-accent-yolk mb-2" />
                  <CardTitle>Click Analytics</CardTitle>
                  <CardDescription>
                    Track how many times your links have been clicked
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground-light">
                    Get insights into link performance with simple analytics
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Sign Up Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background-oats">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Start Shortening Today
                </h2>
                <p className="text-foreground-base max-w-[700px] mx-auto">
                  Join thousands of users who are already enjoying our delicious link shortener
                </p>
              </div>
              <div className="mx-auto max-w-sm space-y-4">
                <Button asChild size="lg" className="w-full">
                  <Link href="/chat">
                    Sizzle your shortlinks <Sparkles className="ml-2" />
                  </Link>
                </Button>
                <p className="text-xs text-foreground-light">
                  No credit card required. Free forever.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-background-latte">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-foreground-dark">
                © 2025 Sausage Link Shortener. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/" className="text-sm text-foreground-dark hover:underline">
                Terms
              </Link>
              <Link href="/" className="text-sm text-foreground-dark hover:underline">
                Privacy
              </Link>
              <Link href="/" className="text-sm text-foreground-dark hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
