import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description }) => {
  const featureItemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="relative p-6 rounded-2xl transition-all duration-300 bg-gray-50 shadow-md"
      variants={featureItemVariants}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <dt className="text-xl font-semibold leading-7 text-gray-900 flex items-center gap-4">
        <motion.div
          className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-800 text-white shadow-lg"
          variants={iconVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
        >
          <Icon className="h-8 w-8" />
        </motion.div>
        {title}
      </dt>
      <dd className="mt-2 text-base leading-7 text-gray-600">{description}</dd>
    </motion.div>
  );
};

export default FeatureCard;
