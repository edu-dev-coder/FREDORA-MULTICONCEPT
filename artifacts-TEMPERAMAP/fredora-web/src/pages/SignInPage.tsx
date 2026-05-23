import { SignIn } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-[#1e4580] to-[#0f2549] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">F</span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-xl leading-none">Fredora</p>
              <p className="text-accent text-xs font-semibold tracking-widest leading-none">TEMPERA MAP</p>
            </div>
          </div>
        </div>
        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          signUpUrl={`${basePath}/sign-up`}
          fallbackRedirectUrl={`${basePath}/dashboard`}
        />
      </div>
    </div>
  );
}
