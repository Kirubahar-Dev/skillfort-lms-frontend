export function FeaturesSection() {
  const features = [
    {
      icon: "🎓",
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of real-world experience",
      color: "from-blue-400 to-blue-600",
      lightColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: "📱",
      title: "Learn Anywhere",
      description: "Access courses on desktop, tablet, or mobile anytime, anywhere",
      color: "from-purple-400 to-purple-600",
      lightColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      icon: "🏆",
      title: "Earn Certificates",
      description: "Showcase your achievements with industry-recognized certificates",
      color: "from-yellow-400 to-orange-500",
      lightColor: "bg-yellow-50 dark:bg-yellow-950/20",
    },
    {
      icon: "💼",
      title: "Career Support",
      description: "Get guidance and resources to advance your professional career",
      color: "from-pink-400 to-pink-600",
      lightColor: "bg-pink-50 dark:bg-pink-950/20",
    },
    {
      icon: "🤝",
      title: "Community",
      description: "Connect with thousands of learners and experts worldwide",
      color: "from-green-400 to-emerald-600",
      lightColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: "📊",
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics and insights",
      color: "from-indigo-400 to-indigo-600",
      lightColor: "bg-indigo-50 dark:bg-indigo-950/20",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/20 to-blue-200/20 dark:from-purple-900/10 dark:to-blue-900/10 blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-pink-200/20 to-orange-200/20 dark:from-pink-900/10 dark:to-orange-900/10 blur-3xl -z-10" />

      <div className="page-wrap space-y-16">
        {/* Enhanced Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black">
            <span className="bg-gradient-to-r from-sf-ink via-purple-600 to-pink-600 dark:from-white dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Why Choose SkillFort?
            </span>
          </h2>
          <p className="text-xl text-sf-muted dark:text-gray-300 font-medium">
            Everything you need to succeed in your learning journey
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-3xl border-2 border-transparent transition-all duration-300 hover:scale-105 hover:shadow-2xl ${feature.lightColor} backdrop-blur-sm`}
            >
              {/* Gradient background overlay */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300 -z-10`} />

              <div className="space-y-4 relative z-10">
                {/* Icon with animated background */}
                <div className="relative inline-block">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300 -z-10`} />
                  <div className="text-5xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold text-sf-ink dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}>
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sf-muted dark:text-gray-400 text-base leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Hover border effect */}
              <div className={`absolute inset-0 rounded-3xl border-2 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
