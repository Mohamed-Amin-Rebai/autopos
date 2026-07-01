"use client";

import { useRouter , usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Zap,
  Shield,
  LayoutDashboard,
  BarChart3, 
  ShoppingBag, 
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const isAdmin = useState(false);

  const goToSignup = () => router.push("/sign-up");
  const goToSignin = () => router.push("/sign-in");
  const goToApp = () => router.push("/welcome");
  const goToDashboard = () => router.push("/dashboard");
  const goToAdmin = () => router.push("/admin");

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.6]);

  const features = [
    {
      title: "AI-Powered Generation",
      desc: "Describe your business naturally and get a complete POS system with products, categories, and logic instantly.",
      icon: Sparkles,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Real-Time Editing",
      desc: "Chat with your AI assistant to modify inventory, pricing, or any part of your system dynamically without reloads.",
      icon: Zap,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Analytics Dashboard",
      desc: "Track orders, revenue, and customer insights with clean, powerful dashboards that update in real-time.",
      icon: BarChart3,
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const steps = [
    "Describe your business idea",
    "AI generates your POS system",
    "Customize with AI chat",
    "Launch & start selling",
  ];

  return (
    <main className="min-h-screen bg-white relative overflow-x-hidden">

      {/* 🌟 HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            onClick={goToApp}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80 transition">
              AutoPOS
            </span>
          </div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 text-sm">
            {!isSignedIn ? (
              <>
                <button
                  onClick={goToSignin}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                >
                  Login
                </button>
                <button
                  onClick={goToSignup}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-105"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {/* DASHBOARD */}
                <button
                  onClick={goToDashboard}
                  className={`
                    group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
                    ${pathname?.startsWith("/dashboard")
                      ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <LayoutDashboard size={16} className={`
                    ${pathname?.startsWith("/dashboard") ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}
                  `} />
                  <span>Dashboard</span>
                  {pathname?.startsWith("/dashboard") && (
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full ml-1" />
                  )}
                </button>

                {/* ADMIN - Only show if admin */}
                {isAdmin && (
                  <button
                    onClick={goToAdmin}
                    className={`
                      group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
                      ${pathname?.startsWith("/admin")
                        ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <Shield size={16} className={`
                      ${pathname?.startsWith("/admin") ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}
                    `} />
                    <span>Admin</span>
                    {pathname?.startsWith("/admin") && (
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full ml-1" />
                    )}
                  </button>
                )}

                {/* DIVIDER */}
                <div className="w-px h-8 bg-gray-200 mx-1" />

                {/* USER */}
                <div className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition">
                  <UserButton />
                </div>
              </>
            )}
          </div> 
        </div>
      </header>

      {/* 🌟 HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 md:px-6 overflow-hidden">
        
        {/* Background Glows */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-violet-300 rounded-full blur-[140px] opacity-30 z-0"
        />
        <motion.div
          style={{ y: y2, opacity }}
          className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[140px] opacity-30 z-0"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-300 rounded-full blur-[160px] opacity-10 z-0" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-violet-200/50"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered POS Generator
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              Turn Any Idea Into a{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Smart POS System
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-4"
            >
              Describe a business and instantly generate a fully functional POS with
              products, categories, and real business logic powered by AI.
            </motion.p>

            {/* Secondary text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-gray-400 mb-8 text-sm md:text-base"
            >
              ✦ No setup required ✦ Zero coding ✦ Instant results
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={isSignedIn ? goToApp : goToSignup}
                className="group relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-medium shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-600 hover:text-gray-900 transition font-medium px-8 py-4 rounded-full border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all"
              >
                Learn More
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>AI-generated instantly</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Real-time editing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Analytics dashboard</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 PREVIEW IMAGE SECTION */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.01 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10 border border-gray-200/50"
          >
            <img
              src="/landingpage.png"
              alt="AutoPOS Preview"
              className="w-full h-auto object-cover"
            />
            
            {/* Decorative glows */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-violet-400 rounded-full blur-[120px] opacity-20 pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-400 rounded-full blur-[120px] opacity-20 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* 🌟 FEATURES SECTION */}
      <section id="features" className="py-20 md:py-32 px-4 md:px-6 relative">
        <div className="max-w-6xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-semibold text-violet-600 bg-violet-50 px-4 py-1 rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything You Need to Build a Smart POS
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              From AI generation to real-time analytics — build and scale your business
              with tools designed for modern commerce.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />
                <div className="relative bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:border-gray-200 transition-all h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg shadow-${feature.gradient.split(' ')[1]?.replace('to-', '')}/25`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌟 HOW IT WORKS */}
      <section className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              From Idea to POS in Minutes
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-3 text-lg shadow-lg shadow-violet-500/25">
                  {i + 1}
                </div>
                <p className="text-gray-700 font-medium text-sm">
                  {step}
                </p>
                {i < steps.length && (
                  <div className="hidden md:block w-8 h-0.5 bg-gradient-to-r from-violet-300 to-indigo-300 mx-auto mt-[-26px] ml-[calc(50%+24px)]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌟 FINAL CTA */}
      <section className="py-20 md:py-28 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="absolute top-[-200px] right-[-200px] w-[400px] h-[400px] bg-violet-300 rounded-full blur-[160px] opacity-20" />
        <div className="absolute bottom-[-200px] left-[-200px] w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[160px] opacity-20" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Ready to Build Your{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Smart POS
              </span>
              ?
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of entrepreneurs who transformed their business ideas
              into powerful POS systems in minutes.
            </p>
            <button
              onClick={isSignedIn ? goToApp : goToSignup}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-10 py-4 rounded-full text-lg font-medium shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 🌟 FOOTER */}
      <footer className="py-8 px-4 md:px-6 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div onClick={goToApp} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-gray-700">AutoPOS</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition">Terms</a>
            <a href="#" className="hover:text-gray-900 transition">Support</a>
          </div>
          <span>© {new Date().getFullYear()} AutoPOS. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}