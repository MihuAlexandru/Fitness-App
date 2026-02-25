import { useDispatch, useSelector } from "react-redux";
import {
  selectPageData,
  selectTotal,
} from "../../../store/UI/exercisesSelectors";
import { setPage } from "../../../store/UI/exercisesUISlice";
import PaginatedFooter from "../../PaginatedFooter/PaginatedFooter";

export default function ExercisesFooter() {
  const dispatch = useDispatch();
  const { page, pageCount } = useSelector(selectPageData);
  const total = useSelector(selectTotal);

  return (
    <PaginatedFooter
      page={page}
      pageCount={pageCount}
      total={total}
      label="exercise"
      onPageChange={(newPage) => dispatch(setPage(newPage))}
    />
  );
}
