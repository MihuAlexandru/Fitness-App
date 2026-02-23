import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchExercises } from "../../store/exercises/exercisesThunks";
import {
  selectExercisesError,
  selectExercisesStatus,
} from "../../store/UI/exercisesSelectors";
import ExercisesHeader from "../../components/Exercises/ExercisesHeader/ExercisesHeader";
import ExercisesTable from "../../components/Exercises/ExercisesTable/ExercisesTable";
import ExercisesFooter from "../../components/Exercises/ExercisesFooter/ExercisesFooter";
import ExercisesModal from "../../components/Exercises/ExercisesModal/ExercisesModal";

export default function Exercises() {
  const dispatch = useDispatch();

  const status = useSelector(selectExercisesStatus);
  const error = useSelector(selectExercisesError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchExercises());
    }
  }, [status, dispatch]);

  return (
    <div
      style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
    >
      <ExercisesHeader />

      <section>
        <ExercisesTable loading={status === "loading"} err={error} />
      </section>

      <ExercisesFooter />

      <ExercisesModal />
    </div>
  );
}
