"use client"

import { useEffect, useRef, useState } from "react"
import "./App.css"
import { Github, Linkedin, Mail, ExternalLink, ArrowDown, Menu, X } from "lucide-react"
import img  from "./images/profile.jpg"
import logo from "./images/logo.png.webp"
import baate from "./images/baate.webp"
import smart from "./images/smartBudget.webp"
import movementor from "./images/movementor.webp"
import emailjs from "@emailjs/browser"; // Import EmailJS

const projects = [
  {
    id: 1,
    title: "MindSync",
    description: "A habit-tracking web app that helps users build better habits.",
    image: logo, // Image file in the public folder or an external URL
    githubLink: "https://github.com/rawal21/MindSync",
    liveLink: "https://github.com/rawal21/MindSync",
    tags: ["React", "Node.js", "MongoDB" , "socket.io" ,],
  },
  {
    id: 2,
    title: "Movementor",
    description: "A fitness tracking app that analyzes workouts and calories.",
    image: movementor,
    githubLink: "https://github.com/rawal21/MoveMentor",
    liveLink: "https://movementor.netlify.app/",
    tags: ["MERN", "Chart.js", "JWT"],
  },
  {
    id: 3,
    title: "Baate",
    description: "An anonymous chat application where anyone can join and connect without the hassle of signing up or logging in.",
    image: baate,
    githubLink: "https://github.com/rawal21/baate_chat_application",
    liveLink: "https://baate-chat-application.onrender.com",
    tags: ["WebSockets", "Express", "MongoDB"],
  },
  {
    id: 4,
    title: "FineTech",
    description: "Smart budget and expanse tracking app that helps users manage their finances.",
    image: smart,
    githubLink: "https://github.com/rawal21/FineTeck",
    liveLink: "https://github.com/rawal21/FineTeck",
    tags: ["React", "nodejs", "express" , "mongodb" , ], 
  },
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const typingRef = useRef(null)
  const sections = useRef([])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // EmailJS parameters
    const emailParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    try {
      await emailjs.send(
        "service_38f6lcp", // Enclose your service ID in quotes
        "template_yx8uq29", // Enclose your template ID in quotes
        emailParams,
        "fNl4QSewzyTSkw46E" // Enclose your public key in quotes
      );
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" }); // Clear form after submission
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  // Typing effect
  useEffect(() => {
    if (!typingRef.current) return

    const texts = ["Full Stack Developer", "React Native Enthusiast "]
    let textIndex = 0
    let charIndex = 0
    let isDeleting = false
    let typingSpeed = 100

    const type = () => {
      const currentText = texts[textIndex]

      if (isDeleting) {
        typingRef.current.textContent = currentText.substring(0, charIndex - 1)
        charIndex--
        typingSpeed = 50
      } else {
        typingRef.current.textContent = currentText.substring(0, charIndex + 1)
        charIndex++
        typingSpeed = 150
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true
        typingSpeed = 1500 // Pause at the end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        textIndex = (textIndex + 1) % texts.length
        typingSpeed = 500 // Pause before typing next
      }

      setTimeout(type, typingSpeed)
    }

    setTimeout(type, 1000)
  }, [])

  // Intersection Observer for animations and active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    }

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animation class
          entry.target.classList.add("animate")

          // Update active section
          const id = entry.target.id
          if (id) setActiveSection(id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)

    // Observe all sections
    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section)
      if (section.id) sections.current.push(section)
    })

    return () => observer.disconnect()
  }, [])

  // Particle background
  useEffect(() => {
    const canvas = document.getElementById("particles")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const particleCount = 100

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.color = `rgba(100, 149, 237, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width

        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      // Connect particles with lines
      connectParticles()

      requestAnimationFrame(animate)
    }

    const connectParticles = () => {
      const maxDistance = 150
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            ctx.strokeStyle = `rgba(100, 149, 237, ${opacity * 0.2})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    init()
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="container">
      <canvas id="particles" className="particles"></canvas>

      <header className="header">
        <div className="logo">
          <a href="#home">DK</a>
        </div>

        <button className="menuButton" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav ${isMenuOpen ? "navOpen" : ""}`}>
          <a href="#home" className={`navLink ${activeSection === "home" ? "active" : ""}`} onClick={closeMenu}>
            Home
          </a>
          <a href="#about" className={`navLink ${activeSection === "about" ? "active" : ""}`} onClick={closeMenu}>
            About
          </a>
          <a href="#projects" className={`navLink ${activeSection === "projects" ? "active" : ""}`} onClick={closeMenu}>
            Projects
          </a>
          <a href="#skills" className={`navLink ${activeSection === "skills" ? "active" : ""}`} onClick={closeMenu}>
            Skills
          </a>
          <a href="#contact" className={`navLink ${activeSection === "contact" ? "active" : ""}`} onClick={closeMenu}>
            Contact
          </a>
        </nav>
      </header>

      <section id="home" className="hero section">
        <div className="heroContent">
          <h1 className="heroTitle">
            <span className="greeting">Hello, I'm</span>
            <span className="name">Dikshit Kumar</span>
            <span className="title">
              I'm a <span ref={typingRef} className="typingText"></span>
              <span className="cursor">|</span>
            </span>
          </h1>
          <p className="heroText">I build exceptional and accessible digital experiences for the web.</p>
          <div className="heroCta">
            <a href="#projects" className="primaryButton">
              <span>View My Work</span>
              <span className="buttonHighlight"></span>
            </a>
            <a href="#contact" className="secondaryButton">
              Contact Me
            </a>
          </div>
        </div>
        <div className="heroImage">
          <div className="imageWrapper">
            <img src={img} alt="John Doe" style={{width : "20rem" , height :"21rem"}} />
          </div>
        </div>
        <div className="scrollDown">
          <a href="#about">
            <ArrowDown className="scrollIcon" />
          </a>
        </div>
      </section>

      <section id="about" className="about section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">About Me</h2>
          <div className="underline"></div>
        </div>
        <div className="aboutContent">
          {/* <div className="aboutImage">
            <img src="https://via.placeholder.com/400x500" alt="About John Doe" width="400" height="500" />
          </div> */}
          <div className="aboutText">
            <h3 className="aboutSubtitle">Who am I?</h3>
            <p>
            I am a highly skilled Full-Stack Developer with over 1 year
of experience in using the MERN stack, Java, Python,
AI/ML, and Cloud Technologies
            </p>
            <p>
            My expertise lies in
creating scalable, efficient, and user- centric web
applications.
            </p>
            <p> I possess strong analytical and problemsolving capabilities, evidenced by my success in
hackathons and various industry projects. I am
passionate about employing AI-driven solutions to tackle
real-world challenges.</p>
            <div className="aboutCta">
              <a href="/resume.pdf" className="secondaryButton">
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="projects section">
      <div className="sectionHeader">
        <h2 className="sectionTitle">My Projects</h2>
        <div className="underline"></div>
      </div>
      <div className="projectsGrid">
        {projects.map((project) => (
          <div key={project.id} className="projectCard">
            <div className="projectImage">
              <img
                src={project.image}
                alt={project.title}
                width="450"
                height="250"
              />
              <div className="projectOverlay">
                <div className="projectLinks">
                  <a href={project.githubLink} className="projectLink" target="_blank" rel="noopener noreferrer">
                    <Github size={24} />
                  </a>
                  <a href={project.liveLink} className="projectLink" target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={24} />
                  </a>
                </div>
              </div>
            </div>
            <div className="projectContent">
              <h3 className="projectTitle">{project.title}</h3>
              <p className="projectDescription">{project.description}</p>
              <div className="projectTags">
                {project.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

      <section id="skills" className="skills section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">My Skills</h2>
          <div className="underline"></div>
        </div>
        <div className="skillsContent">
          <div className="skillCategory">
            <h3 className="categoryTitle">Frontend</h3>
            <div className="skillsGrid">
              {[
                { name: "HTML5", level: 90 },
                { name: "CSS", level: 85 },
                { name: "JavaScript", level: 90 },
                { name: "React", level: 90 },
                { name: "bootstrap", level: 80 },
                { name: "Tailwind css", level: 75 },
              ].map((skill) => (
                <div key={skill.name} className="skillItem">
                  <div className="skillInfo">
                    <p className="skillName">{skill.name}</p>
                    <p className="skillLevel">{skill.level}%</p>
                  </div>
                  <div className="skillBar">
                    <div className="skillProgress" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="skillCategory">
            <h3 className="categoryTitle">Backend</h3>
            <div className="skillsGrid">
              {[
                { name: "Node.js", level: 80 },
                { name: "Express", level: 75 },
                { name: "MongoDB", level: 85 },
                { name: "MySql", level: 70 },
                { name: "REST API", level: 90 },
              
              ].map((skill) => (
                <div key={skill.name} className="skillItem">
                  <div className="skillInfo">
                    <p className="skillName">{skill.name}</p>
                    <p className="skillLevel">{skill.level}%</p>
                  </div>
                  <div className="skillBar">
                    <div className="skillProgress" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact section">
      <div className="sectionHeader">
        <h2 className="sectionTitle">Get In Touch</h2>
        <div className="underline"></div>
      </div>
      <div className="contactContent">
        <div className="contactInfo">
          <h3 className="contactSubtitle">Get inTouch</h3>
          <p className="contactText">
            I'm interested in freelance opportunities – especially ambitious or large projects. However, if you have
            other requests or questions, don't hesitate to contact me.
          </p>
          <div className="contactDetails">
            <div className="contactItem">
              <Mail className="contactIcon" />
              <p>dikshitrawal923@gmail.com</p>
            </div>
            <div className="contactItem">
              <Linkedin className="contactIcon" />
              <p>linkedin.com/in/dikshitRawal</p>
            </div>
            <div className="contactItem">
              <Github className="contactIcon" />
              <p>github.com/rawal21</p>
            </div>
          </div>
        </div>
        <form className="contactForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="name" className="formLabel">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="formInput"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="email" className="formLabel">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="formInput"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="message" className="formLabel">
              Message
            </label>
            <textarea
              id="message"
              className="formTextarea"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submitButton">
            <span>Send Message</span>
            <span className="buttonHighlight"></span>
          </button>
        </form>
      </div>
    </section>

      <footer className="footer">
        <div className="footerContent">
          <p className="copyright">© {new Date().getFullYear()} DikshitKumar. All Rights Reserved.</p>
          <div className="socialLinks">
            <a href="#" className="socialLink" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="#" className="socialLink" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#" className="socialLink" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

