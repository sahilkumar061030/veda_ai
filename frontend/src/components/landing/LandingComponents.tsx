'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Zap, Brain, FileText, BarChart3, Shield } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              AI-Powered Assessment Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            Create Intelligent
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Question Papers
            </span>
            <br />
            in Seconds
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            VedaAI uses advanced artificial intelligence to generate structured, exam-ready
            question papers tailored to your curriculum. Save hours of work with a single click.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" className="text-base px-8 shadow-2xl shadow-indigo-500/30">
                Start Creating Free
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-base px-8 border-gray-500 text-gray-200 hover:bg-white/5">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '10K+', label: 'Papers Generated' },
              { value: '500+', label: 'Teachers' },
              { value: '98%', label: 'Accuracy' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface dark:from-gray-950 to-transparent" />
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Generation',
      description: 'Advanced AI creates well-structured questions across multiple difficulty levels and types.',
      color: 'from-indigo-500 to-violet-500',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Generate complete examination papers in seconds. Real-time progress tracking via WebSockets.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: FileText,
      title: 'Print-Ready PDFs',
      description: 'Export professionally formatted question papers ready for printing and distribution.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Track assignment history, monitor generation stats, and optimize your workflow.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Difficulty Control',
      description: 'Fine-tune the easy, medium, and hard question distribution to match your needs.',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'Multiple Question Types',
      description: 'Support for MCQ, Short Answer, Long Answer, and True/False question formats.',
      color: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <section className="py-24 bg-surface dark:bg-gray-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">Features</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Everything you need to create
            <br />
            <span className="gradient-text">perfect assessments</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Configure Assignment',
      description: 'Set your subject, grade, question types, difficulty levels, and total marks.',
    },
    {
      step: '02',
      title: 'AI Generates Questions',
      description: 'Our AI engine crafts structured questions with proper difficulty distribution.',
    },
    {
      step: '03',
      title: 'Review & Export',
      description: 'Preview the formatted question paper, make adjustments, and download as PDF.',
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-indigo-500 uppercase tracking-wider">How It Works</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Three simple steps to your
            <br />
            <span className="gradient-text">perfect question paper</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary text-white text-2xl font-bold mb-6 shadow-xl shadow-indigo-500/25">
                {item.step}
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-indigo-300 to-transparent" />
              )}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to transform your
          <br />
          assessment workflow?
        </h2>
        <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto">
          Join hundreds of educators already using VedaAI to create intelligent,
          AI-powered question papers in seconds.
        </p>
        <Link href="/register">
          <Button
            size="lg"
            className="bg-white text-indigo-600 hover:bg-gray-100 shadow-2xl shadow-black/20 px-10 text-base font-semibold"
          >
            Get Started for Free
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Veda<span className="text-indigo-400">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-8 text-sm text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">About</Link>
            <Link href="#" className="hover:text-white transition-colors">Features</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} VedaAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
