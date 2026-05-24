'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Brain, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — gradient */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl"
          />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-2xl shadow-indigo-500/30 mx-auto mb-8">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to VedaAI</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Create AI-powered question papers in seconds. The modern platform built for educators.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 bg-surface dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Veda<span className="gradient-text">AI</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign in to your account</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-500 hover:text-indigo-600 font-medium">
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
