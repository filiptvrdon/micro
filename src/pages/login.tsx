import { HankoAuth } from "@/features/auth/components/hanko-auth";

export function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
            Sign in to Micro
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use your passkey to log in or register
          </p>
        </div>
        <div className="mt-8">
          <HankoAuth />
        </div>
      </div>
    </div>
  );
}
