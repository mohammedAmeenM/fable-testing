import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
  projectId: string | null;  // Store the selected projectId here
}

const initialState: ProjectState = {
  projectId: null, // Initialize as null
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectId: (state, action: PayloadAction<string | null>) => {
      state.projectId = action.payload;  // Set the selected projectId
    },
    resetProjectId: (state) => {
      state.projectId = null;  // Reset the projectId (e.g., on logout)
    },
  },
});

export const { setProjectId, resetProjectId } = projectSlice.actions;
export default projectSlice.reducer;
