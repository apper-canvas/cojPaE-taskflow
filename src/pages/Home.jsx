import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainFeature from "../components/MainFeature";

const Home = () => {
  const [categories, setCategories] = useState([
    { id: "1", name: "Personal", color: "#6366f1" },
    { id: "2", name: "Work", color: "#14b8a6" },
    { id: "3", name: "Health", color: "#f43f5e" },
    { id: "4", name: "Learning", color: "#f59e0b" }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  
  // Update stats when tasks change (handled in MainFeature)
  const updateStats = (tasks) => {
    const now = new Date();
    
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "completed").length;
    const pending = tasks.filter(task => task.status === "pending").length;
    const overdue = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return task.status !== "completed" && dueDate < now;
    }).length;
    
    setStats({ total, completed, pending, overdue });
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="mb-6">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary text-gradient"
        >
          Welcome to TaskFlow
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2 } }}
          className="text-surface-600 dark:text-surface-300"
        >
          Organize your tasks, boost your productivity
        </motion.p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="card p-4 flex flex-col items-center justify-center"
        >
          <span className="text-3xl font-bold text-primary">{stats.total}</span>
          <span className="text-surface-500 dark:text-surface-400">Total Tasks</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="card p-4 flex flex-col items-center justify-center"
        >
          <span className="text-3xl font-bold text-secondary">{stats.completed}</span>
          <span className="text-surface-500 dark:text-surface-400">Completed</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
          className="card p-4 flex flex-col items-center justify-center"
        >
          <span className="text-3xl font-bold text-primary-light">{stats.pending}</span>
          <span className="text-surface-500 dark:text-surface-400">Pending</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
          className="card p-4 flex flex-col items-center justify-center"
        >
          <span className="text-3xl font-bold text-accent">{stats.overdue}</span>
          <span className="text-surface-500 dark:text-surface-400">Overdue</span>
        </motion.div>
      </section>

      <section className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <div className="card p-4 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            
            <ul className="space-y-2">
              <motion.li 
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory("all")}
                className={`cursor-pointer p-2 rounded-lg transition-all ${
                  selectedCategory === "all" 
                    ? "bg-primary/10 dark:bg-primary/20 font-medium" 
                    : "hover:bg-surface-100 dark:hover:bg-surface-700"
                }`}
              >
                All Tasks
              </motion.li>
              
              {categories.map(category => (
                <motion.li 
                  key={category.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`cursor-pointer p-2 rounded-lg transition-all flex items-center gap-2 ${
                    selectedCategory === category.id 
                      ? "bg-primary/10 dark:bg-primary/20 font-medium" 
                      : "hover:bg-surface-100 dark:hover:bg-surface-700"
                  }`}
                >
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></span>
                  {category.name}
                </motion.li>
              ))}
            </ul>
            
            <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-medium mb-2">Task Status</h3>
              <ul className="space-y-2">
                <motion.li 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory("completed")}
                  className={`cursor-pointer p-2 rounded-lg transition-all ${
                    selectedCategory === "completed" 
                      ? "bg-primary/10 dark:bg-primary/20 font-medium" 
                      : "hover:bg-surface-100 dark:hover:bg-surface-700"
                  }`}
                >
                  Completed
                </motion.li>
                <motion.li 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory("pending")}
                  className={`cursor-pointer p-2 rounded-lg transition-all ${
                    selectedCategory === "pending" 
                      ? "bg-primary/10 dark:bg-primary/20 font-medium" 
                      : "hover:bg-surface-100 dark:hover:bg-surface-700"
                  }`}
                >
                  Pending
                </motion.li>
                <motion.li 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory("overdue")}
                  className={`cursor-pointer p-2 rounded-lg transition-all ${
                    selectedCategory === "overdue" 
                      ? "bg-primary/10 dark:bg-primary/20 font-medium" 
                      : "hover:bg-surface-100 dark:hover:bg-surface-700"
                  }`}
                >
                  Overdue
                </motion.li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="md:w-3/4">
          <MainFeature 
            categories={categories} 
            selectedCategory={selectedCategory}
            updateStats={updateStats}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;