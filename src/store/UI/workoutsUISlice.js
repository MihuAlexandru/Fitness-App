import { createSlice } from "@reduxjs/toolkit";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

const initialState = {
  dateFrom: "",
  dateTo: "",
  searchNotes: "",
  search: "",
  sortBy: "date", // "date" | "duration"
  sortAsc: false,
  page: 1,
  pageSize: PAGE_SIZE_OPTIONS[0], // 5
  isAddModalOpen: false,
  expanded: [],
};

const workoutsUiSlice = createSlice({
  name: "workoutsUi",
  initialState,
  reducers: {
    setDateFrom(state, action) {
      state.dateFrom = action.payload;
      state.page = 1;
    },
    setDateTo(state, action) {
      state.dateTo = action.payload;
      state.page = 1;
    },

    setSearchNotes(state, action) {
      state.searchNotes = action.payload;
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

    toggleExpand(state, action) {
      const id = action.payload;
      if (state.expanded.includes(id)) {
        state.expanded = state.expanded.filter((x) => x !== id);
      } else {
        state.expanded.push(id);
      }
    },

    openAddModal(state) {
      state.isAddModalOpen = true;
    },
    closeAddModal(state) {
      state.isAddModalOpen = false;
    },
  },
});

export const {
  setDateFrom,
  setDateTo,
  setSearch,
  setSearchNotes,
  toggleSort,
  setPage,
  setPageSize,
  toggleExpand,
  openAddModal,
  closeAddModal,
} = workoutsUiSlice.actions;

export default workoutsUiSlice.reducer;
