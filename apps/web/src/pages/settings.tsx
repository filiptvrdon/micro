import { HankoProfile } from "@/features/auth/components/hanko-profile.tsx";
import { useFont, type Font } from "@/providers/font-provider.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";

export function SettingsPage() {
  const { font, setFont } = useFont();

  const fonts: { id: Font; name: string; class: string }[] = [
    { id: "jetbrains-mono", name: "JetBrains Mono", class: "font-jetbrains-mono" },
    { id: "geist-sans", name: "Geist Sans", class: "font-geist-sans" },
    { id: "geist-mono", name: "Geist Mono", class: "font-geist-mono" },
    { id: "inter", name: "Inter", class: "font-inter" },
    { id: "ibm-plex-sans", name: "IBM Plex Sans", class: "font-ibm-plex-sans" },
    { id: "ibm-plex-mono", name: "IBM Plex Mono", class: "font-ibm-plex-mono" },
    { id: "plus-jakarta-sans", name: "Plus Jakarta Sans", class: "font-plus-jakarta-sans" },
    { id: "manrope", name: "Manrope", class: "font-manrope" },
    { id: "space-grotesk", name: "Space Grotesk", class: "font-space-grotesk" },
    { id: "archivo", name: "Archivo", class: "font-archivo" },
  ];

  return (
    <div className="py-6 space-y-8 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Choose the font that suits your style.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fonts.map((f) => (
              <Button
                key={f.id}
                variant={font === f.id ? "default" : "outline"}
                className={cn(
                  "justify-start h-12 px-4",
                  f.class,
                  font === f.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                )}
                onClick={() => setFont(f.id)}
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">{f.name}</span>
                  <span className="text-[10px] opacity-70">The quick brown fox</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account settings and authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HankoProfile />
        </CardContent>
      </Card>
    </div>
  );
}
