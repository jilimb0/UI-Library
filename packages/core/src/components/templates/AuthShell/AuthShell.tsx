import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface OAuthProvider {
  name: 'github' | 'google' | 'gitlab' | string;
  label?: string;
  icon?: ReactNode;
  onClick: () => void;
}

export interface AuthShellProps {
  /** Main title on the auth form (e.g., "Welcome back"). */
  title?: ReactNode;
  /** Subtitle below the title on the form. */
  subtitle?: ReactNode;
  /** App or company logo displayed at the top of the form. */
  logo?: ReactNode;
  /** Main headline for the left branding panel. */
  brandHeadline?: ReactNode;
  /** Description or customer quote in the left branding panel. */
  brandDescription?: ReactNode;
  /** Key feature bullets displayed in the left branding panel. */
  brandFeatures?: string[];
  /** Custom slot replacing or extending the left branding panel content. */
  brandSlot?: ReactNode;
  /** Built-in OAuth buttons to render with standard divider. */
  oauthProviders?: OAuthProvider[];
  /** Form elements (inputs, submit button, links). */
  children: ReactNode;
  /** Bottom footer slot (e.g., "Don't have an account? Sign up"). */
  footer?: ReactNode;
  /** Additional CSS class names. */
  className?: string;
}

function DefaultOAuthIcon({ name }: { name: string }) {
  if (name === 'github') {
    return (
      <svg
        className="w-5 h-5 shrink-0"
        fill="currentColor"
        viewBox="0 0 24 24"
        role="img"
        aria-label="GitHub"
      >
        <title>GitHub</title>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    );
  }
  if (name === 'google') {
    return (
      <svg
        className="w-5 h-5 shrink-0"
        viewBox="0 0 24 24"
        role="img"
        aria-label="Google"
      >
        <title>Google</title>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
    );
  }
  if (name === 'gitlab') {
    return (
      <svg
        className="w-5 h-5 shrink-0"
        viewBox="0 0 24 24"
        fill="#FC6D26"
        role="img"
        aria-label="GitLab"
      >
        <title>GitLab</title>
        <path d="M23.6 9.89l-.92-2.83a.87.87 0 00-1.65-.01l-1.67 5.12H4.64L2.97 7.05a.87.87 0 00-1.65.01L.4 9.89a1.76 1.76 0 00.64 1.97l10.42 7.57a.9.9 0 001.07 0l10.43-7.57a1.76 1.76 0 00.64-1.97z" />
      </svg>
    );
  }
  return null;
}

export function AuthShell({
  title,
  subtitle,
  logo,
  brandHeadline,
  brandDescription,
  brandFeatures = [],
  brandSlot,
  oauthProviders,
  children,
  footer,
  className,
}: AuthShellProps) {
  return (
    <div
      className={cn(
        'ucl-auth-shell min-h-screen w-full flex flex-col lg:flex-row bg-background',
        className
      )}
    >
      {/* Left Branding Panel */}
      <div className="ucl-auth-shell__brand relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[rgba(18,21,31,0.95)] text-white overflow-hidden border-r border-[rgba(108,123,255,0.12)]">
        {/* Glow decor background */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6C7BFF]/20 rounded-full blur-[128px] pointer-events-none" />

        <div className="relative z-10">{logo}</div>

        <div className="relative z-10 max-w-lg my-auto space-y-6">
          {brandSlot ?? (
            <>
              {brandHeadline && (
                <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                  {brandHeadline}
                </h1>
              )}
              {brandDescription && (
                <p className="text-lg text-slate-300 leading-relaxed">
                  {brandDescription}
                </p>
              )}
              {brandFeatures.length > 0 && (
                <ul className="space-y-3 pt-4 text-sm text-slate-200">
                  {brandFeatures.map((feat) => (
                    <li key={feat} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#6C7BFF]/20 text-[#6C7BFF] flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Core Platform. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="ucl-auth-shell__form flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="lg:hidden flex justify-center mb-6">{logo}</div>
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* OAuth Buttons */}
          {oauthProviders && oauthProviders.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {oauthProviders.map((provider) => (
                  <button
                    key={provider.name}
                    type="button"
                    onClick={provider.onClick}
                    className="w-full inline-flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[rgba(108,123,255,0.18)] bg-[rgba(18,21,31,0.5)] hover:bg-[rgba(108,123,255,0.08)] text-foreground text-sm font-medium transition-all duration-150 cursor-pointer shadow-sm"
                  >
                    {provider.icon ?? <DefaultOAuthIcon name={provider.name} />}
                    <span>
                      {provider.label ??
                        `Continue with ${provider.name.charAt(0).toUpperCase() + provider.name.slice(1)}`}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">
                    or continue with email
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Children Form Fields */}
          <div className="space-y-4">{children}</div>

          {/* Footer Link */}
          {footer && (
            <div className="text-center text-sm text-muted-foreground pt-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
