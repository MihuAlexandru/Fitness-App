import { createSlice } from "@reduxjs/toolkit";

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

export const initialState = {
  muscleGroup: "All",
  search: "",
  sortBy: "name",
  sortAsc: true,
  page: 1,
  pageSize: PAGE_SIZE_OPTIONS[0],
  isModalOpen: false,
  editing: null,
};

const exercisesUiSlice = createSlice({
  name: "exercisesUi",
  initialState,
  reducers: {
    setMuscleGroup(state, action) {
      state.muscleGroup = action.payload;
      state.page = 1;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    toggleSort(state, action) {
      const key = action.payload;
      if (state.sortBy === key) state.sortAsc = !state.sortAsc;
      else {
        state.sortBy = key;
        state.sortAsc = true;
      }
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
      state.page = 1;
    },
    openAddModal(state) {
      state.isModalOpen = true;
      state.editing = null;
    },
    openEditModal(state, action) {
      state.isModalOpen = true;
      state.editing = action.payload;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.editing = null;
    },
  },
});

export const {
  setMuscleGroup,
  setSearch,
  toggleSort,
  setPage,
  setPageSize,
  openAddModal,
  openEditModal,
  closeModal,
} = exercisesUiSlice.actions;

export default exercisesUiSlice.reducer;
