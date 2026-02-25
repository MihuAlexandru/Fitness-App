import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WorkoutsHeader from "../../components/Workouts/WorkoutsHeader/WorkoutsHeader";
import WorkoutsTable from "../../components/Workouts/WorkoutsTable/WorkoutsTable";
import AddWorkoutModal from "../../components/Workouts/AddWorkoutsModal/AddWorkoutsModal";
import { fetchWorkouts } from "../../store/workouts/workoutsThunks";
import { closeAddModal, closeEditModal } from "../../store/UI/workoutsUISlice";
import "./Workouts.css";
import WorkoutFooter from "../../components/Workouts/WorkoutsFooter/WorkoutsFooter";

export default function Workouts() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { status, error } = useSelector((s) => s.workouts);
  const { isAddModalOpen, isEditModalOpen, editing } = useSelector(
    (s) => s.workoutsUi,
  );

  useEffect(() => {
    if (user?.id) dispatch(fetchWorkouts(user.id));
  }, [user?.id, dispatch]);

  return (
    <div className="container">
      <WorkoutsHeader />

      {status === "loading" && <p>Loading…</p>}
      {error && <p className="workouts-error">{error}</p>}

      {status === "succeeded" && <WorkoutsTable />}
      <WorkoutFooter />

      {isAddModalOpen && (
        <AddWorkoutModal onClose={() => dispatch(closeAddModal())} />
      )}

      {isEditModalOpen && editing && (
        <AddWorkoutModal
          edit
          workout={editing}
          onClose={() => dispatch(closeEditModal())}
        />
      )}
    </div>
  );
}
