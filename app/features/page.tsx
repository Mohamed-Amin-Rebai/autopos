import {
  Sparkles,
  MessageSquare,
  Users,
  Receipt,
  Bell,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Rocket,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI POS Generation",
      description:
        "Generate complete Point of Sale systems from natural language prompts using AI.",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: MessageSquare,
      title: "Conversational Editing",
      description:
        "Modify products, categories, pricing and configurations through an intelligent chat experience.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Cashier Management",
      description:
        "Request and manage cashier accounts with dedicated access and shift scheduling.",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Receipt,
      title: "Receipt Generation",
      description:
        "Automatically generate professional receipts after each completed transaction.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Bell,
      title: "Notifications",
      description:
        "Stay informed with real-time updates about approvals, requests and important business events.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description:
        "Track revenue, orders, top-selling products and cashier performance from one dashboard.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Role-Based Security",
      description:
        "Secure access using Manager, Admin and Cashier roles powered by Clerk authentication.",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Fast & Scalable",
      description:
        "Built with Next.js, MongoDB and modern cloud technologies for speed and reliability.",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  const benefits = [
    {
      icon: Rocket,
      title: "Faster Setup",
      description:
        "Generate an entire POS system in seconds instead of spending hours configuring products and categories manually.",
    },
    {
      icon: MessageSquare,
      title: "AI-Powered Flexibility",
      description:
        "Continuously evolve your business setup through natural language commands without touching technical configurations.",
    },
    {
      icon: TrendingUp,
      title: "Business Insights",
      description:
        "Access analytics and operational insights to make informed decisions and improve performance.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 text-center overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-violet-200/30 to-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 text-sm font-medium shadow-sm ring-1 ring-violet-200/50">
            <Sparkles className="w-4 h-4" />
            <span>AutoPOS Features</span>
          </div>

          <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Everything You Need To Run
            <span className="block bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              An Intelligent POS
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            AutoPOS combines artificial intelligence, analytics, cashier
            management and modern business tools into one complete platform.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-gray-700 font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 ring-1 ring-gray-200"
            >
              Learn More
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl border border-gray-200/80 p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-200/50"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600/0 via-violet-600/0 to-indigo-600/0 group-hover:from-violet-600/5 group-hover:via-violet-600/5 group-hover:to-indigo-600/5 transition-all duration-300" />

                <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg shadow-${feature.gradient.split(' ')[0]}/20 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900 group-hover:text-violet-700 transition-colors duration-200">
                  {feature.title}
                </h3>

                <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
      </section>

      {/* How AutoPOS Helps - Benefits Section */}
      <section className="relative bg-white border-y border-gray-200/80 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-28">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Why AutoPOS
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
              Why Businesses Choose AutoPOS
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover how AutoPOS transforms your business operations with AI-powered intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-gray-200/50 hover:border-violet-200/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-violet-600" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-violet-700 transition-colors duration-200">
                        {benefit.title}
                      </h3>
                      <div className="mt-1 w-12 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full group-hover:w-16 transition-all duration-300" />
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              10x
            </div>
            <p className="mt-2 text-sm text-gray-600">Faster Setup Time</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              99.9%
            </div>
            <p className="mt-2 text-sm text-gray-600">Uptime Guarantee</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              24/7
            </div>
            <p className="mt-2 text-sm text-gray-600">AI Support Available</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              1000+
            </div>
            <p className="mt-2 text-sm text-gray-600">Businesses Trust Us</p>
          </div>
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

          <div className="relative">
            <span className="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm">
              🚀 Get Started Today
            </span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
              Ready To Build Your POS?
            </h2>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Generate, customize and manage your business with the power of AI.
              Start your free trial today.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-violet-700 font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-all duration-300 ring-1 ring-white/30"
              >
                Contact Sales
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/80">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}