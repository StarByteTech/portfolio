"use client";

import { useEffect, useRef, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useHoverSound } from "@/lib/useHoverSound";
import { IconBrandInstagram, IconBrandThreads, IconBrandLinkedin, IconBrandDribbble } from "@tabler/icons-react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const contactInfo = [
  {
    title: "Email",
    value: "info@starbyte.dev",
    icon: "✉",
    type: "email" as const,
    href: "mailto:info@starbyte.dev",
  },
  {
    title: "Schedule a Call",
    value: "Book a free consultation",
    icon: "◷",
    type: "button" as const,
    href: "https://cal.com/daim-starbyte",
  },
];

export function ContactSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const ctx = useRef<gsap.Context | null>(null);
  const playHoverSound = useHoverSound();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ctx.current = gsap.context(() => {
      // Hero animations
      if (heroRef.current) {
        const heroElements = heroRef.current.querySelectorAll(".hero-animate");
        gsap.set(heroElements, { y: 100, opacity: 0 });
        gsap.to(heroElements, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.2,
        });
      }

      // Form animation
      if (formRef.current) {
        const formFields = formRef.current.querySelectorAll(".form-field");
        gsap.fromTo(
          formFields,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Info cards animation
      if (infoRef.current) {
        const cards = infoRef.current.querySelectorAll(".info-card");
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: infoRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => {
      ctx.current?.revert();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-5xl text-center">
          <h1
            className="hero-animate text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
            style={{ fontFamily: "var(--font-skateblade)" }}
          >
            Let's Create
            <br />
            Something Amazing
          </h1>
          <p className="hero-animate text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have a project in mind? We'd love to hear about it. Share your vision, and let's explore how we can
            bring it to life together.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2
                className="text-3xl md:text-5xl font-bold mb-8"
                style={{ fontFamily: "var(--font-skateblade)" }}
              >
                Send Us a Message
              </h2>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="form-field">
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${focusedField === "name" ? "text-primary" : "text-muted-foreground"
                      }`}
                  >
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full transition-all duration-300 focus:scale-[1.02]"
                    placeholder="Nathan Drake"
                  />
                </div>

                <div className="form-field">
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${focusedField === "email" ? "text-primary" : "text-muted-foreground"
                      }`}
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full transition-all duration-300 focus:scale-[1.02]"
                    placeholder="nathan@example.com"
                  />
                </div>

                <div className="form-field">
                  <label
                    htmlFor="company"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${focusedField === "company" ? "text-primary" : "text-muted-foreground"
                      }`}
                  >
                    Company (Optional)
                  </label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("company")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full transition-all duration-300 focus:scale-[1.02]"
                    placeholder="Your Company"
                  />
                </div>

                <div className="form-field">
                  <label
                    htmlFor="message"
                    className={`block text-sm font-medium mb-2 transition-colors duration-300 ${focusedField === "message" ? "text-primary" : "text-muted-foreground"
                      }`}
                  >
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full min-h-[200px] transition-all duration-300 focus:scale-[1.02]"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full group relative overflow-hidden"
                  onMouseEnter={playHoverSound}
                >
                  <span className="relative z-10">Send Message</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div ref={infoRef} className="space-y-8">
              <div>
                <h2
                  className="text-3xl md:text-5xl font-bold mb-8"
                  style={{ fontFamily: "var(--font-skateblade)" }}
                >
                  Connect With Us
                </h2>
                <p className="text-lg text-muted-foreground mb-12">
                  Whether you have a question, a project idea, or just want to say hello, we're here and ready to
                  chat.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  // Button-style card for Schedule a Call
                  if (info.type === "button" && info.href) {
                    return (
                      <a
                        key={index}
                        href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={playHoverSound}
                        className="block group transition-all duration-300 hover:scale-110 hover:-translate-y-2"
                      >
                        <Card
                          className="info-card p-6 bg-background/50 backdrop-blur-sm border-border/50 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-2xl cursor-pointer"
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                              {info.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold mb-3">{info.title}</h3>
                              <div className="inline-block px-4 py-2 bg-white text-black rounded-lg font-medium group-hover:bg-white/90 transition-colors duration-200">
                                {info.value}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </a>
                    );
                  }

                  // Regular card with optional link (for Email)
                  if (info.href) {
                    return (
                      <a
                        key={index}
                        href={info.href}
                        onMouseEnter={playHoverSound}
                        className="block group transition-all duration-300 hover:scale-110 hover:-translate-y-2"
                      >
                        <Card
                          className="info-card p-6 bg-background/50 backdrop-blur-sm border-border/50 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-xl cursor-pointer"
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                              {info.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-1">{info.title}</h3>
                              <p className="text-muted-foreground">{info.value}</p>
                            </div>
                          </div>
                        </Card>
                      </a>
                    );
                  }

                  const CardContent = (
                    <Card
                      className="info-card p-6 bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:shadow-xl group cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{info.title}</h3>
                          <p className="text-muted-foreground">{info.value}</p>
                        </div>
                      </div>
                    </Card>
                  );

                  return <div key={index}>{CardContent}</div>;
                })}
              </div>

              {/* Social Links */}
              <div className="pt-8">
                <h3 className="text-xl font-semibold mb-4">Follow Our Journey</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/star.byte/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHoverSound}
                    className="w-12 h-12 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label="Instagram"
                  >
                    <IconBrandInstagram className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                  </a>
                  <a
                    href="https://threads.com/@star.byte"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHoverSound}
                    className="w-12 h-12 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label="Threads"
                  >
                    <IconBrandThreads className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/starbyte-tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHoverSound}
                    className="w-12 h-12 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label="LinkedIn"
                  >
                    <IconBrandLinkedin className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                  </a>
                  <a
                    href="https://dribbble.com/starbyte-tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playHoverSound}
                    className="w-12 h-12 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label="Dribbble"
                  >
                    <IconBrandDribbble className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
