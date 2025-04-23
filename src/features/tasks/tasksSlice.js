import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apperService from '../../services/apperService';
import { TABLES, FIELDS } from '../../utils/tableSchema';

const initialState = {
  tasks: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentTask: null,
  filteredTasks: [],
  filterCriteria: {
    status: null,
    priority: null,
    searchTerm: '',
    projectId: null
  }
};

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      // Define fields to retrieve based on schema
      const fields = [
        FIELDS.TASK.ID,
        FIELDS.TASK.NAME,
        FIELDS.TASK.TITLE,
        FIELDS.TASK.DESCRIPTION,
        FIELDS.TASK.STATUS,
        FIELDS.TASK.PRIORITY,
        FIELDS.TASK.DUE_DATE,
        FIELDS.TASK.ASSIGNEE,
        FIELDS.TASK.TAGS,
        'CreatedOn',
        'ModifiedOn',
        'CreatedBy',
        'Owner'
      ];
      
      const tasks = await apperService.fetchRecords(TABLES.TASK, {
        fields,
        orderBy: [{ field: 'CreatedOn', direction: 'desc' }]
      });
      
      return tasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch tasks with filter criteria
export const fetchFilteredTasks = createAsyncThunk(
  'tasks/fetchFilteredTasks',
  async (filterCriteria, { rejectWithValue }) => {
    try {
      // Define fields to retrieve based on schema
      const fields = [
        FIELDS.TASK.ID,
        FIELDS.TASK.NAME,
        FIELDS.TASK.TITLE,
        FIELDS.TASK.DESCRIPTION,
        FIELDS.TASK.STATUS,
        FIELDS.TASK.PRIORITY,
        FIELDS.TASK.DUE_DATE,
        FIELDS.TASK.ASSIGNEE,
        FIELDS.TASK.TAGS,
        'CreatedOn',
        'ModifiedOn',
        'CreatedBy',
        'Owner'
      ];
      
      // Build filter conditions
      const conditions = [];
      
      if (filterCriteria.status) {
        conditions.push({
          field: FIELDS.TASK.STATUS,
          operator: "Equal",
          value: filterCriteria.status
        });
      }
      
      if (filterCriteria.priority) {
        conditions.push({
          field: FIELDS.TASK.PRIORITY,
          operator: "Equal",
          value: filterCriteria.priority
        });
      }
      
      if (filterCriteria.searchTerm) {
        conditions.push({
          field: FIELDS.TASK.TITLE,
          operator: "Contains",
          value: filterCriteria.searchTerm
        });
      }
      
      const params = {
        fields,
        orderBy: [{ field: 'CreatedOn', direction: 'desc' }]
      };
      
      // Only add filter if there are conditions
      if (conditions.length > 0) {
        params.filter = {
          conditions,
          logicalOperator: "And"
        };
      }
      
      const tasks = await apperService.fetchRecords(TABLES.TASK, params);
      
      return { tasks, filterCriteria };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch a single task by ID
export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId, { rejectWithValue }) => {
    try {
      // Define fields to retrieve based on schema
      const fields = [
        FIELDS.TASK.ID,
        FIELDS.TASK.NAME,
        FIELDS.TASK.TITLE,
        FIELDS.TASK.DESCRIPTION,
        FIELDS.TASK.STATUS,
        FIELDS.TASK.PRIORITY,
        FIELDS.TASK.DUE_DATE,
        FIELDS.TASK.ASSIGNEE,
        FIELDS.TASK.TAGS,
        'CreatedOn',
        'ModifiedOn',
        'CreatedBy',
        'Owner'
      ];
      
      const params = {
        fields,
        filter: {
          conditions: [
            {
              field: FIELDS.TASK.ID,
              operator: "Equal",
              value: taskId
            }
          ],
          logicalOperator: "And"
        }
      };
      
      const tasks = await apperService.fetchRecords(TABLES.TASK, params);
      
      if (tasks && tasks.length > 0) {
        return tasks[0];
      }
      
      throw new Error('Task not found');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      // Transform taskData to match the expected schema
      const record = {
        [FIELDS.TASK.TITLE]: taskData.title,
        [FIELDS.TASK.NAME]: taskData.title, // Set Name field to title for display
        [FIELDS.TASK.DESCRIPTION]: taskData.description,
        [FIELDS.TASK.STATUS]: taskData.status,
        [FIELDS.TASK.PRIORITY]: taskData.priority,
        [FIELDS.TASK.DUE_DATE]: taskData.dueDate,
        [FIELDS.TASK.TAGS]: taskData.tags
      };
      
      // Add assignee if provided
      if (taskData.assignee) {
        record[FIELDS.TASK.ASSIGNEE] = taskData.assignee;
      }
      
      const createdTask = await apperService.createRecord(TABLES.TASK, record);
      return createdTask;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      // Transform taskData to match the expected schema
      const record = {
        [FIELDS.TASK.TITLE]: taskData.title,
        [FIELDS.TASK.NAME]: taskData.title, // Update Name field to match title
        [FIELDS.TASK.DESCRIPTION]: taskData.description,
        [FIELDS.TASK.STATUS]: taskData.status,
        [FIELDS.TASK.PRIORITY]: taskData.priority,
        [FIELDS.TASK.DUE_DATE]: taskData.dueDate,
        [FIELDS.TASK.TAGS]: taskData.tags
      };
      
      // Add assignee if provided
      if (taskData.assignee !== undefined) {
        record[FIELDS.TASK.ASSIGNEE] = taskData.assignee;
      }
      
      const updatedTask = await apperService.updateRecord(TABLES.TASK, taskId, record);
      return updatedTask;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await apperService.deleteRecord(TABLES.TASK, taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    setFilterCriteria: (state, action) => {
      state.filterCriteria = {
        ...state.filterCriteria,
        ...action.payload
      };
    },
    clearFilterCriteria: (state) => {
      state.filterCriteria = {
        status: null,
        priority: null,
        searchTerm: '',
        projectId: null
      };
      state.filteredTasks = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks cases
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
        // Reset filtered tasks when all tasks are fetched
        state.filteredTasks = [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch tasks';
      })
      
      // Fetch filtered tasks cases
      .addCase(fetchFilteredTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFilteredTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.filteredTasks = action.payload.tasks;
        state.filterCriteria = action.payload.filterCriteria;
      })
      .addCase(fetchFilteredTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch filtered tasks';
      })
      
      // Fetch task by ID cases
      .addCase(fetchTaskById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch task';
      })
      
      // Create task cases
      .addCase(createTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create task';
      })
      
      // Update task cases
      .addCase(updateTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.tasks.findIndex(task => task.Id === action.payload.Id);
        if (index !== -1) {
          // Update task in array
          state.tasks[index] = action.payload;
        }
        
        // Update in filtered tasks if present
        const filteredIndex = state.filteredTasks.findIndex(task => task.Id === action.payload.Id);
        if (filteredIndex !== -1) {
          state.filteredTasks[filteredIndex] = action.payload;
        }
        
        // Update current task if it's the one being edited
        if (state.currentTask && state.currentTask.Id === action.payload.Id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update task';
      })
      
      // Delete task cases
      .addCase(deleteTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove the deleted task from state
        state.tasks = state.tasks.filter(task => task.Id !== action.payload);
        
        // Remove from filtered tasks if present
        state.filteredTasks = state.filteredTasks.filter(task => task.Id !== action.payload);
        
        // Clear current task if it was the one deleted
        if (state.currentTask && state.currentTask.Id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete task';
      });
  }
});

export const { 
  setCurrentTask, 
  clearCurrentTask,
  setFilterCriteria,
  clearFilterCriteria
} = tasksSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks.tasks;
export const selectFilteredTasks = (state) => 
  state.tasks.filteredTasks.length > 0 ? state.tasks.filteredTasks : state.tasks.tasks;
export const selectTaskById = (state, taskId) => 
  state.tasks.tasks.find(task => task.Id === taskId);
export const selectCurrentTask = (state) => state.tasks.currentTask;
export const selectTasksStatus = (state) => state.tasks.status;
export const selectTasksError = (state) => state.tasks.error;
export const selectFilterCriteria = (state) => state.tasks.filterCriteria;

// Selector for tasks by status
export const selectTasksByStatus = (state, status) => 
  state.tasks.tasks.filter(task => task[FIELDS.TASK.STATUS] === status);

// Selector for tasks by priority
export const selectTasksByPriority = (state, priority) => 
  state.tasks.tasks.filter(task => task[FIELDS.TASK.PRIORITY] === priority);

export default tasksSlice.reducer;