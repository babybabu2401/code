import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Code2, Sparkles, Zap } from "lucide-react";
import { SignedIn } from "@clerk/nextjs";

import RunButton from "./RunButton";
import HeaderProfileBtn from "./HeaderProfileBtn";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";

async function Header() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const user = await currentUser();

  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/98 to-gray-900/95 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-3 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-1">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  SyntaxForge
                </h1>
                <p className="text-xs text-gray-400 font-medium">
                  Modern Code Editor
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center">
              <Link
                href="/snippets"
                className="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-200"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Code2 className="w-4 h-4 relative z-10" />
                <span className="text-sm font-medium relative z-10">Snippets</span>
              </Link>
            </nav>
          </div>

          {/* Controls Section */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <ThemeSelector />
              <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
            </div>

            {!convexUser?.isPro && (
              <Link
                href="/pricing"
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Pro</span>
              </Link>
            )}

            <SignedIn>
              <RunButton />
            </SignedIn>

            <div className="h-8 w-px bg-gray-700" />
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;