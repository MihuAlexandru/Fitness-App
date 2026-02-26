import { useDispatch, useSelector } from "react-redux";
import { openEditModal } from "../../../store/UI/exercisesUISlice";
import { deleteExercise } from "../../../store/exercises/exercisesThunks";
import { useState } from "react";
import "./ExercisesTableRow.css";

export default function ExercisesTableRow({ ex, mode }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const canEdit = !!user;

  const [expanded, setExpanded] = useState(false);

  const onDelete = () => {
    if (!window.confirm(`Delete "${ex.name}"?`)) return;
    dispatch(deleteExercise(ex.id));
  };

  return (
    <>
      {mode === "desktop" && (
        <tr className="ex-tr desktop-row">
          <td className="ex-td ex-td--name">
            <strong>{ex.name}</strong>
          </td>

          <td className="ex-td ex-td--muscle">
            <em>{ex.muscle_group}</em>
          </td>

          <td className="ex-td ex-td--desc">{ex.description}</td>

          <td className="ex-td ex-td--actions">
            {canEdit ? (
              <div className="ex-actions">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="icon-theme ex-icon ex-icon--edit"
                  onClick={() => dispatch(openEditModal(ex))}
                >
                  <path d="M18.4,4.4l1.2,1.2L6.2,19H5v-1.2L18.4,4.4 M18.4,2c-0.3,0-0.5,0.1-0.7,0.3L3,17v4h4L21.7,6.3c0.4-0.4,0.4-1,0-1.4l-2.6-2.6 C18.9,2.1,18.7,2,18.4,2L18.4,2z"></path>
                  <path
                    d="M15.8 4.3H17.8V9.2H15.8z"
                    transform="rotate(-45.001 16.75 6.75)"
                  ></path>
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  onClick={onDelete}
                  className="icon-theme ex-icon ex-icon--delete"
                >
                  <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                </svg>
              </div>
            ) : (
              <span className="muted-dash">—</span>
            )}
          </td>
        </tr>
      )}

      {mode === "mobile" && (
        <tr className="mobile-card">
          <td colSpan="4">
            <div className="card">
              <div className="card-header">
                <span className="card-name">{ex.name}</span>
                <span className="card-muscle">{ex.muscle_group}</span>
              </div>
              <div className="expand-btn">
                {expanded ? (
                  <svg
                    onClick={() => setExpanded(!expanded)}
                    className="icon-theme"
                    viewBox="5 5 20 20"
                    width="28"
                    height="28"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <path fill="none" d="M0 0h24v24H0z"></path>{" "}
                        <path d="M12 11.828l-2.828 2.829-1.415-1.414L12 9l4.243 4.243-1.415 1.414L12 11.828z"></path>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                ) : (
                  <svg
                    onClick={() => setExpanded(!expanded)}
                    className="icon-theme"
                    viewBox="5 5 20 20"
                    width="28"
                    height="28"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z"></path>{" "}
                      </g>
                    </g>
                  </svg>
                )}
              </div>

              {expanded && (
                <div className="card-body">
                  <p className="card-desc">{ex.description}</p>

                  {canEdit ? (
                    <div className="card-actions">
                      <button
                        className="ex-btn ex-btn--text"
                        onClick={() => dispatch(openEditModal(ex))}
                      >
                        Edit
                      </button>

                      <button
                        className="ex-btn ex-btn--text btn-danger"
                        onClick={onDelete}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <span className="muted-dash">—</span>
                  )}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
