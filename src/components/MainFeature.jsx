import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Calendar, 
  Flag, 
  Trash2, 
  Plus, 
  X, 
  Edit3, 
  AlertTriangle 
} from "lucide-react";

const MainFeature = ({ categories, selectedCategory, updateStats }) => {
  // Initialize with some sample tasks
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: "1",
        title: "Complete project proposal",
        description: "Finish the draft and send for review",
        dueDate: "2023-12-25",
        priority: "high",
        status: "pending",
        categoryId: "2", // Work
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Go for a 30-minute run",
        description: "Morning jog in the park",
        dueDate: "2023-12-20",
        priority: "medium",
        status: "completed",
        categoryId: "3", // Health
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Buy groceries",
        description: "Milk, eggs, bread, and vegetables",
        dueDate: "2023-12-18",
        priority: "low",
        status: "pending",
        categoryId: "1", // Personal
        createdAt: new Date().toISOString(),
      }
    ];
  });
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    categoryId: "1"
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateStats(tasks);
  }, [tasks, updateStats]);
  
  // Filter tasks based on selected category
  const filteredTasks = tasks.filter(task => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "completed") return task.status === "completed";
    if (selectedCategory === "pending") return task.status === "pending";
    if (selectedCategory === "overdue") {
      const dueDate = new Date(task.dueDate);
      return task.status !== "completed" && dueDate < new Date();
    }
    return task.categoryId === selectedCategory;
  });
  
  // Sort tasks: first by status (pending first), then by due date (closest first)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by status (pending first)
    if (a.status === "pending" && b.status === "completed") return -1;
    if (a.status === "completed" && b.status === "pending") return 1;
    
    // Then sort by due date (closest first)
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!newTask.title.trim()) {
      errors.title = "Title is required";
    }
    
    if (!newTask.dueDate) {
      errors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(newTask.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.dueDate = "Due date cannot be in the past";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editingTaskId) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTaskId 
          ? { 
              ...task, 
              ...newTask, 
              updatedAt: new Date().toISOString() 
            } 
          : task
      ));
      setEditingTaskId(null);
    } else {
      // Add new task
      const newTaskObj = {
        id: Date.now().toString(),
        ...newTask,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      
      setTasks(prev => [...prev, newTaskObj]);
    }
    
    // Reset form
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      categoryId: "1"
    });
    
    setIsFormOpen(false);
  };
  
  const handleDelete = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };
  
  const handleStatusToggle = (id) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const newStatus = task.status === "completed" ? "pending" : "completed";
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === "completed" ? new Date().toISOString() : null
        };
      }
      return task;
    }));
  };
  
  const handleEdit = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      categoryId: task.categoryId
    });
    
    setEditingTaskId(task.id);
    setIsFormOpen(true);
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-accent";
      case "medium": return "text-primary";
      case "low": return "text-secondary";
      default: return "text-surface-500";
    }
  };
  
  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id) || { name: "Uncategorized", color: "#94a3b8" };
  };
  
  const isTaskOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() ? "text-accent" : "";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {selectedCategory === "all" ? "All Tasks" : 
           selectedCategory === "completed" ? "Completed Tasks" :
           selectedCategory === "pending" ? "Pending Tasks" :
           selectedCategory === "overdue" ? "Overdue Tasks" :
           getCategoryById(selectedCategory).name + " Tasks"}
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsFormOpen(true);
            setEditingTaskId(null);
            setNewTask({
              title: "",
              description: "",
              dueDate: "",
              priority: "medium",
              categoryId: "1"
            });
            setFormErrors({});
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Task
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingTaskId ? "Edit Task" : "Add New Task"}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="title">
                  Task Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  className={`input ${formErrors.title ? "border-accent" : ""}`}
                  placeholder="What needs to be done?"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-accent">{formErrors.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  placeholder="Add details about this task..."
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="dueDate">
                    Due Date*
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    className={`input ${formErrors.dueDate ? "border-accent" : ""}`}
                  />
                  {formErrors.dueDate && (
                    <p className="mt-1 text-sm text-accent">{formErrors.dueDate}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="priority">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="categoryId">
                    Category
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={newTask.categoryId}
                    onChange={handleInputChange}
                    className="input"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingTaskId ? "Update Task" : "Add Task"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {sortedTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-8 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
              <Clock size={32} className="text-surface-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No tasks found</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-4">
              {selectedCategory === "all" 
                ? "You don't have any tasks yet. Add your first task to get started!"
                : selectedCategory === "completed"
                ? "You haven't completed any tasks yet. Keep going!"
                : selectedCategory === "pending"
                ? "No pending tasks. You're all caught up!"
                : selectedCategory === "overdue"
                ? "Great! You don't have any overdue tasks."
                : `No tasks in the ${getCategoryById(selectedCategory).name} category.`
              }
            </p>
            {selectedCategory !== "all" && (
              <button 
                onClick={() => setSelectedCategory("all")}
                className="btn btn-outline"
              >
                View All Tasks
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {sortedTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className={`task-item-neu ${
                  task.priority === "high" 
                    ? "task-priority-high" 
                    : task.priority === "medium" 
                    ? "task-priority-medium" 
                    : "task-priority-low"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button 
                    onClick={() => handleStatusToggle(task.id)}
                    className="mt-1 flex-shrink-0 transition-colors"
                    aria-label={task.status === "completed" ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.status === "completed" ? (
                      <CheckCircle className="text-secondary" size={22} />
                    ) : (
                      <Circle className="text-surface-400 hover:text-primary" size={22} />
                    )}
                  </button>
                  
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`text-lg font-medium ${task.status === "completed" ? "line-through text-surface-400" : ""}`}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className={`mt-1 text-surface-600 dark:text-surface-400 ${task.status === "completed" ? "line-through" : ""}`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(task)}
                          className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                          aria-label="Edit task"
                        >
                          <Edit3 size={16} className="text-surface-500" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(task.id)}
                          className="p-1.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
                          aria-label="Delete task"
                        >
                          <Trash2 size={16} className="text-surface-500 hover:text-accent" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className={`${isTaskOverdue(task.dueDate)}`} />
                        <span className={`${isTaskOverdue(task.dueDate)}`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        
                        {new Date(task.dueDate) < new Date() && task.status !== "completed" && (
                          <span className="ml-1 text-accent flex items-center gap-0.5">
                            <AlertTriangle size={12} />
                            Overdue
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Flag size={14} className={getPriorityColor(task.priority)} />
                        <span className="capitalize">{task.priority}</span>
                      </div>
                      
                      <div 
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{ 
                          backgroundColor: `${getCategoryById(task.categoryId).color}20`,
                          color: getCategoryById(task.categoryId).color
                        }}
                      >
                        {getCategoryById(task.categoryId).name}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MainFeature;