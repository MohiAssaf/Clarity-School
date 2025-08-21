import { motion } from "framer-motion";

const HeroIcons = () => {
  const penVariants = {
    initial: {
      pathLength: 0,
      opacity: 0,
      rotate: -12,
    },
    animate: {
      pathLength: 1,
      opacity: 1,
      rotate: -12,
      transition: {
        pathLength: {
          type: "tween",
          duration: 2,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.5,
          delay: 0.5,
        },
      },
    },
    float: {
      opacity: [0.4, 0.8, 0.4],
      scale: [1, 1.1, 1],
      rotate: [-12, -18, -12],
      x: ["-50%", "-60%", "-50%"],
      y: [0, 15, 0],
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* Pen Icon */}
      <motion.div
        className="absolute top-32 left-1/6 -translate-x-1/2"
        variants={penVariants}
        initial="initial"
        animate={["animate", "float"]}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#155dfc"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-pencil-icon lucide-pencil"
        >
          <motion.path
            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
            variants={{
              initial: { pathLength: 0 },
              animate: { pathLength: 1 },
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="m15 5 4 4"
            variants={{
              initial: { pathLength: 0 },
              animate: { pathLength: 1 },
            }}
            transition={{ duration: 0.5, delay: 0 }}
          />
        </svg>
      </motion.div>

      {/* Ruler Icon */}
      <motion.div
        className="absolute top-1/6 right-1/5 translate-x-1/2"
        initial={{ opacity: 0.1, scale: 0.8, rotate: 12 }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
          rotate: [12, 18, 12],
          x: ["50%", "60%", "50%"],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#155dfc"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-ruler-icon lucide-ruler"
        >
          <motion.path
            d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="m14.5 12.5 2-2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="m11.5 9.5 2-2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="m8.5 6.5 2-2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="m17.5 15.5 2-2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
        </svg>
      </motion.div>

      {/* Backpack Icon */}
      <motion.div
        className="absolute top-1/3 left-1/6"
        initial={{ opacity: 0.4, scale: 0.8, rotate: 6 }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [6, 10, 6],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#155dfc"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-backpack-icon lucide-backpack"
        >
          <motion.path
            d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M8 10h8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M8 18h8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0 }}
          />
        </svg>
      </motion.div>

      {/* Notebook Icon */}
      <motion.div
        className="absolute top-[39%] right-1/12"
        initial={{ opacity: 0.4, scale: 0.8, rotate: 6 }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [6, 10, 6],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#155dfc"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-notebook-pen-icon lucide-notebook-pen"
        >
          <motion.path
            d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M2 6h4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M2 10h4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M2 14h4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M2 18h4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default HeroIcons;
