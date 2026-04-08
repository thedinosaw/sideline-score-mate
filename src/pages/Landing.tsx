import { useNavigate } from 'react-router-dom';
import { Timer, Trophy, ClipboardList, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Timer,
    title: 'Live Match Timer',
    desc: 'Track halves, quarters, and breaks with a tap. Alerts when time is up.',
  },
  {
    icon: Trophy,
    title: 'Instant Scoring',
    desc: 'Record goals, scorers, and assists on the sideline in seconds.',
  },
  {
    icon: ClipboardList,
    title: 'Match History',
    desc: 'Review and edit past matches with full goal timelines.',
  },
  {
    icon: Smartphone,
    title: 'Works Offline',
    desc: 'No signal at the pitch? No problem. Everything saves locally.',
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 sm:py-24 gap-6 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Simple Soccer Scorer
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-md">
            The easiest sideline scoring &amp; timer app for grassroots football coaches.
          </p>

          {/* Store buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </a>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"/></svg>
              Google Play
            </a>
          </div>

          {/* Web entry */}
          <Button
            variant="outline"
            size="lg"
            className="mt-2"
            onClick={() => {
              sessionStorage.setItem('scorer-web-entry', '1');
              navigate('/app');
            }}
          >
            Try it free on the web →
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12 sm:py-16 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
          Everything you need on the sideline
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-lg border bg-card text-card-foreground p-6 flex gap-4 items-start"
            >
              <div className="rounded-md bg-primary/10 p-2.5 shrink-0">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-6 py-6 text-center text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()} Simple Scorer. Built for grassroots coaches.
      </footer>
    </div>
  );
};

export default Landing;
