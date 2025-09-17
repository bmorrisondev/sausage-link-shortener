import { Button } from '@/components/ui/button';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
      <header className="w-full py-4 bg-background-toast border-b border-background-latte sticky top-0 z-10 backdrop-blur-sm">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/sausage-logo.svg" alt="Sausage Link Shortener" width={40} height={40} />
              <span className="font-bold text-xl">Sausage Link</span>
            </Link>
            <div className="flex items-center gap-4">
              <SignedIn>
                <div className="flex items-center gap-4">
                  <Button asChild size="sm">
                    <Link href="/chat">Get Cooking</Link>
                  </Button>
                  <UserButton />
                </div>
              </SignedIn> 
              <SignedOut>
                <Button asChild size="sm">
                  <Link href="/chat">Sign In</Link>
                </Button>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>
      
  );
}
