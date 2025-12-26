import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ProjectsCard = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get('https://api.github.com/users/gok24code/repos?sort=updated&direction=desc');
        setRepos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repository data:', error);
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: 'easeInOut', duration: 0.2 },
    },
  };

  if (loading) {
    return <div className="projects-card">Loading projects...</div>;
  }

  return (
    <div className="projects-card">
      <h2>Projects</h2>
      <ul>
        {repos.map(repo => (
          <motion.li
            key={repo.id}
            variants={listItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <h3>{repo.name}</h3>
              <p>{repo.description}</p>
            </a>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsCard;
