import { useDispatch, useSelector } from "react-redux";
import { selectFilteredSortedPagedWorkouts } from "../../../store/UI/workoutsSelectors";
import { setPage } from "../../../store/UI/workoutsUISlice";
import PaginatedFooter from "../../PaginatedFooter/PaginatedFooter";

export default function WorkoutFooter() {
  const dispatch = useDispatch();
  const { total, pageCount, page } = useSelector(
    selectFilteredSortedPagedWorkouts,
  );

  return (
    <PaginatedFooter
      page={page}
      pageCount={pageCount}
      total={total}
      label="workout"
      onPageChange={(newPage) => dispatch(setPage(newPage))}
    />
  );
}
