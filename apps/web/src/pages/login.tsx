import { HankoAuth } from "@/features/auth/components/hanko-auth.tsx";
import { useAuth } from "@/providers/auth-provider.tsx";
import { Button } from "@/components/ui/button.tsx";

export function LoginPage() {
  const { loginAsDev } = useAuth();
  const isDev = import.meta.env.DEV;

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
        {isDev && loginAsDev && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Development Mode</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => loginAsDev()}
            >
              Skip Auth (Dev Login)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
