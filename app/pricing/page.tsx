import { Check, Sparkles, ArrowRight, Zap, Shield, Users, Award } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description:
        "Perfect for students, personal projects and small businesses.",
      features: [
        "AI POS Generation",
        "POS Management",
        "Basic Analytics",
        "Receipt Generation",
        "1 POS System",
        "Email Support",
      ],
      featured: false,
      buttonText: "Get Started Free",
      buttonLink: "/sign-up",
    },
    {
      name: "Professional",
      price: "29TND",
      period: "/month",
      description:
        "Designed for growing businesses that need advanced management tools.",
      features: [
        "Unlimited POS Systems",
        "Advanced Analytics",
        "Cashier Management",
        "Real-time Notifications",
        "AI POS Editing",
        "Priority Support",
      ],
      featured: true,
      buttonText: "Join Waitlist",
      buttonLink: "/waitlist",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description:
        "Advanced solutions for organizations with multiple locations.",
      features: [
        "Multi-Store Management",
        "Custom Integrations",
        "Advanced Security",
        "Dedicated Support Team",
        "Scalable Infrastructure",
        "Custom Feature Development",
      ],
      featured: false,
      buttonText: "Contact Sales",
      buttonLink: "/contact",
    },
  ];

  const faqs = [
    {
      question: "Is AutoPOS free to use?",
      answer:
        "Yes. AutoPOS is currently available free of charge for testing, demonstrations and early adopters. Our Starter plan remains free forever with core features included.",
    },
    {
      question: "Can I create multiple POS systems?",
      answer:
        "Yes. AutoPOS allows businesses to generate and manage multiple POS configurations based on their needs. The Starter plan includes 1 POS system, while Professional and Enterprise plans offer unlimited systems.",
    },
    {
      question: "Does AutoPOS use AI?",
      answer:
        "Yes. AutoPOS uses Google Gemini AI to generate and modify POS systems using natural language. This allows you to create and customize your POS without any technical expertise.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards and bank transfers. Enterprise customers can also arrange for invoice-based billing.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer:
        "Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
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
            <span>Pricing Plans</span>
          </div>

          <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Simple &
            <span className="block bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Transparent Pricing
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            AutoPOS is currently available for free while we continue building
            the next generation of AI-powered business management tools.
          </p>

          {/* Toggle Label */}
          <div className="mt-10 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm">
            <span className="text-sm font-medium text-violet-600">Free Forever</span>
            <span className="w-px h-6 bg-gray-300" />
            <span className="text-sm text-gray-500">No credit card required</span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative rounded-3xl border p-8 transition-all duration-300
                ${
                  plan.featured
                    ? "border-violet-500 bg-white shadow-2xl shadow-violet-500/20 scale-105 ring-2 ring-violet-500/20"
                    : "border-gray-200/80 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1"
                }
              `}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-violet-500/30">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mt-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-500 text-sm font-medium ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Features List */}
              <div className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 group"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-500/20">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-10">
                <Link
                  href={plan.buttonLink}
                  className={`
                    w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all duration-300
                    ${
                      plan.featured
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }
                  `}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Badge */}
              {plan.featured && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3.5 h-3.5" />
                  <span>14-day free trial</span>
                  <span className="w-px h-3 bg-gray-300" />
                  <span>Cancel anytime</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features Highlight */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "Free Forever Plan",
              description: "Access core features with our Starter plan at no cost",
            },
            {
              icon: Users,
              title: "Flexible Scaling",
              description: "Upgrade or downgrade anytime as your business grows",
            },
            {
              icon: Award,
              title: "Early Adopter Benefits",
              description: "Lock in special pricing for being an early user",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group p-6 rounded-2xl bg-white border border-gray-200/50 shadow-sm hover:shadow-lg hover:border-violet-200/50 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-violet-700 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative bg-white border-y border-gray-200/80 py-24">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-100/30 to-purple-100/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              FAQ
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to know about AutoPOS pricing and plans
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-gray-200/50 p-6 hover:shadow-md hover:border-violet-200/50 transition-all duration-300"
              >
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-violet-700 transition-colors duration-200">
                  {faq.question}
                </h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-5xl mx-auto px-6 py-28">
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 p-12 md:p-16 text-center overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          {/* Decorative Dots */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-2 h-2 bg-white rounded-full" />
            <div className="absolute top-8 right-8 w-2 h-2 bg-white rounded-full" />
            <div className="absolute bottom-8 left-8 w-2 h-2 bg-white rounded-full" />
            <div className="absolute bottom-8 right-8 w-2 h-2 bg-white rounded-full" />
          </div>

          <div className="relative">
            <span className="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm">
              🚀 Start Building Today
            </span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
              Ready To Launch Your POS?
            </h2>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Join thousands of businesses already using AutoPOS. Start with our
              free plan and upgrade as you grow.
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
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-all duration-300 ring-1 ring-white/30"
              >
                Talk to Sales
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-white/80">
              <span>✓ No credit card required</span>
              <span>✓ Free forever plan</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}