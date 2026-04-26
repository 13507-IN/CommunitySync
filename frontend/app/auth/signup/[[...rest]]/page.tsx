"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/auth/profile-setup");
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-swiss-bg font-swiss flex selection:bg-swiss-red selection:text-swiss-bg overflow-hidden relative items-center justify-center">
      {/* Background Texture */}
      <div className="absolute inset-0 swiss-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 swiss-dots opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[50vw] h-full bg-swiss-fg swiss-diagonal opacity-[0.02] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        <SignUp
          path="/auth/signup"
          routing="path"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-swiss-bg border border-swiss-fg",
              formButtonPrimary: "bg-swiss-red hover:bg-swiss-red/90",
              headerTitle: "text-swiss-fg",
              headerSubtitle: "text-swiss-fg/60",
              socialButtonsBlockButton: "border border-swiss-fg/30 hover:bg-swiss-fg/5",
              formFieldInput: "bg-white border border-swiss-fg/20",
              footerActionLink: "text-swiss-red hover:text-swiss-red/90",
            },
          }}
          signInUrl="/auth/login"
        />
      </div>
    </div>
  );
}
