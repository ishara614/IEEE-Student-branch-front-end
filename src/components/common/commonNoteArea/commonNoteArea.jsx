import React, { useEffect, useState } from "react";
import {
  addComment,
  getAllCommentsByProject,
  getAllCommentsByTask,
} from "../../../redux/actions/comment";
import CommonSearch from "../commonSearch/commonSearch";
import CommonNoteContainer from "../commonNoteContainer/commonNoteContainer";
import send from "../../../assets/icons/Sent.png";

export default function CommonNotesArea({
  taskID,
  projectID,
  show,
  task,
  project,
}) {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState(null);
  const [noteSendloading, setNoteSendloading] = useState(false);
  const [refreshNotes, setRefreshNotes] = useState(1);
  const handleNoteChange = (event) => {
    setComment(event.target.value);
  };
  const submitNote = () => {
    if (task && comment.trim()) {
      setNoteSendloading(true);
      addComment(
        {
          comment: comment,
          task_id: taskID,
          type: "TASK",
        },
        (res) => {
          if (res?.status == 200) {
            setComment("");
            setNoteSendloading(false);
            setRefreshNotes(refreshNotes + 1);
          } else {
            setNoteSendloading(false);
            console.warn(res, "err in submit note");
          }
        }
      );
    } else if (project && comment.trim()) {
      setNoteSendloading(true);
      addComment(
        {
          comment: comment,
          project_id: projectID,
          type: "PROJECT",
        },
        (res) => {
          if (res?.status == 200) {
            setComment("");
            setNoteSendloading(false);
            setRefreshNotes(refreshNotes + 1);
          } else {
            setNoteSendloading(false);
            console.warn(res, "err in submit note");
          }
        }
      );
    }
  };
  useEffect(() => {
    if (show) {
      if (task) {
        getAllCommentsByTask(taskID, (res) => {
          if (res?.status == 200) {
            setCommentList(res?.data?.data);
          }
        });
      } else if (project) {
        getAllCommentsByProject(projectID, (res) => {
          if (res?.status == 200) {
            setCommentList(res?.data?.data);
          }
        });
      }
    }
  }, [show, refreshNotes]);

  return (
    <>
      <div className="d-flex bg-white common-shadow flex-column p-3 rounded-3 mb-2">
        {/* <div className="bg-white common-shadow p-2 rounded-3 mb-2"> */}
        <h6 className="text-third fw-bold">Notes</h6>
        <div className="p-2">
          <CommonSearch primary={false} />
        </div>
        {/* <div className="overflow-auto" style={{ height: "400px" }}> */}
        <div
          className="mt-2 d-flex justify-content-between align-items-center gap-0 flex-wrap overflow-scroll overflow-x-hidden custom-scrollbar pb-3 ps-2 pe-2 pt-1 w-100"
          style={{ maxHeight: 300 }}
        >
          {commentList?.map((note, index) => (
            <div className="p-2 w-100" key={index}>

              <CommonNoteContainer
                noteData={note}
                refreshCommentLoader={() => setRefreshNotes(refreshNotes + 1)}
              />
            </div>
          ))}
        </div>

        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center gap-3">
            <div className="form-group w-100">
              <textarea
                className="form-control"
                placeholder="Add note here"
                value={comment}
                onChange={handleNoteChange}
              ></textarea>
            </div>
            <button
              className="bg-transparent border-0"
              onClick={submitNote}
              disabled={!comment.trim() || noteSendloading}
            >
              {noteSendloading ? (
                <div className="d-flex justify-content-center">
                  <div
                    className={`spinner-border text-secondary`}
                    role="status"
                  ></div>
                </div>
              ) : (
                <img src={send} width={30} alt="Send" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
