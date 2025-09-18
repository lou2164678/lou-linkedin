import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { projectsData, getProjectCategories } from "../data/projects";

// Categories for filtering (derived from data)
const categories = ["All", ...getProjectCategories()];

const Projects = () => {
  const [filter, setFilter] = useState("All");

  // Filter projects based on selected category
  const filteredProjects = filter === "All"
    ? projectsData
    : projectsData.filter(project => project.category === filter);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-6">
            AI Sales Solutions Portfolio
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            A collection of production-ready AI tools demonstrating expertise in sales automation, machine learning, 
            and revenue optimization. Each application showcases practical AI implementation for B2B sales teams, 
            combining 7+ years of sales experience with modern AI technologies to solve real-world business challenges.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                filter === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <Link to={`/projects/${project.id}`} className="block">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/projects/${project.id}`} className="text-xl font-bold text-gray-800 dark:text-white hover:underline">
                    {project.title}
                  </Link>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded">
                    {project.category}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                    Technologies:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Link
                    to={`/projects/${project.id}`}
                    className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                  <a
                    href={project.liveUrl}
                    className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <FaExternalLinkAlt className="mr-2" /> Try Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Projects Found */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No projects found in this category. Please select another category.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Ready to transform your sales process with AI?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            These tools represent proven methodologies for scaling sales operations through intelligent automation. 
            I'm available to discuss implementation strategies, technical integration, and opportunities to drive 
            revenue growth through AI-powered sales solutions.
          </p>
          <Link
            to="/contact"
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;
