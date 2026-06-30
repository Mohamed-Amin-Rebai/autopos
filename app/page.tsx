"use client";

import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const goToSignup = () => router.push("/sign-up");
  const goToSignin = () => router.push("/sign-in");
  const goToApp = () => router.push("/app");
  const goToDashboard = () => router.push("/dashboard");

  const { scrollY } = useScroll();
  // ✅ glow movement based on scroll
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -200]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 relative overflow-hidden">

      {/* ✅ HEADER */}
      <header className="flex justify-between items-center px-8 py-4 backdrop-blur-md bg-white/70 border-b sticky top-0 z-50">
        <h1
          onClick={goToApp}
          className="text-xl font-bold cursor-pointer hover:opacity-80 transition"
        >
          AutoPOS
        </h1>

        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <button
                onClick={goToSignin}
                className="text-gray-600 hover:text-black transition"
              >
                Login
              </button>

              <button
                onClick={goToSignup}
                className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 transition"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                onClick={goToDashboard}
                className="text-gray-600 hover:text-black"
              >
                Dashboard
              </button>

              <UserButton />
            </>
          )}
        </div>
      </header>

      {/* ✅ HERO */}
      <section className="relative text-center py-40 px-6 overflow-hidden">

        {/* ✅ BACKGROUND GLOW (INSIDE HERO) */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-purple-400 rounded-full blur-[120px] opacity-30 z-0"
        />

        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-blue-400 rounded-full blur-[120px] opacity-30 z-0"
        />

        {/* ✅ CONTENT (ABOVE GLOW) */}
        <div className="relative z-10">

          {/* TITLE */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Turn Any Idea Into a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Smart POS System
            </span>
          </motion.h2>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gray-600 max-w-xl mx-auto mb-6 text-lg"
          >
            Describe a business and instantly generate a fully functional POS with
            products, categories, and real business logic powered by AI.
          </motion.p>

          {/* SECOND TEXT */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 mb-10"
          >
            No setup. No coding. Instant results.
          </motion.p>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={isSignedIn ? goToApp : goToSignup}
            className="bg-black text-white px-10 py-4 text-lg rounded-lg shadow-md hover:bg-gray-800 transition"
          >
            Get Started
          </motion.button>

        </div>

      </section>

      {/* ✅ PRODUCT PREVIEW IMAGE */}
      <section className="relative py-32 flex justify-center items-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.03 }}
          className="relative w-full max-w-5xl"
        >

          {/* ✅ IMAGE */}
          <img
            src="/landingpage.png"
            alt="AutoPOS Preview"
            className="w-full rounded-xl shadow-2xl border"
          />

          {/* ✅ FLOATING GLOW (LEFT) */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -top-12 -left-12 w-72 h-72 bg-purple-400 rounded-full blur-[120px] opacity-30"
          />

          {/* ✅ FLOATING GLOW (RIGHT) */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -bottom-12 -right-12 w-72 h-72 bg-blue-400 rounded-full blur-[120px] opacity-30"
          />

        </motion.div>

      </section>

      {/* ✅ FEATURES SECTION */}
      <section className="py-32 px-6 max-w-6xl mx-auto relative">

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Everything You Need to Build a Smart POS
        </motion.h3>

        <div className="grid md:grid-cols-3 gap-10">

          {[
            {
              title: "AI-Powered Generation",
              desc: "Instantly create a full POS system using natural language prompts.",
              icon: "🧠",
            },
            {
              title: "Real-Time Editing",
              desc: "Modify your POS dynamically with an AI assistant, no reloads needed.",
              icon: "⚡",
            },
            {
              title: "Analytics Dashboard",
              desc: "Track orders and revenue with clean and powerful dashboards.",
              icon: "📊",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.06 }}
              className="relative p-[1px] rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"
            >
              {/* INNER CARD */}
              <div className="bg-white rounded-xl p-6 h-full shadow-md flex flex-col items-center text-center">

                {/* ICON */}
                <div className="text-4xl mb-4">{feature.icon}</div>

                {/* TITLE */}
                <h4 className="font-semibold text-lg mb-2">
                  {feature.title}
                </h4>

                {/* DESC */}
                <p className="text-gray-600 text-sm">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </main>
  );
}