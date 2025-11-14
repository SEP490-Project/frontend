import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Target,
  Award,
  Lightbulb,
  Users,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

const AboutUs = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const timeline = [
    { year: "2020", event: "Founded with a vision to revolutionize beauty shopping" },
    { year: "2021", event: "Launched our first beauty blog platform" },
    { year: "2022", event: "Reached 10,000+ satisfied customers" },
    { year: "2023", event: "Expanded to mobile app development" },
    { year: "2024", event: "Became the leading beauty lifestyle platform" },
  ];

  const values = [
    {
      icon: <Target className="w-12 h-12 text-[#fec6d4]" />,
      title: "Quality",
      description:
        "We curate only the finest beauty products and content to ensure exceptional experiences for our users.",
    },
    {
      icon: <Award className="w-12 h-12 text-[#fec6d4]" />,
      title: "Sustainability",
      description:
        "Committed to eco-friendly practices and promoting sustainable beauty choices for a better future.",
    },
    {
      icon: <Lightbulb className="w-12 h-12 text-[#fec6d4]" />,
      title: "Innovation",
      description:
        "Constantly evolving with the latest trends and technology to deliver cutting-edge beauty solutions.",
    },
    {
      icon: <Users className="w-12 h-12 text-[#fec6d4]" />,
      title: "Customer-First",
      description:
        "Your satisfaction is our priority. We listen, adapt, and continuously improve based on your feedback.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/team/ceo.jpg",
      description: "Beauty industry veteran with 10+ years of experience",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/team/cto.jpg",
      description: "Tech innovator passionate about mobile app development",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Content",
      image: "/team/content-head.jpg",
      description: "Expert beauty blogger and content strategist",
    },
    {
      name: "David Park",
      role: "Head of Design",
      image: "/team/design-head.jpg",
      description: "Creative director with a passion for beautiful interfaces",
    },
    {
      name: "Jessica Wu",
      role: "Marketing Director",
      image: "/team/marketing-director.jpg",
      description: "Digital marketing specialist in beauty and lifestyle",
    },
    {
      name: "Alex Thompson",
      role: "Customer Success",
      image: "/team/customer-success.jpg",
      description: "Dedicated to ensuring the best customer experience",
    },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-6 h-6" />, label: "Facebook", href: "#" },
    { icon: <Instagram className="w-6 h-6" />, label: "Instagram", href: "#" },
    { icon: <Twitter className="w-6 h-6" />, label: "Twitter", href: "#" },
    { icon: <Youtube className="w-6 h-6" />, label: "YouTube", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-6 bg-gradient-to-br from-pink-50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="text-center lg:text-left"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1
                  className="text-5xl md:text-7xl font-bold text-[#383838] mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  About <span className="text-[#fec6d4] block">B-ShowSell</span>
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Passion for natural beauty and lifestyle. We're dedicated to bringing you the best
                  beauty insights, tips, and products through our innovative platform.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Button className="bg-[#fec6d4] hover:bg-[#feb2c5] text-[#383838] font-semibold px-8 py-4 rounded-full text-lg">
                    Learn Our Story
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fec6d4] to-[#feb2c5] rounded-3xl blur-3xl opacity-30 scale-110"></div>
                  <img
                    src="/team/team-photo.jpg"
                    alt="B-ShowSell Team"
                    className="relative w-full rounded-3xl shadow-2xl"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#383838] mb-4">Our Story</h2>
              <p className="text-xl text-gray-600">
                The journey of creating the ultimate beauty lifestyle platform
              </p>
            </motion.div>

            <motion.div
              className="relative"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#fec6d4] hidden md:block"></div>
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative flex items-center mb-12 last:mb-0"
                  variants={fadeInUp}
                >
                  <div className="hidden md:block absolute left-6 w-4 h-4 bg-[#fec6d4] rounded-full border-4 border-white shadow-lg"></div>
                  <div className="md:ml-16 bg-white p-6 rounded-2xl shadow-lg w-full">
                    <div className="text-2xl font-bold text-[#fec6d4] mb-2">{item.year}</div>
                    <p className="text-gray-700 text-lg">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-pink-50 to-white">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#383838] mb-4">
                Mission & Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our mission: "To bring beauty insights to everyone." We believe that beauty is
                personal, and everyone deserves access to high-quality advice and products.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <motion.div
                    className="mb-6 flex justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-[#383838] mb-4 group-hover:text-[#fec6d4] transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#383838] mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The passionate individuals behind B-ShowSell, working together to create amazing
                beauty experiences
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-[#383838] mb-2 group-hover:text-[#fec6d4] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[#fec6d4] font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Social CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-[#fec6d4] to-[#feb2c5]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Follow us for updates and inspiration
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Stay connected with us on social media for the latest beauty tips, product launches,
                and behind-the-scenes content
              </p>
              <div className="flex justify-center gap-4 mb-8">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="bg-white text-[#383838] p-4 rounded-full hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
              <Button className="bg-white text-[#383838] hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold">
                Download Our App
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
