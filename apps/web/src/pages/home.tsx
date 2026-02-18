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
        <h1 className="text-2xl font-bold tracking-tight">Micro</h1>
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
          Train. Share. Done.
        </h2>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          Deliberate social sharing for athletes and focused communities.
          Share your progress, document your journey, and log off.
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
          <h2 className="text-3xl font-bold mb-4">Social without the casino</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Exploring what social media looks like when engagement is not the primary KPI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Signal over noise</h3>
            <p className="text-muted-foreground leading-relaxed">
              Finite consumption by design. When you reach the end of your chronological feed, you’re done.
              No algorithmic manipulation, no "For You" page, and no suggested posts.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Privacy First</h3>
            <p className="text-muted-foreground leading-relaxed">
              We collect only what’s required to operate. No behavioral profiling, no selling data,
              and no cross-platform tracking. You are not a data product.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full bg-muted/30 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureItem
              icon={<Users className="h-5 w-5" />}
              title="Focused Communities"
              description="Built for athletes, lifters, runners, and climbers who train consistently."
            />
            <FeatureItem
              icon={<Trophy className="h-5 w-5" />}
              title="Depth > Virality"
              description="Encouraging honest updates and training notes over performative flexing."
            />
            <FeatureItem
              icon={<BookOpen className="h-5 w-5" />}
              title="Practice Documentation"
              description="A place to share training footage and reflections without pressure."
            />
            <FeatureItem
              icon={<CheckCircle2 className="h-5 w-5" />}
              title="Anti-Casino Design"
              description="No infinite scroll loops, no autoplay, and clear session boundaries."
            />
            <FeatureItem
              icon={<Shield className="h-5 w-5" />}
              title="No Dark Patterns"
              description="Calm interface designed to respect your time and attention."
            />
            <FeatureItem
              icon={<Zap className="h-5 w-5" />}
              title="Fast & Neutral"
              description="Mobile-first design that recedes to let your photos and videos be the hero."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-2xl px-6 py-32 text-center">
        <h2 className="text-4xl font-bold mb-8 italic">"Progress over performance."</h2>
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
          Micro
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-3">
      <div className="text-primary">
        {icon}
      </div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
