import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import WorkoutsHeader from "../../components/Workouts/WorkoutsHeader/WorkoutsHeader";
import WorkoutsTable from "../../components/Workouts/WorkoutsTable/WorkoutsTable";
import AddWorkoutModal from "../../components/Workouts/AddWorkoutsModal/AddWorkoutModal";
import { fetchWorkouts } from "../../store/workouts/workoutsThunks";
import { closeAddModal } from "../../store/UI/workoutsUISlice";

export default function Workouts() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { status, error } = useSelector((s) => s.workouts);
  const { isAddModalOpen } = useSelector((s) => s.workoutsUi);

  useEffect(() => {
    if (user?.id) dispatch(fetchWorkouts(user.id));
  }, [user?.id, dispatch]);

  return (
    <div
      style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
    >
      <WorkoutsHeader />

      {status === "loading" && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {status === "succeeded" && <WorkoutsTable />}

      {isAddModalOpen && (
        <AddWorkoutModal onClose={() => dispatch(closeAddModal())} />
      )}
    </div>
  );
}
