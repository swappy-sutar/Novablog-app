import { motion } from "framer-motion";

function App() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-3xl font-bold"
    >
      Blog App
    </motion.div>
  );
}

export default App;