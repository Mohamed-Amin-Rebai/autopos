import {
  Mail,
  MessageSquare,
  MapPin,
  ArrowRight,
  CheckCircle,
  Send,
  User,
  Clock,
  Sparkles,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function ContactPage() {
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
            <MessageSquare className="w-4 h-4" />
            <span>Contact Us</span>
          </div>

          <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Let&apos;s Talk About
            <span className="block bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              AutoPOS
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            Have questions, feedback or ideas? We&apos;d love to hear from you.
            Reach out and let&apos;s build something amazing together.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300"
            >
              Send Message
              <Send className="w-4 h-4" />
            </a>
            <a
              href="mailto:rebaiamin2003@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-gray-700 font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 ring-1 ring-gray-200"
            >
              <Mail className="w-4 h-4" />
              Email Directly
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Response within 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Free consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>No obligation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 pb-24" id="contact-form">
        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* Form */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Send us a message
                </h2>
                <p className="text-sm text-gray-500">
                  We&apos;ll get back to you within 24 hours
                </p>
              </div>
            </div>

            <form className="mt-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  placeholder="Tell us about your project, questions, or ideas..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <p className="mt-1.5 text-xs text-gray-400 text-right">
                  Minimum 10 characters
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3.5 rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>

              <p className="text-xs text-center text-gray-400">
                By submitting, you agree to our Privacy Policy
              </p>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            
            {/* Project Information */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Project Information
                </h2>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100">
                <p className="text-gray-700 leading-relaxed">
                  AutoPOS is an AI-powered SaaS platform that generates,
                  customizes and manages Point of Sale systems using natural
                  language and AI.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 text-center">
                  <p className="text-2xl font-bold text-violet-600">AI</p>
                  <p className="text-xs text-gray-500">Powered</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 text-center">
                  <p className="text-2xl font-bold text-violet-600">100%</p>
                  <p className="text-xs text-gray-500">Cloud-Based</p>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-violet-600" />
                </div>
                Contact Details
              </h3>

              <div className="mt-6 space-y-4">
                <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-violet-50 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Mail className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a 
                      href="mailto:rebaiamin2003@gmail.com"
                      className="text-gray-700 hover:text-violet-600 transition-colors duration-200"
                    >
                      rebaiamin2003@gmail.com
                    </a>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-violet-50 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <MapPin className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <span className="text-gray-700">Tunisia</span>
                  </div>
                </div>

                <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-violet-50 transition-colors duration-200">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Clock className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Response Time</p>
                    <span className="text-gray-700">Within 24 hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Author */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-violet-600" />
                </div>
                About The Author
              </h3>

              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-900">
                  Mohamed Amine Rebai
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Software Engineering Student • Full-Stack Developer • AI Systems Builder
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://github.com/Mohamed-Amin-Rebai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 hover:scale-105 transition-all duration-200 text-sm font-medium text-gray-700"
                >
                  <FaGithub className="w-4 h-4" />
                  GitHub
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 hover:scale-105 transition-all duration-200 text-sm font-medium text-gray-700"
                >
                  <FaLinkedin className="w-4 h-4" />
                  LinkedIn
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 hover:scale-105 transition-all duration-200 text-sm font-medium text-gray-700"
                >
                  <FaTwitter  className="w-4 h-4" />
                  Twitter
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Quick Response Section */}
      <section className="bg-gradient-to-br from-violet-50 to-indigo-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900">
            Get a Quick Response
          </h3>
          <p className="mt-2 text-gray-600">
            Prefer to reach out directly? Send us an email and we&apos;ll respond promptly.
          </p>
          <a
            href="mailto:rebaiamin2003@gmail.com"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-white text-violet-700 font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 border border-gray-200/50"
          >
            <Mail className="w-4 h-4" />
            rebaiamin2003@gmail.com
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-5xl mx-auto px-6 py-24">
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 p-12 md:p-16 text-center overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full" />
            <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full" />
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-white rounded-full" />
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-white rounded-full" />
          </div>

          <div className="relative">
            <span className="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm">
              🚀 Let&apos;s Build Together
            </span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
              Ready To Transform Your Business?
            </h2>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
              Get in touch today and discover how AutoPOS can revolutionize your
              business operations with AI-powered POS solutions.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#contact-form"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-violet-700 font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Send Message Now
                <Send className="w-4 h-4" />
              </a>
              <a
                href="mailto:rebaiamin2003@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-all duration-300 ring-1 ring-white/30"
              >
                <Mail className="w-4 h-4" />
                Email Directly
              </a>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-white/80">
              <span>✓ Free consultation</span>
              <span>✓ No obligation</span>
              <span>✓ Quick response</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}