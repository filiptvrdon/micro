import { Button } from "@/components/ui/button.tsx";
import { NavLink } from "react-router-dom";
import { CheckCircle2, Zap, Shield, Users, Trophy, BookOpen } from "lucide-react";
import { useAuth } from "@/providers/auth-provider.tsx";
import { ThemeToggle } from "@/components/theme-toggle.tsx";

export function HomePage() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Landing Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-6 px-6">
        <NavLink to="/">
          <h1 className="text-2xl font-bold tracking-tight">FINITE.</h1>
        </NavLink>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {session ? (
            <Button asChild variant="outline" size="sm">
              <NavLink to="/feed">Go to Feed</NavLink>
            </Button>
          ) : (
            <Button asChild variant="default" size="sm">
              <NavLink to="/login">Login</NavLink>
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-2xl px-6 pt-16 pb-12 text-center">
        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
          Train. Log it. Leave.
        </h2>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          Finite social network optimized for real world impact.
          <br />
          Life is finite. Don't waste it on screens.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {!session && (
            <Button asChild size="lg" className="px-8">
              <NavLink to="/login">Get Started</NavLink>
            </Button>
          )}
          <Button asChild variant="outline" size="lg" className="px-8">
            <a href="#philosophy">Our Philosophy</a>
          </Button>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="w-full max-w-4xl px-6 py-24 border-t border-border/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Reintroducing boundaries</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Infinite feeds produce disposable thoughts. Finite spaces produce considered ones.
          </p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4 flex flex-col items-center text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Signal Density</h3>
            <p className="text-muted-foreground leading-relaxed">
              **FINITE.** consumption by design. A feed you can complete.
              No algorithmic manipulation, no endless spray, just intentional curation.
            </p>
          </div>
          <div className="space-y-4 flex flex-col items-center text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Conversations that persist</h3>
            <p className="text-muted-foreground leading-relaxed">
              If it mattered, it should still be there tomorrow. Content designed to be revisited,
              not discarded in a race for engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full bg-muted/30 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureItem
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Completion"
              description="A feed you can complete. Reach the end and then log off. No infinite scroll loops."
            />
            <FeatureItem
              icon={<Zap className="h-5 w-5" />}
              title="Signal Density"
              description="High intentionality, high reflection per minute. Designed to be revisited."
            />
            <FeatureItem
              icon={<BookOpen className="h-5 w-5" />}
              title="Retention of Ideas"
              description="If it mattered, it should still be there tomorrow. Conversations that persist."
            />
            <FeatureItem
              icon={<Shield className="h-5 w-5" />}
              title="Daily Boundaries"
              description="Calm. Principled. Confident. Reintroducing boundaries to your digital life."
            />
            <FeatureItem
              icon={<Users className="h-5 w-5" />}
              title="Real World Impact"
              description="Optimized for documenting, witnessing, and accountability in the real world."
            />
            <FeatureItem
              icon={<Trophy className="h-5 w-5" />}
              title="No Outrage Required"
              description="No algorithmic spray, no dark patterns, and no performative flexing."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-2xl px-6 py-32 text-center">
        <h2 className="text-4xl font-bold mb-8 italic">"Life is finite. Don't waste it on screens."</h2>
        {!session ? (
          <div className="space-y-6">
            <p className="text-muted-foreground mb-8 text-lg">
              Join a community that values your effort more than your attention.
            </p>
            <Button asChild size="lg" className="px-12 h-14 text-lg">
              <NavLink to="/login">Start your journal</NavLink>
            </Button>
          </div>
        ) : (
          <Button asChild size="lg" variant="outline" className="px-12 h-14 text-lg">
            <NavLink to="/feed">Continue Training</NavLink>
          </Button>
        )}
      </section>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-border/50 text-center">
        <div className="text-xs tracking-widest uppercase opacity-30 pointer-events-none">
          FINITE.
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-3 flex flex-col items-center text-center">
      <div className="text-primary flex justify-center">
        {icon}
      </div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
