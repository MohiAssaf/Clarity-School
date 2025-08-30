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

      {/* Book Icon */}
      <motion.div
        className="absolute bottom-1/4 left-1/4 -translate-x-1/2"
        initial={{ opacity: 0.4, scale: 0.8, rotate: -6 }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
          y: [0, -10, 0],
          x: [0, 5, 0],
          rotate: [-6, -12, -6],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#155dfc"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-book-icon lucide-book"
        >
          <motion.path
            d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
        </svg>
      </motion.div>

      {/* Calculator Icon */}
      <motion.div
        className="absolute bottom-10 right-1/6"
        initial={{ opacity: 0.4, scale: 0.8, rotate: 10 }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
          y: [0, 20, 0],
          x: [0, -10, 0],
          rotate: [10, 15, 10],
        }}
        transition={{
          duration: 11,
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
          className="lucide lucide-calculator-icon lucide-calculator"
        >
          <motion.rect
            width="16"
            height="20"
            x="4"
            y="2"
            rx="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
          <motion.line
            x1="8"
            x2="16"
            y1="6"
            y2="6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.line
            x1="16"
            x2="16"
            y1="14"
            y2="18"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M16 10h.01"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.1, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M12 10h.01"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.1, ease: "easeInOut", delay: 0.1 }}
          />
          <motion.path
            d="M8 10h.01"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.1, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.path
            d="M12 14h.01"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.1, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.path
            d="M8 14h.01"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.1, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.path
            d="M12 18h.01"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.1, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path
            d="M8 18h.01"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.1, ease: "easeInOut", delay: 0.6 }}
          />
        </svg>
      </motion.div>

      {/* Graduation Cap Icon */}
      <motion.div
        className="absolute top-[55%] left-[10%]"
        initial={{ opacity: 0.4, scale: 0.8, rotate: -20 }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
          y: [0, 15, 0],
          x: [0, -5, 0],
          rotate: [-20, -25, -20],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="110"
          height="110"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#155dfc"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-graduation-cap-icon lucide-graduation-cap"
        >
          <motion.path
            d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M22 10v6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 1 }}
          />
          <motion.path
            d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 1.5 }}
          />
        </svg>
      </motion.div>

      {/* Globe Icon */}
      <motion.div
        className="absolute top-[20%] right-[30%]"
        initial={{ opacity: 0.4, scale: 0.8, rotate: 0 }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
          y: [0, 10, 0],
          x: [0, 5, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#155dfc"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-earth-icon lucide-earth"
        >
          <motion.path
            d="M21.54 15H17a2 2 0 0 0-2 2v4.54"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path
            d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }}
          />
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
        </svg>
      </motion.div>

      {/* Book Open Icon */}
      <motion.div
        className="absolute top-[65%] right-[25%]"
        initial={{ opacity: 0.4, scale: 0.8, rotate: 15 }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
          y: [0, -10, 0],
          x: [0, 10, 0],
          rotate: [15, 20, 15],
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
          width="90"
          height="90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#155dfc"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-book-open-icon lucide-book-open"
        >
          <motion.path
            d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* Microscope Icon */}
      <motion.div
        className="absolute bottom-[2%] left-[45%]"
        initial={{ opacity: 0.4, scale: 0.8, rotate: -8 }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
          y: [0, -15, 0],
          x: [0, 5, 0],
          rotate: [-8, -13, -8],
        }}
        transition={{
          duration: 12,
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
          className="lucide lucide-microscope-icon lucide-microscope"
        >
          <motion.path
            d="M6 18h8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M3 22h18"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.path
            d="M14 22a7 7 0 1 0 0-14h-1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M9 14h2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path
            d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.7 }}
          />
          <motion.path
            d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
          />
        </svg>
      </motion.div>

      {/* School Icon */}
      <motion.div
        className="absolute top-[5%] left-[45%]"
        initial={{ opacity: 0.4, scale: 0.8, rotate: 10 }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.1, 1],
          y: [0, -10, 0],
          x: [0, 5, 0],
          rotate: [10, 15, 10],
        }}
        transition={{
          duration: 15,
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
          className="lucide lucide-school-icon lucide-school"
        >
          <motion.path
            d="M14 21v-3a2 2 0 0 0-4 0v3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M18 5v16"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
          />
          <motion.path
            d="M6 5v16"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
          <motion.circle
            cx="12"
            cy="9"
            r="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0 }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default HeroIcons;
