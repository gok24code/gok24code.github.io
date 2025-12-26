import React from 'react';
import { motion } from 'framer-motion';
import ProfileCard from './components/ProfileCard';
import ProjectsCard from './components/ProjectsCard';
import './App.css';

function App() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: "easeInOut",
        duration: 0.2
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      className="main-portfolio-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants}>Göktuğ's Portfolio</motion.h1>
      <motion.div className="cards-wrapper" variants={itemVariants}>
        <ProfileCard />
        <ProjectsCard />
      </motion.div>
    </motion.div>
  );
}

export default App;
