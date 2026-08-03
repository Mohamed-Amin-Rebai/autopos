import {
  Sparkles,
  MessageSquare,
  Settings,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Clock,
  Bot,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Sparkles,
      title: "Describe Your Business",
      description:
        "Simply explain your business in natural language. No technical knowledge required.",
      example:
        "Create a coffee shop POS with drinks, desserts and takeaway options.",
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50",
    },
    {
      icon: Settings,
      title: "AI Generates Your POS",
      description:
        "AI analyzes your request and builds a complete POS structure with products, categories and configurations.",
      example:
        "Products, categories and business data are generated automatically.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      icon: MessageSquare,
      title: "Customize Through Chat",
      description:
        "Modify your POS at any time using conversational commands.",
      example:
        "Add a product Latte • Change coffee price • Remove desserts category",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      icon: Users,
      title: "Manage Your Team",
      description:
        "Create cashier requests, assign shifts and manage employee access securely.",
      example:
        "Manage cashier accounts and monitor daily activities.",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
    },
    {
      icon: TrendingUp,
      title: "Analyze & Grow",
      description:
        "Track revenue, orders and business performance through powerful analytics dashboards.",
      example:
        "View top-selling products and monitor cashier performance.",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate your POS in seconds, not days",
    },
    {
      icon: Bot,
      title: "AI-Powered",
      description: "Powered by AI technology",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security and 99.9% uptime",
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Instant changes through conversational commands",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 text-center overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-violet-200/30 to-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 text-sm font-medium shadow-sm ring-1 ring-violet-200/50">
            <Sparkles className="w-4 h-4" />
            <span>How AutoPOS Works</span>
          </div>

          <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            From Idea To
            <span className="block bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Intelligent POS
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            AutoPOS combines Artificial Intelligence, modern cloud technologies
            and business management tools into a single platform that helps you
            launch and operate your business faster than ever.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300"
            >
              Start Building Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-gray-700 font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 ring-1 ring-gray-200"
            >
              View Solutions
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>No technical skills needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>AI-powered generation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Ready in minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative flex gap-6 group"
              >
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg shadow-${step.gradient.split(' ')[0]}/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>

                  {index < steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-violet-300 to-transparent mt-4" />
                  )}
                </div>

                <div className="pb-8 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold text-transparent bg-gradient-to-r ${step.gradient} bg-clip-text`}>
                      STEP {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="w-6 h-px bg-gray-300" />
                    <span className="text-xs text-gray-400">
                      {index + 1} / {steps.length}
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-bold text-gray-900 group-hover:text-violet-700 transition-colors duration-200">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-gray-600 leading-relaxed max-w-2xl">
                    {step.description}
                  </p>

                  <div className={`mt-4 p-4 rounded-xl bg-gradient-to-r ${step.bgGradient} border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow duration-300`}>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Example:</span>{" "}
                        {step.example}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-5 rounded-2xl bg-white border border-gray-200/50 shadow-sm hover:shadow-lg hover:border-violet-200/50 transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-gray-900 group-hover:text-violet-700 transition-colors duration-200">
                  {feature.title}
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative bg-white border-y border-gray-200/80 overflow-hidden py-24">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
              <LayoutDashboard className="w-4 h-4" />
              Simple Workflow
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
              AutoPOS Workflow
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From idea to selling in just 4 simple steps
            </p>
          </div>

          <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-4 text-center">
            {[
              { icon: Sparkles, label: "Describe Business" },
              { icon: Settings, label: "AI Generates POS" },
              { icon: MessageSquare, label: "Customize Through Chat" },
              { icon: ShoppingBag, label: "Start Selling" },
            ].map((item, index) => (
              <div key={item.label} className="flex items-center">
                <div className="group p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-200/50 hover:border-violet-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-w-[140px]">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-violet-700 transition-colors duration-200">
                    {item.label}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block text-2xl text-violet-400 px-2">
                    →
                  </div>
                )}
                {index < 3 && (
                  <div className="md:hidden text-violet-400 py-2">
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "60s", label: "Average Setup Time" },
            { value: "100%", label: "AI-Generated POS" },
            { value: "24/7", label: "AI Support Available" },
            { value: "50+", label: "Industries Supported" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center group p-6 rounded-2xl hover:bg-white/50 hover:shadow-sm transition-all duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-5xl mx-auto px-6 pb-28">
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 p-12 md:p-16 text-center overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-75" />
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-150" />
          </div>

          <div className="relative">
            <span className="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm">
              🚀 Get Started Today
            </span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
              Build Your POS In Minutes
            </h2>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Let AI do the heavy lifting while you focus on running your business.
              Start your free trial and see the difference.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-violet-700 font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-all duration-300 ring-1 ring-white/30"
              >
                Watch Demo
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-white/80">
              <span>✓ No credit card required</span>
              <span>✓ 14-day free trial</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}