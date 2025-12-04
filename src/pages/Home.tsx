import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaDownload, FaEye } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Resume Style */}
      <section className="py-8 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Mobile Hero */}
          <div className="md:hidden text-center mb-8">
            <div className="bg-gray-200 dark:bg-gray-700 h-48 w-48 rounded-full mx-auto mb-6 overflow-hidden">
              <img
                src="/images/profile.png"
                alt="Louis Amelio Sergiacomi"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Louis Amelio Sergiacomi
            </h1>
            <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
              B2B Sales & Account Management Expert | AI & Technology Advocate | Revenue Growth Specialist
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Dynamic Sales Professional with over 7 years of experience in business sales, account management, and customer service. Expert in B2B sales, upselling, cross-selling, and technical support.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Passionate about leveraging AI and technology to drive sales and customer engagement. Currently serving as Sales Lead Manager at Bimbo Bakeries USA, developing strategic growth plans and mentoring sales teams.
            </p>

            {/* CTA Button */}
            <div className="mb-8">
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                View full resume
              </button>
            </div>
          </div>

          {/* Desktop Hero */}
          <div className="hidden md:flex items-center space-x-10">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                Hi, I'm <span className="text-blue-600 dark:text-blue-400">Louis Amelio Sergiacomi</span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-6">
                B2B Sales & Account Management Expert | AI & Technology Advocate | Revenue Growth Specialist
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Dynamic Sales Professional with over 7 years of experience in business sales, account management, and customer service. Expert in B2B sales, upselling, cross-selling, and technical support. Passionate about leveraging AI and technology to drive sales and customer engagement.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/projects"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center"
                >
                  View Portfolio
                  <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  Contact Me
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="w-80"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-gray-200 dark:bg-gray-700 h-80 rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/images/profile.png"
                  alt="Louis Amelio Sergiacomi"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Current Projects Section */}
      <section className="py-8 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Current Projects
          </h2>

          <div className="space-y-4">
            {[
              { id: 1, title: "Prospect Vetting Assistant", description: "Real-time prospect research assistant that streams structured Gemini briefings through OpenRouter", link: "/prospect" },
              { id: 2, title: "Objection Knowledge Base", description: "AI-powered objection handling system using RAG to provide contextual responses", link: "/objections" },
              { id: 3, title: "AI Interview Pack Generator", description: "Turn a short role query into a structured, JSON-based interview prep pack", link: "/interview-pack" },
              { id: 4, title: "Commission Forecaster", description: "Model your earnings with what-if scenarios and visualize your path to quota", link: "/commission" }
            ].map((item) => (
              <motion.div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item.id * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                      {item.description}
                    </p>
                  </div>
                  <Link
                    to={item.link}
                    className="ml-4 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <FaArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-8 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Expertise
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-blue-600 dark:text-blue-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">AI</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">3 years</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-blue-600 dark:text-blue-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">B2B Sales</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">7 years</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-blue-600 dark:text-blue-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">SaaS</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">3 years</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-blue-600 dark:text-blue-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Sales</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">12 years</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2">
              <div className="text-blue-600 dark:text-blue-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Account Management</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">7 years</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-8 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Experience
          </h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sales Lead Manager</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Bimbo Bakeries USA</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Dec 2021 - Present</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Developing strategic growth plans and mentoring sales teams. Creating store-level growth plans tied to zone objectives and executing growth opportunities for strategic brands.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Business Sales</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">GoDaddy</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Sep 2020 - Nov 2021</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Led team in highest dollar value premium domain sales. Specialized in upselling and cross-selling to upgrade client performance while providing exceptional technical support.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Account Executive</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Yelp</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Mar 2019 - Mar 2020</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Achieved 166% quota performance through strategic campaign optimization. Maintained 40% close rate and exceeded KPI targets across 4 separate months.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Insurance Broker</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">HealthPlanOne</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Aug 2018 - Mar 2019</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  AHIP Certified across 11 states. Consistently exceeded monthly sales targets through effective client consultations and cross-selling strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;