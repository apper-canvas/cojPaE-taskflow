import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apperService from '../../services/apperService';
import { TABLES, FIELDS } from '../../utils/tableSchema';

const initialState = {
  projects: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentProject: null
};

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      // Define fields to retrieve based on schema
      const fields = [
        FIELDS.PROJECT.ID,
        FIELDS.PROJECT.NAME,
        FIELDS.PROJECT.DESCRIPTION,
        FIELDS.PROJECT.STATUS,
        FIELDS.PROJECT.START_DATE,
        FIELDS.PROJECT.END_DATE,
        'CreatedOn',
        'ModifiedOn',
        'CreatedBy',
        'Owner'
      ];
      
      const projects = await apperService.fetchRecords(TABLES.PROJECT, {
        fields,
        orderBy: [{ field: 'CreatedOn', direction: 'desc' }]
      });
      
      return projects;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch a single project by ID
export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId, { rejectWithValue }) => {
    try {
      // Define fields to retrieve based on schema
      const fields = [
        FIELDS.PROJECT.ID,
        FIELDS.PROJECT.NAME,
        FIELDS.PROJECT.DESCRIPTION,
        FIELDS.PROJECT.STATUS,
        FIELDS.PROJECT.START_DATE,
        FIELDS.PROJECT.END_DATE,
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
              field: FIELDS.PROJECT.ID,
              operator: "Equal",
              value: projectId
            }
          ],
          logicalOperator: "And"
        }
      };
      
      const projects = await apperService.fetchRecords(TABLES.PROJECT, params);
      
      if (projects && projects.length > 0) {
        return projects[0];
      }
      
      throw new Error('Project not found');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      // Transform projectData to match the expected schema
      const record = {
        [FIELDS.PROJECT.NAME]: projectData.name,
        [FIELDS.PROJECT.DESCRIPTION]: projectData.description,
        [FIELDS.PROJECT.STATUS]: projectData.status,
        [FIELDS.PROJECT.START_DATE]: projectData.startDate,
        [FIELDS.PROJECT.END_DATE]: projectData.endDate
      };
      
      const createdProject = await apperService.createRecord(TABLES.PROJECT, record);
      return createdProject;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      // Transform projectData to match the expected schema
      const record = {
        [FIELDS.PROJECT.NAME]: projectData.name,
        [FIELDS.PROJECT.DESCRIPTION]: projectData.description,
        [FIELDS.PROJECT.STATUS]: projectData.status,
        [FIELDS.PROJECT.START_DATE]: projectData.startDate,
        [FIELDS.PROJECT.END_DATE]: projectData.endDate
      };
      
      const updatedProject = await apperService.updateRecord(TABLES.PROJECT, projectId, record);
      return updatedProject;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue }) => {
    try {
      await apperService.deleteRecord(TABLES.PROJECT, projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects cases
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add any fetched projects to the array
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch projects';
      })
      
      // Fetch project by ID cases
      .addCase(fetchProjectById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch project';
      })
      
      // Create project cases
      .addCase(createProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create project';
      })
      
      // Update project cases
      .addCase(updateProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.projects.findIndex(project => project.Id === action.payload.Id);
        if (index !== -1) {
          // Update project in array
          state.projects[index] = action.payload;
        }
        // Update current project if it's the one being edited
        if (state.currentProject && state.currentProject.Id === action.payload.Id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update project';
      })
      
      // Delete project cases
      .addCase(deleteProject.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove the deleted project from state
        state.projects = state.projects.filter(project => project.Id !== action.payload);
        // Clear current project if it was the one deleted
        if (state.currentProject && state.currentProject.Id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete project';
      });
  }
});

export const { setCurrentProject, clearCurrentProject } = projectsSlice.actions;

// Selectors
export const selectAllProjects = (state) => state.projects.projects;
export const selectProjectById = (state, projectId) => 
  state.projects.projects.find(project => project.Id === projectId);
export const selectCurrentProject = (state) => state.projects.currentProject;
export const selectProjectsStatus = (state) => state.projects.status;
export const selectProjectsError = (state) => state.projects.error;

export default projectsSlice.reducer;