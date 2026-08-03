import {
  Coffee,
  Shirt,
  Smartphone,
  Store,
  ShoppingCart,
  Utensils,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function SolutionsPage() {
  const solutions = [
    {
      icon: Utensils,
      title: "Restaurants",
      description:
        "Manage menus, meals, drinks and customer orders with an AI-generated POS tailored for restaurants.",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      icon: Coffee,
      title: "Coffee Shops",
      description:
        "Create a fast and simple POS for beverages, snacks and daily operations.",
      gradient: "from-amber-500 to-yellow-500",
      bgGradient: "from-amber-50 to-yellow-50",
    },
    {
      icon: Shirt,
      title: "Fashion Stores",
      description:
        "Handle sizes, colors, pricing and inventory categories for clothing businesses.",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
    },
    {
      icon: Smartphone,
      title: "Electronics Stores",
      description:
        "Manage products with specifications, accessories and advanced categorization.",
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-50 to-blue-50",
    },
    {
      icon: ShoppingCart,
      title: "Retail Businesses",
      description:
        "Generate complete retail POS systems with products, categories and analytics.",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      icon: Store,
      title: "Small Businesses",
      description:
        "Launch a professional POS without technical expertise using natural language.",
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "AI-Powered Setup",
      description:
        "Generate an entire business-ready POS in seconds without manual configuration.",
    },
    {
      icon: TrendingUp,
      title: "Adaptable Structure",
      description:
        "Products, categories and workflows automatically adapt to the type of business you operate.",
    },
    {
      icon: Users,
      title: "Business Growth",
      description:
        "Manage employees, analyze sales and streamline operations from a single platform.",
    },
  ];

  const stats = [
    { value: "50+", label: "Industries Supported" },
    { value: "10,000+", label: "Businesses Transformed" },
    { value: "99.9%", label: "Satisfaction Rate" },
    { value: "4.9/5", label: "Average Rating" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 text-center overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-violet-200/20 to-pink-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 text-sm font-medium shadow-sm ring-1 ring-violet-200/50">
            <Store className="w-4 h-4" />
            <span>Industry Solutions</span>
          </div>

          <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Built For Every
            <span className="block bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Type Of Business
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            AutoPOS adapts automatically to your business. Simply describe what
            you sell and our AI will generate a complete point of sale system
            tailored to your industry.
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
              href="/features"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-gray-700 font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 ring-1 ring-gray-200"
            >
              Explore Features
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>AI-powered generation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Industry-specific templates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;

            return (
              <div
                key={solution.title}
                className="group relative bg-white rounded-2xl border border-gray-200/80 p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${solution.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Decorative Pattern */}
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br from-violet-200/10 to-indigo-200/10 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative">
                  <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center shadow-lg shadow-${solution.gradient.split(' ')[0]}/20 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-gray-900 group-hover:text-violet-700 transition-colors duration-200">
                    {solution.title}
                  </h3>

                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {solution.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      href={`/solutions/${solution.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-800"
                    >
                      Learn More
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why AutoPOS - Benefits Section */}
      <section className="relative bg-white border-y border-gray-200/80 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-purple-100/30 to-pink-100/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-28">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              One Platform, Multiple Industries
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
              Why Businesses Choose AutoPOS
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover how AutoPOS adapts to your specific industry needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-gray-200/50 hover:border-violet-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
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
          {stats.map((stat, index) => (
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

      {/* Industry Showcase */}
      <section className="bg-gradient-to-br from-violet-50 to-indigo-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-violet-700 text-sm font-medium shadow-sm">
              <Award className="w-4 h-4" />
              Trusted Across Industries
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              Every Business, One Solution
            </h2>
            <p className="mt-4 text-gray-600">
              From restaurants to retail, AutoPOS provides the perfect POS solution for your industry.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              "Restaurants",
              "Coffee Shops",
              "Fashion Stores",
              "Electronics",
              "Retail",
              "Small Business",
              "Hotels",
              "Services",
            ].map((industry) => (
              <div
                key={industry}
                className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 text-center text-sm font-medium text-gray-700 border border-white/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
              >
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-5xl mx-auto px-6 py-28">
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-12 md:p-16 text-center overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          {/* Pattern Dots */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full" />
            <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full" />
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-white rounded-full" />
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-white rounded-full" />
          </div>

          <div className="relative">
            <span className="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm">
              🚀 Transform Your Business
            </span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
              Ready To Transform Your Business?
            </h2>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Let AutoPOS generate a complete point of sale system designed
              specifically for your industry. Start your free trial today.
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