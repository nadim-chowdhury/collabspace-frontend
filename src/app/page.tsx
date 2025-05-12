import Link from "next/link";
import {
  FileText,
  Kanban,
  MessageCircle,
  Calendar,
  Palette,
  Video,
} from "lucide-react";

export default function HomePage() {
  const moduleFeatures = [
    {
      icon: <FileText className="w-14 h-14 text-white" />,
      title: "Docs",
      description: "Collaborative document creation and management",
      features: [
        "Real-time editing",
        "Version history",
        "Rich text formatting",
        "Collaborative comments",
      ],
      bgColor: "bg-gradient-to-br from-[#8D6E63] to-[#6D4C41]",
      textColor: "text-white",
      shadowColor: "shadow-[#6D4C41]/50",
    },
    {
      icon: <Kanban className="w-14 h-14 text-white" />,
      title: "Boards",
      description: "Powerful project management",
      features: [
        "Kanban workflows",
        "Task tracking",
        "Sprint planning",
        "Team collaboration",
      ],
      bgColor: "bg-gradient-to-br from-[#795548] to-[#5D4037]",
      textColor: "text-white",
      shadowColor: "shadow-[#5D4037]/50",
    },
    {
      icon: <MessageCircle className="w-14 h-14 text-white" />,
      title: "Chat",
      description: "Seamless team communication",
      features: [
        "Channels & direct messaging",
        "File sharing",
        "Voice & video calls",
        "Integrations",
      ],
      bgColor: "bg-gradient-to-br from-[#6D4C41] to-[#4E342E]",
      textColor: "text-white",
      shadowColor: "shadow-[#4E342E]/50",
    },
    {
      icon: <Calendar className="w-14 h-14 text-white" />,
      title: "Calendar",
      description: "Smart scheduling & planning",
      features: [
        "Team availability",
        "Meeting scheduling",
        "Time zone management",
        "Event tracking",
      ],
      bgColor: "bg-gradient-to-br from-[#5D4037] to-[#3E2723]",
      textColor: "text-white",
      shadowColor: "shadow-[#3E2723]/50",
    },
    {
      icon: <Palette className="w-14 h-14 text-white" />,
      title: "Whiteboard",
      description: "Unlimited creative collaboration",
      features: [
        "Infinite canvas",
        "Real-time drawing",
        "Design tools",
        "Collaborative brainstorming",
      ],
      bgColor: "bg-gradient-to-br from-[#4E342E] to-[#3E2723]",
      textColor: "text-white",
      shadowColor: "shadow-[#3E2723]/50",
    },
    {
      icon: <Video className="w-14 h-14 text-white" />,
      title: "Meetings",
      description: "Connect face-to-face",
      features: [
        "HD Video calls",
        "Screen sharing",
        "Recording",
        "Virtual backgrounds",
      ],
      bgColor: "bg-gradient-to-br from-[#3E2723] to-[#263238]",
      textColor: "text-white",
      shadowColor: "shadow-[#263238]/50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d2b48c] via-[#f5f5dc] to-[#fdf6ec] text-[#3e2723]">
      {/* Hero Section */}
      <header className="w-full max-w-7xl mx-auto px-6 py-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wide text-[#4e342e]">
          Collab<span className="text-[#6d4c41]">Space</span>
        </h1>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-[#6d4c41] text-white px-4 py-2 rounded-md hover:bg-[#5d4037] transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-[#d7ccc8] text-[#3e2723] px-4 py-2 rounded-md hover:bg-[#c7b7b1] transition"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Main Hero Content */}
      <section className="text-center max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-6xl font-extrabold mb-6 text-[#4e342e]">
          Brew Ideas. Build Together.
        </h2>
        <p className="text-xl text-[#5d4037] mb-10 max-w-3xl mx-auto">
          CollabSpace is your all-in-one workspace designed to transform how
          teams collaborate, communicate, and create - all within a single,
          intuitive platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-[#795548] text-white px-6 py-3 rounded-md hover:bg-[#6d4c41] transition"
          >
            Start Collaborating
          </Link>
          <Link
            href="/features"
            className="border border-[#795548] text-[#5d4037] px-6 py-3 rounded-md hover:bg-[#f5f5dc] transition"
          >
            Explore Features
          </Link>
        </div>
      </section>

      {/* Modules Showcase */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12 text-[#4e342e]">
            One Platform, Endless Possibilities
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {moduleFeatures.map((module, index) => (
              <div
                key={index}
                className={`
                  ${module.bgColor} 
                  ${module.shadowColor}
                  p-6 rounded-2xl shadow-2xl 
                  transform transition duration-300 
                  hover:scale-105 hover:shadow-xl
                  group
                `}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white/20 rounded-full mr-4">
                    {module.icon}
                  </div>
                  <h4 className={`text-2xl font-semibold ${module.textColor}`}>
                    {module.title}
                  </h4>
                </div>
                <p className={`${module.textColor} opacity-80 mb-4`}>
                  {module.description}
                </p>
                <ul className={`space-y-2 ${module.textColor} opacity-90`}>
                  {module.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="mr-2 text-white/70">●</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#795548] text-white py-16 text-center">
        <h3 className="text-4xl font-bold mb-6">
          Ready to Revolutionize Your Team&apos;s Workflow?
        </h3>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Join thousands of teams who&apos;ve transformed their collaboration
          with CollabSpace. No credit card required. Get started in minutes.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/register"
            className="bg-white text-[#795548] px-6 py-3 rounded-md hover:bg-[#f5f5dc] transition"
          >
            Start Free Trial
          </Link>
          <Link
            href="/demo"
            className="border border-white text-white px-6 py-3 rounded-md hover:bg-[#8d6e63] transition"
          >
            Request Demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#5d4037] text-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div>
            <h4 className="text-2xl font-bold">CollabSpace</h4>
            <p className="text-sm mt-2">
              © {new Date().getFullYear()} CollabSpace. Crafted with ☕ and
              code.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
