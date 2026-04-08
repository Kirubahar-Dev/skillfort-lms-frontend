import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden py-32 min-h-[600px]">
      {/* Enhanced Animated Background */}
      <div className="blob blob-1 scale-150" />
      <div className="blob blob-2 scale-150" />

      {/* Additional gradient overlay */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent via-purple-50/20 to-blue-50/20 dark:via-purple-950/10 dark:to-blue-950/10 -z-5" />

      <div className="page-wrap relative z-10">
        <div className="grid gap-16 items-center lg:grid-cols-2">
          {/* Left Content - Enhanced */}
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-sf-gold/20 to-orange-300/20 border border-sf-gold/40 hover:border-sf-gold/60 transition-all">
                <span className="text-3xl animate-bounce">🚀</span>
                <span className="text-sm font-bold text-sf-gold dark:text-yellow-400">Welcome to SkillFort</span>
              </div>

              {/* Enhanced Title with better gradient */}
              <h1 className="text-6xl md:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-sf-ink via-sf-gold to-purple-600 dark:from-white dark:via-yellow-400 dark:to-purple-300 bg-clip-text text-transparent">
                  Master Skills.
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-sf-ink dark:from-purple-300 dark:via-pink-300 dark:to-white bg-clip-text text-transparent">
                  Build Future.
                </span>
              </h1>

              {/* Enhanced Description */}
              <p className="text-xl text-sf-muted dark:text-gray-300 max-w-2xl leading-relaxed">
                Learn from industry experts, earn recognized certificates, and <span className="font-bold text-sf-ink dark:text-white">accelerate your career</span> with our comprehensive online courses.
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/courses"
                className="btn-primary px-8 py-4 text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Explore Courses →
              </Link>
              <Link
                to="/signup?role=student"
                className="btn-secondary px-8 py-4 text-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Get Started Free
              </Link>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t-2 border-gray-200 dark:border-gray-700">
              <div className="space-y-2 hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-sf-gold to-orange-400 bg-clip-text text-transparent">500+</div>
                <div className="text-sm font-semibold text-sf-muted dark:text-gray-400">Courses</div>
              </div>
              <div className="space-y-2 hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">50K+</div>
                <div className="text-sm font-semibold text-sf-muted dark:text-gray-400">Students</div>
              </div>
              <div className="space-y-2 hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">95%</div>
                <div className="text-sm font-semibold text-sf-muted dark:text-gray-400">Success</div>
              </div>
            </div>
          </div>

          {/* Right Illustration - Much Enhanced 3D */}
          <div className="relative h-full min-h-[500px] hidden lg:flex items-center justify-center perspective">
            {/* Larger Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/30 via-pink-400/20 to-blue-500/30 blur-3xl animate-pulse" />
            </div>

            {/* Floating Cards - Enhanced with better 3D */}
            <div className="absolute top-0 right-0 float animate-bounce" style={{animationDuration: '4s'}}>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white shadow-2xl w-56 h-48 flex flex-col justify-between hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 border border-blue-300/50">
                <div className="text-5xl">📚</div>
                <div className="text-lg font-bold">Learn Anywhere</div>
              </div>
            </div>

            <div className="absolute top-1/3 left-8 float-delay-1 animate-bounce" style={{animationDuration: '5s'}}>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 text-white shadow-2xl w-56 h-48 flex flex-col justify-between hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 border border-purple-300/50">
                <div className="text-5xl">🏆</div>
                <div className="text-lg font-bold">Get Certified</div>
              </div>
            </div>

            <div className="absolute bottom-12 right-12 float-delay-2 animate-bounce" style={{animationDuration: '6s'}}>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-400 via-pink-500 to-rose-600 text-white shadow-2xl w-56 h-48 flex flex-col justify-between hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 border border-pink-300/50">
                <div className="text-5xl">💡</div>
                <div className="text-lg font-bold">Expert Teachers</div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full border-2 border-sf-gold/20 animate-spin" style={{animationDuration: '20s'}} />
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 rounded-full border-2 border-purple-400/20 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}} />
          </div>
        </div>
      </div>
    </div>
  );
}
