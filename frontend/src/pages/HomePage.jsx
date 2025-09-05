import React from "react";
import { Link } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  Rocket,
  LayoutDashboard,
  User,
  ShieldCheck,
  Wand2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import BgAnimation from '../components/BgAnimation';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

// Testimonial Card Component
const TestimonialCard = ({ imageSeed, name, college, quote, index }) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    custom={index}
    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition flex flex-col h-full border border-amber-100"
  >
    <div className="flex items-center mb-4">
      <img
        src={`https://api.dicebear.com/7.x/initials/svg?seed=${imageSeed}`}
        alt={name}
        className="w-12 h-12 rounded-full border-2 border-amber-200"
      />
      <div className="ml-4 text-left">
        <h4 className="font-semibold text-[#3b2f2f]">{name}</h4>
        <p className="text-sm text-[#5c4a3f]">{college}</p>
      </div>
    </div>
    <p className="text-[#5c4a3f] italic">"{quote}"</p>
  </motion.div>
);

const HomePage = () => {
  const { user } = useAuthStore();

  return (
    <div className="bg-[#1c1106] text-[#3b2f2f]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-amber-200 shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 text-white font-semibold text-sm shadow-md">
              SM
            </div>
            <span className="text-lg font-bold tracking-tight">
              Skill Matrix
            </span>
          </Link>

          {/* Navbar options */}
          <div className="hidden sm:flex items-center gap-8 md:gap-14">
            <a href="#how-it-works" className="hover:text-amber-700 transition font-bold">
              How-Works
            </a>
            <a href="#features" className="hover:text-amber-700 transition font-bold">
              Features
            </a>
            <a href="#testimonials" className="hover:text-amber-700 transition font-bold">
              Stories
            </a>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 md:px-4 text-sm font-medium hover:bg-amber-50 transition shadow-sm"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-3 py-2 md:px-4 text-sm font-medium text-white hover:bg-amber-800 shadow-md transition"
                >
                  <User className="h-4 w-4" /> Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 md:px-4 text-sm font-medium hover:bg-amber-50 transition shadow-sm"
                >
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-3 py-2 md:px-4 text-sm font-medium text-white hover:bg-amber-800 shadow-md transition"
                >
                  <UserPlus className="h-4 w-4" /> Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative pt-28 pb-24 min-h-[100vh] flex items-center overflow-hidden">
          <BgAnimation />

          <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
            <div className="grid items-center gap-16 md:grid-cols-2">
              {/* Text */}
              <div className="space-y-8 text-center md:text-left">
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
                  Build Your{" "}
                  <span className="bg-gradient-to-r from-amber-500 to-orange-400 bg-clip-text text-transparent">
                    Dream Project Team
                  </span>{" "}
                  with <span className="text-amber-400">AI</span>
                </h1>
                <p className="text-lg md:text-xl text-amber-100 leading-relaxed max-w-xl mx-auto md:mx-0">
                  Find the right teammates, manage projects effortlessly, and
                  get AI-powered suggestions to bring your ideas to life — all
                  in one warm and modern platform.
                </p>
                {!user && (
                  <div className="flex flex-wrap gap-5 justify-center md:justify-start">
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-700 px-7 py-3.5 text-lg font-semibold text-white hover:bg-amber-800 transition shadow-xl shadow-amber-400/30"
                    >
                      <Rocket className="h-5 w-5" /> Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-7 py-3.5 text-lg font-medium text-[#3b2f2f] hover:bg-amber-50 transition shadow-md"
                    >
                      <LogIn className="h-5 w-5" /> Login
                    </Link>
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="relative group">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-200 opacity-25 blur-2xl group-hover:opacity-40 transition"></div>
                <img
                  src="/image.png"
                  alt="Students collaborating on a project"
                  className="relative rounded-2xl shadow-2xl shadow-amber-200/70 aspect-video object-cover transform group-hover:scale-[1.02] transition duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-[#fdfbf8]">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#3b2f2f]">
                How It Works
              </h2>
              <p className="mt-2 text-lg text-[#5c4a3f]">
                Get started in just a few simple steps.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Register",
                  desc: "Create your profile with skills and domains. Verify with OTP.",
                },
                {
                  step: "2",
                  title: "Build Team",
                  desc: "Use AI to find matches and assign roles within your team.",
                },
                {
                  step: "3",
                  title: "Start Project",
                  desc: "Track progress, chat, and ship your project faster.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={i}
                  className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-amber-100"
                >
                  <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 text-amber-700 font-bold text-xl shadow-sm">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[#5c4a3f]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-[#faf8f5]">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center text-[#3b2f2f]">
              Everything you need to launch your project
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  icon: <ShieldCheck className="h-6 w-6 text-amber-700" />,
                  bg: "bg-amber-100",
                  title: "OTP Registration",
                  desc: "Secure verification-first sign up to keep the platform safe and authentic.",
                },
                {
                  icon: <Wand2 className="h-6 w-6 text-orange-600" />,
                  bg: "bg-orange-100",
                  title: "AI Team Builder",
                  desc: "Get matched with talented students who complement your unique strengths.",
                },
                {
                  icon: <Sparkles className="h-6 w-6 text-yellow-600" />,
                  bg: "bg-yellow-100",
                  title: "Project Showcase",
                  desc: "Publish your completed projects with GitHub repositories and live links.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={i}
                  className="rounded-2xl border border-amber-100 bg-white p-8 text-center shadow-md hover:shadow-xl transition"
                >
                  <div
                    className={`inline-flex items-center justify-center rounded-xl ${item.bg} p-4 mb-4 shadow-sm`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[#5c4a3f]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-[#fdfbf8]">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center text-[#3b2f2f] mb-12">
              Student Success Stories
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <TestimonialCard
                imageSeed="Isha Kapoor"
                name="Isha Kapoor"
                college="IIIT Hyderabad"
                quote="I found teammates with exactly the skills we needed. We built a hackathon-winning app in a week!"
                index={0}
              />
              <TestimonialCard
                imageSeed="Arjun Nair"
                name="Arjun Nair"
                college="NIT Trichy"
                quote="The AI suggestions were spot on. Our project got noticed by recruiters."
                index={1}
              />
              <TestimonialCard
                imageSeed="Riya Sharma"
                name="Riya Sharma"
                college="MIT"
                quote="Love the clean UI and the team management workflow. Super helpful!"
                index={2}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* <footer className="bg-[#3b2f2f] text-amber-100 relative z-10">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 text-white font-semibold text-sm shadow-md">
                  SM
                </div>
                <span className="text-xl font-semibold text-white tracking-tight">
                  Skill Matrix
                </span>
              </Link>
              <p className="text-sm">
                Build amazing student teams and projects.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/learning" className="hover:text-white">
                    Learning
                  </Link>
                </li>
                <li>
                  <Link to="/ai-suggestions" className="hover:text-white">
                    AI Suggestions
                  </Link>
                </li>
                <li>
                  <Link to="/choose-team" className="hover:text-white">
                    Team Builder
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-amber-800 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} Skill Matrix. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default HomePage;