"use client"

import type React from "react"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import {
  ChevronUp,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Menu,
  X,
  Mouse,
  Download,
  MapPin,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Code,
  Brain,
  Blocks,
  Cpu,
} from "lucide-react"
import Image from "next/image"

// Particle component for background animation
const Particle = ({ x, y, delay }: { x: number; y: number; delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      x: [0, Math.random() * 100 - 50],
      y: [0, Math.random() * 100 - 50],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: Math.random() * 2,
    }}
  />
)

// Confetti component for Easter egg
const Confetti = ({ trigger }: { trigger: boolean }) => (
  <AnimatePresence>
    {trigger && (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: ["#00FFF7", "#FF0066", "#FFD700", "#00FF00", "#FF4500"][i % 5],
              left: "50%",
              top: "50%",
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
              x: (Math.random() - 0.5) * 1000,
              y: (Math.random() - 0.5) * 1000,
              rotate: Math.random() * 360,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3,
              delay: i * 0.02,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    )}
  </AnimatePresence>
)

// Typing animation hook - updated to restart on reload
const useTypewriter = (text: string, speed = 100) => {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Reset states on component mount/reload
    setDisplayText("")
    setIsComplete(false)
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1))
        i++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed]) // Dependencies ensure it runs when component mounts

  return { displayText, isComplete }
}

export default function Portfolio() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [navbarVisible, setNavbarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  // Initialize the typing animation - this will restart on every reload
  const { displayText: heroText, isComplete: heroComplete } = useTypewriter("Hi, I'm Ritu Raj.", 120)

  useEffect(() => {
    // Always set loaded to true to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100) // Small delay to ensure smooth animation start

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // Show/hide navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setNavbarVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setNavbarVisible(true)
      }
      setLastScrollY(currentScrollY)
      setShowScrollTop(currentScrollY > 500)
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3000)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [lastScrollY])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setMobileMenuOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(`Portfolio Contact: Message from ${formData.name}`)
      const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}
      `)

      const mailtoLink = `mailto:riturajhmr@gmail.com?subject=${subject}&body=${body}`

      // Open email client
      window.location.href = mailtoLink

      // Reset form and show success
      setFormData({ name: "", email: "", message: "" })
      setSubmitStatus("success")

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 3000)
    } catch (error) {
      console.error("Error sending message:", error)
      setSubmitStatus("error")

      // Reset error message after 3 seconds
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const navItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Projects", id: "projects" },
    { name: "Experience", id: "experience" },
    { name: "Skills", id: "skills" },
    { name: "Certifications", id: "certifications" },
    { name: "Achievements", id: "achievements" },
    { name: "Contact", id: "contact" },
  ]

  return (
    <div
      ref={containerRef}
      className="bg-[#0D0D0D] text-white overflow-x-hidden font-['Inter'] h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{
        scrollBehavior: "smooth",
        scrollSnapType: "y mandatory",
      }}
    >
      {/* Confetti Easter Egg */}
      <Confetti trigger={confetti} />

      {/* Header Navigation */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md"
        initial={{ y: 0 }}
        animate={{ y: navbarVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ritu Raj
          </motion.div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium text-sm relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-400 group-hover:w-full transition-all duration-300" />
              </motion.button>
            ))}
          </nav>

          {/* Resume Button */}
          <motion.button
            className="hidden md:block bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-full font-medium text-sm hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-300 flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            Resume
          </motion.button>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-black/90 backdrop-blur-md max-h-96 overflow-y-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium text-sm py-2"
                  >
                    {item.name}
                  </button>
                ))}
                <button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-full font-medium text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Resume
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Social Sidebar */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col space-y-4">
          {[
            { icon: Github, href: "https://github.com/Riturajhmr", color: "hover:text-gray-300" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/riturajhmr007", color: "hover:text-cyan-400" },
            { icon: Mail, href: "mailto:riturajhmr@gmail.com", color: "hover:text-pink-400" },
          ].map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target={social.href.startsWith("mailto:") ? "_self" : "_blank"}
              rel={social.href.startsWith("mailto:") ? "" : "noopener noreferrer"}
              className={`text-gray-500 ${social.color} transition-all duration-300 p-3 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <social.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden snap-start snap-always"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>

        {/* Particle Effects */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <Particle
              key={i}
              x={Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200)}
              y={Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800)}
              delay={i * 0.2}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-white to-pink-400 bg-clip-text text-transparent"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {heroText}
              <motion.span
                className="inline-block w-1 h-12 md:h-16 bg-cyan-400 ml-2"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.h1>

            <motion.div
              className="text-lg md:text-xl mb-12 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: heroComplete ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <span className="block mb-2">Full-Stack Developer</span>
              <span className="text-cyan-400">|</span>
              <span className="mx-2">AI Innovator</span>
              <span className="text-pink-400">|</span>
              <span className="ml-2">Blockchain Engineer</span>
            </motion.div>

            <motion.button
              className="group relative px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-full font-semibold text-lg transition-all duration-500 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroComplete ? 1 : 0, y: heroComplete ? 0 : 20 }}
              transition={{ duration: 1, delay: 1 }}
              onClick={() => scrollToSection("projects")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">See Projects</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: heroComplete ? 1 : 0 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="flex flex-col items-center text-gray-400"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Mouse className="w-6 h-6 mb-2" />
            <span className="text-xs uppercase tracking-wider">Scroll</span>
          </motion.div>
        </motion.div>

        {/* Easter Egg Hint */}
        <div className="absolute bottom-4 right-4 text-xs text-gray-600 opacity-50">{"Press 'R' for magic ✨"}</div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative h-screen flex items-center justify-center overflow-hidden snap-start snap-always bg-gradient-to-b from-[#0D0D0D] to-gray-900"
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/placeholder.svg?height=1080&width=1920&text=Developer+workspace"
            alt="Developer workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/80 to-gray-900/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                About Me
              </h2>
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p className="text-xl">
                  {
                    "I'm a passionate full-stack developer with expertise in React.js and Golang, creating robust web applications that bridge the gap between innovative design and powerful functionality."
                  }
                </p>
                <p>
                  {
                    "My journey spans across AI and hardware integration, where I've developed cutting-edge drowsiness detection systems using OpenCV and Python, combining computer vision with real-world safety applications."
                  }
                </p>
                <p>
                  {
                    "In the blockchain space, I craft smart contracts with Solidity, building decentralized solutions that push the boundaries of traditional systems."
                  }
                </p>
                <p>
                  {
                    "With a unique cross-disciplinary background in B.Tech, I bring a holistic perspective to technology, focusing on human-centered solutions."
                  }
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                {[
                  { number: "15+", label: "Projects Completed" },
                  { number: "2+", label: "Years Experience" },
                  { number: "5+", label: "Technologies Mastered" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative w-96 h-96 mx-auto">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full blur-xl opacity-30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 backdrop-blur-sm bg-white/5 shadow-[0_0_50px_rgba(34,211,238,0.3)]">
                  <Image
                    src="/images/profile-photo.png"
                    alt="Ritu Raj - Professional headshot"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="relative min-h-screen flex items-center justify-center overflow-hidden snap-start snap-always bg-gradient-to-b from-[#0D0D0D] to-gray-900 py-20"
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/placeholder.svg?height=1080&width=1920&text=Project+showcase"
            alt="Project showcase"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/80 to-gray-900/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Featured Projects
          </motion.h2>

          <div className="space-y-12 max-w-6xl mx-auto">
            {[
              {
                title: "SoulCircle — Anonymous Emotional Support Platform",
                year: "2025",
                tech: ["React", "Node.js", "Firebase", "Firestore", "Tailwind CSS", "Vercel"],
                gradient: "from-purple-400 to-pink-400",
                achievements: [
                  "Built and deployed an anonymous mental wellness app that supports 500+ active users/month, enabling safe, real-time peer conversations without revealing identity.",
                  "Designed and integrated a Node.js backend with Firebase Auth and JWT workflows to handle secure, session-based chat and FeelNotes journaling, reducing data exposure risks by 95%.",
                  "Engineered a multi-step emotion onboarding flow that improved user engagement by 60%, helping match users to relevant groups and personalized support spaces.",
                  "Solved real-time data sync and scalability challenges using Firestore's live updates and optimized queries, achieving <200ms message delivery across global chatrooms.",
                ],
                icon: "💙",
              },
              {
                title: "E-commerce Platform with Go Backend",
                year: "2024",
                tech: ["Go", "MongoDB", "REST API", "JWT Authentication"],
                gradient: "from-green-400 to-cyan-400",
                achievements: [
                  "Architected and executed a scalable E-commerce backend using Golang with RESTful APIs to handle high concurrency and modular services.",
                  "Engineered JWT-based authentication for secure login, session handling, and authorization workflows, reducing vulnerability exposure.",
                  "Built full product lifecycle modules — product listings, cart, orders — backed by MongoDB with optimized document indexing.",
                  "Reduced API latency by 20% through advanced query optimization and database schema refinement.",
                ],
                icon: "🛒",
              },
              {
                title: "Crowd Funding Platform (Blockchain + Web3.js)",
                year: "2023",
                tech: ["Solidity", "Web3.js", "React.js", "Ethereum"],
                gradient: "from-cyan-400 to-blue-400",
                achievements: [
                  "Designed and developed a decentralized crowdfunding platform leveraging Ethereum smart contracts for secure contributions.",
                  "Wrote gas-efficient Solidity contracts to handle campaign creation, funding goals, and withdrawal logic.",
                  "Integrated Web3.js with React to build a responsive front end with seamless MetaMask wallet interaction.",
                  "Deployed and rigorously tested contracts on Remix IDE and local testnets, achieving zero critical bugs pre-deployment.",
                ],
                icon: "⟠",
              },
            ].map((project, index) => (
              <motion.div
                key={project.title}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01, y: -5 }}
              >
                {/* Gradient Background Overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  {/* Project Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <motion.div
                        className={`text-4xl p-3 rounded-2xl bg-gradient-to-r ${project.gradient} bg-opacity-10 backdrop-blur-sm`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        {project.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <span
                            className={`text-sm font-semibold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}
                          >
                            {project.year}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className={`px-4 py-2 bg-gradient-to-r ${project.gradient} bg-opacity-20 text-sm rounded-full backdrop-blur-sm border border-white/20 font-medium text-white hover:bg-opacity-30 transition-all duration-300`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="space-y-4 mb-6">
                    {project.achievements.map((achievement, achievementIndex) => (
                      <motion.div
                        key={achievementIndex}
                        className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + achievementIndex * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.gradient} mt-2 flex-shrink-0`}
                        />
                        <p className="text-gray-300 text-sm leading-relaxed">{achievement}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* View Project Button */}
                  <motion.button
                    className={`group/btn relative overflow-hidden px-6 py-3 bg-gradient-to-r ${project.gradient} text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center space-x-2`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">View Project</span>
                    <motion.div className="relative z-10" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <ExternalLink className="w-4 h-4" />
                    </motion.div>
                    {/* Button Shine Effect */}
                    <motion.div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="relative h-screen flex items-center justify-center overflow-hidden snap-start snap-always bg-gradient-to-b from-gray-900 to-[#0D0D0D]"
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/placeholder.svg?height=1080&width=1920&text=Office+workspace"
            alt="Office workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-[#0D0D0D]/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Professional Experience
          </motion.h2>

          <motion.div
            className="relative max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-pink-400 hidden md:block" />

            {/* Experience Card */}
            <div className="relative">
              {/* Timeline Dot */}
              <motion.div
                className="absolute left-6 top-8 w-4 h-4 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full border-4 border-[#0D0D0D] hidden md:block"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              />

              <motion.div
                className="md:ml-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 group hover:border-cyan-400/50"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Gradient Background Overlay */}
                <motion.div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-pink-400/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Full Stack Developer Intern</h3>
                      <div className="flex items-center space-x-4 text-lg">
                        <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                          SCJ Entertainment
                        </span>
                        <div className="flex items-center text-gray-400">
                          <MapPin className="w-4 h-4 mr-1" />
                          Remote
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300 mt-4 lg:mt-0">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span className="font-medium">May 2025 – Present</span>
                    </div>
                  </div>

                  {/* Key Achievements */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        icon: TrendingUp,
                        text: "Built a revenue model calculator which calculates the revenue generated by a particular content at the given period of time",
                        tech: ["Node.js", "Serverbyt", "Analytics"],
                        color: "from-green-400 to-cyan-400",
                      },
                      {
                        icon: Shield,
                        text: "Implemented JWT-based authentication and SendGrid email verification, reducing unauthorized access incidents by 25%",
                        tech: ["JWT", "SendGrid"],
                        color: "from-purple-400 to-pink-400",
                      },
                      {
                        icon: Zap,
                        text: "Designed responsive front end using React.js and Tailwind CSS, enhancing UI responsiveness by 35%",
                        tech: ["React.js", "Tailwind CSS"],
                        color: "from-cyan-400 to-blue-400",
                      },
                      {
                        icon: Target,
                        text: "Led cross-functional development team ensuring on-time delivery of key product milestones",
                        tech: ["Leadership", "Management"],
                        color: "from-orange-400 to-red-400",
                      },
                    ].map((achievement, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.div
                          className={`p-3 rounded-full bg-gradient-to-r ${achievement.color} bg-opacity-20 flex-shrink-0`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <achievement.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <p className="text-gray-300 leading-relaxed mb-3 text-sm">{achievement.text}</p>
                          <div className="flex flex-wrap gap-2">
                            {achievement.tech.map((tech) => (
                              <span
                                key={tech}
                                className={`px-3 py-1 bg-gradient-to-r ${achievement.color} bg-opacity-20 text-xs rounded-full backdrop-blur-sm border border-white/20`}
                              >
                                <span className="text-white font-medium">{tech}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5️⃣ Skills Section */}
      <section
        id="skills"
        className="relative h-screen flex items-center justify-center overflow-hidden snap-start snap-always bg-gradient-to-b from-gray-900 to-[#0D0D0D]"
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/placeholder.svg?height=1080&width=1920"
            alt="Technology and coding"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-[#0D0D0D]/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Skills & Tech Stack
          </motion.h2>

          {/* Skills Grid with Icons/Badges */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                icon: Code, // instead of Server
                title: "Backend Development",
                skills: [
                  { name: "Golang", icon: "🐹" },
                  { name: "Node.js", icon: "🟢" },
                  { name: "REST API", icon: "🔗" },
                  { name: "Gin Framework", icon: "🍸" },
                  { name: "JWT Auth", icon: "🔐" },
                ],
                color: "from-blue-400 to-cyan-400",
              },
              {
                icon: Brain, // instead of Globe
                title: "Frontend Development",
                skills: [
                  { name: "React.js", icon: "⚛️" },
                  { name: "HTML5", icon: "🌐" },
                  { name: "CSS3", icon: "🎨" },
                  { name: "JavaScript", icon: "💛" },
                  { name: "Tailwind", icon: "🌊" },
                ],
                color: "from-purple-400 to-pink-400",
              },
              {
                icon: Blocks, // instead of Coins
                title: "Blockchain Development",
                skills: [
                  { name: "Solidity", icon: "💎" },
                  { name: "Web3.js", icon: "🌐" },
                  { name: "Ethereum", icon: "Ξ" },
                  { name: "Remix IDE", icon: "🔧" },
                  { name: "NFT Standards", icon: "🖼️" },
                ],
                color: "from-green-400 to-blue-400",
              },
              {
                icon: Cpu, // instead of Cloud
                title: "DevOps & Cloud",
                skills: [
                  { name: "AWS", icon: "☁️" },
                  { name: "Docker", icon: "🐳" },
                  { name: "Git", icon: "📝" },
                  { name: "CI/CD", icon: "🔄" },
                  { name: "Lambda", icon: "λ" },
                ],
                color: "from-orange-400 to-red-400",
              },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                className="group relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Header with Icon */}
                <div className="relative z-10 p-6">
                  <div className="flex items-center mb-4">
                    <motion.div
                      className={`p-3 rounded-xl bg-gradient-to-r ${category.color} bg-opacity-20 mr-4`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <category.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">{category.title}</h3>
                  </div>

                  {/* Skills with Icons/Badges */}
                  <div className="space-y-3">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + skillIndex * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{skill.icon}</span>
                          <span className="text-gray-300 text-sm font-medium">{skill.name}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Tech Badges */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Additional Technologies</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {[
                { name: "Python", icon: "🐍", color: "from-yellow-400 to-green-400" },
                { name: "MongoDB", icon: "🍃", color: "from-green-400 to-teal-400" },
                { name: "PostgreSQL", icon: "🐘", color: "from-blue-400 to-indigo-400" },
                { name: "Firebase", icon: "🔥", color: "from-orange-400 to-red-400" },
                { name: "OpenCV", icon: "👁️", color: "from-purple-400 to-pink-400" },
                { name: "Machine Learning", icon: "🤖", color: "from-cyan-400 to-blue-400" },
                { name: "Raspberry Pi", icon: "🥧", color: "from-red-400 to-pink-400" },
                { name: "SendGrid", icon: "📧", color: "from-blue-400 to-cyan-400" },
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tech.color} bg-opacity-10 border border-white/10 hover:border-cyan-400/30 transition-all duration-300`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-lg">{tech.icon}</span>
                  <span className="text-sm font-medium text-white">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      {/* Certifications Section */}
      <section
        id="certifications"
        className="relative h-screen flex items-center justify-center overflow-hidden snap-start snap-always bg-gradient-to-b from-[#0D0D0D] to-gray-900"
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/placeholder.svg?height=1080&width=1920&text=Certificates+and+achievements"
            alt="Certificates and achievements"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/80 to-gray-900/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Certifications
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {[
              {
                icon: "🧾",
                title: "Blockchain Development Bootcamp",
                platform: "Udemy, Alchemy, Codeburst",
                gradient: "from-purple-400 to-pink-400",
                details: [
                  "Learned Ethereum fundamentals, Solidity syntax, error handling, inheritance, and security best practices.",
                  "Built full-stack DApps: Inbox, Lottery, CampaignFactory; deployed via Ganache + React + MetaMask.",
                  "Mastered Web3.js, Mocha + Chai testing, Truffle workflow, and secure deployment on testnets.",
                  "Developed robust version-controlled environments handling dependency updates and toolchain variations.",
                ],
              },
              {
                icon: "🐍",
                title: "100 Days of Code: The Complete Python Pro Bootcamp",
                platform: "Udemy",
                gradient: "from-green-400 to-cyan-400",
                details: [
                  "Learned Python programming fundamentals including variables, control flow, functions, and object-oriented programming.",
                  "Built 30+ hands-on projects covering web development with Flask, data analysis, automation, and game development.",
                  "Gained practical experience using APIs, file handling, debugging, and unit testing.",
                  "Worked with Git/GitHub for version control, and applied real-world problem-solving throughout the course.",
                ],
              },
            ].map((cert, index) => (
              <motion.div
                key={cert.title}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -10 }}
              >
                {/* Gradient Background Overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${cert.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
                />

                {/* Certificate Badge */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className={`text-4xl p-3 rounded-2xl bg-gradient-to-r ${cert.gradient} bg-opacity-10 backdrop-blur-sm`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        {cert.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">{cert.title}</h3>
                        <p
                          className={`text-sm font-semibold bg-gradient-to-r ${cert.gradient} bg-clip-text text-transparent`}
                        >
                          Platform: {cert.platform}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="space-y-3 mb-6">
                    {cert.details.slice(0, 3).map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + detailIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cert.gradient} mt-2 flex-shrink-0`} />
                        <p className="text-gray-300 text-sm leading-relaxed">{detail}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* View Certificate Button */}
                  <motion.button
                    className={`group/btn relative overflow-hidden px-6 py-3 bg-gradient-to-r ${cert.gradient} text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center space-x-2`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">View Certificate</span>
                    <motion.div className="relative z-10" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <ExternalLink className="w-4 h-4" />
                    </motion.div>
                    {/* Button Shine Effect */}
                    <motion.div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section
        id="achievements"
        className="relative h-screen flex items-center justify-center overflow-hidden snap-start snap-always bg-gradient-to-b from-[#0D0D0D] to-gray-900"
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/placeholder.svg?height=1080&width=1920&text=Awards+and+trophies"
            alt="Awards and trophies"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/80 to-gray-900/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Achievements
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "🎓",
                title: "GATE Exam Excellence",
                description: "Cleared GATE exam with a score of 340",
                color: "from-emerald-400 to-teal-400",
              },
              {
                icon: "🏆",
                title: "JEE Mains Excellence",
                description: "Secured 96 percentile in JEE Mains",
                color: "from-yellow-400 to-orange-400",
              },
              {
                icon: "🧠",
                title: "Mathematics Olympiad",
                description: "District topper in Mathematics Olympiad",
                color: "from-purple-400 to-pink-400",
              },
              {
                icon: "🏑",
                title: "Hockey Champion",
                description: "Won the District Hockey Tournament",
                color: "from-green-400 to-blue-400",
              },
              {
                icon: "📢",
                title: "Advertisement Competition",
                description: "Won First Prize in Advertisement Competition",
                color: "from-cyan-400 to-blue-400",
              },
              {
                icon: "🚁",
                title: "Drone Making Course",
                description: "Completed drone making course from NIT Jalandhar",
                color: "from-indigo-400 to-purple-400",
              },
            ].map((achievement, index) => (
              <motion.div
                key={achievement.title}
                className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${achievement.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                />
                <div className="relative z-10 flex items-start space-x-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">{achievement.title}</h3>
                    <p className="text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative h-screen flex items-center justify-center overflow-hidden snap-start snap-always bg-gradient-to-b from-gray-900 to-[#0D0D0D]"
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/placeholder.svg?height=1080&width=1920&text=Contact+and+communication"
            alt="Contact and communication"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-[#0D0D0D]/80" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Get In Touch
          </motion.h2>

          <motion.div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors duration-300 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Your Message"
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors duration-300 resize-none backdrop-blur-sm"
                />
              </div>

              {/* Submit Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-green-400 font-medium">✅ Email client opened! Your message is ready to send.</p>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-red-400 font-medium">❌ Something went wrong. Please try again.</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-cyan-400 to-pink-400 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? "Opening Email Client..." : "Send Message"}
              </motion.button>
            </form>

            <div className="flex justify-center space-x-8 mt-8 pt-8 border-t border-white/10">
              {[
                { icon: Github, href: "https://github.com/Riturajhmr", color: "hover:text-gray-300" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/riturajhmr007", color: "hover:text-cyan-400" },
                { icon: Mail, href: "mailto:riturajhmr@gmail.com", color: "hover:text-pink-400" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target={social.href.startsWith("mailto:") ? "_self" : "_blank"}
                  rel={social.href.startsWith("mailto:") ? "" : "noopener noreferrer"}
                  className={`text-gray-500 ${social.color} transition-colors duration-300 p-4 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10`}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-lg">{"© 2024 Ritu Raj – Made with 💻 + ❤️"}</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <motion.button
        className={`fixed bottom-8 right-8 p-4 bg-gradient-to-r from-cyan-400 to-pink-400 text-black rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 ${
          showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={scrollToTop}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronUp className="w-7 h-7" />
      </motion.button>
    </div>
  )
}
