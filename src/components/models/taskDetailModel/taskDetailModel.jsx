import React, { useEffect, useState } from "react";
import { Modal, Dropdown, DropdownButton } from "react-bootstrap";
import CommonButton from "../../common/commonButton/commonButton";
import CommonMemberContainer from "../../common/commonMemberContainer/commonMemberContainer";
import CommonSearch from "../../common/commonSearch/commonSearch";
import add from "../../../assets/icons/Add.png";
import send from "../../../assets/icons/Sent.png";
import flag from "../../../assets/images/Flag.png";
import star from "../../../assets/images/Star.png";
import deleted from "../../../assets/icons/delete.png";
import loading from "../../../assets/images/Loading.png";
import clock from "../../../assets/images/Clock.png";
import CreateTaskModel from "../createTaskModel/createTaskModel";
import CommonTable from "../../common/commonTable/commonTable";
import CommonNoteContainer from "../../common/commonNoteContainer/commonNoteContainer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PolicyValidate } from "../../../utils/valitations/Valitation";
import { editTask, getTaskById } from "../../../redux/actions/task";
import {
  addComment,
  getAllCommentsByTask,
} from "../../../redux/actions/comment";

import CommonNotesArea from "../../common/commonNoteArea/commonNoteArea";

const TaskDetailModel = ({
  onHide,
  show,
  taskID,
  project,
  excom,
  openTaskAssignModal,
}) => {
  const navigate = useNavigate();
  const [assignTask, setAssignTask] = useState(false);
  const [createTask, setCreateTask] = useState(false);
  // const [selectedPriority, setSelectedPriority] = useState("High");
  const userData = useSelector((state) => state.user.userData);
  const [pageLoading, setPageLoading] = useState(true);
  const projectPolicyData = useSelector((state) => state.user.projectPolicy);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // const [selectedTask, setSelectedTask] = useState(null);
  // const [refreshTaskDetails, setRefreshTaskDetails] = useState(1);
  const [firstTimeFormDataLoaded, setFirstTimeFormDataLoaded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.split("T")[0];
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    // console.log(event.target.value,"Changing is work");
  };

  const [formData, setFormData] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [assigneesArray, setAssigneesArray] = useState(null);

  useEffect(() => {
    if (firstTimeFormDataLoaded && show) {
      console.log("inside edit task");
      editTask(taskData.taskId, formData, (res) => {
        if (res?.status == 200) {
          let task = res?.data?.data;
          setTaskData(task);
          console.log("succussfulyy edited");
        } else {
          console.warn("Error in Updatin edited data");
        }
      });
    }
    setFirstTimeFormDataLoaded(true);
  }, [formData]);

  useEffect(() => {
    setPageLoading(true);
    if (excom) {
      if (userData && show) {
        const isExcomAvailable = PolicyValidate(userData, "EXCOM");
        const isExcomTaskAvailable = PolicyValidate(userData, "EXCOM_TASK");
        const isExcomTaskAssignAvailable = PolicyValidate(
          userData,
          "EXCOM_TASK_ASSIGN"
        );

        if (!isExcomAvailable) {
          navigate("/dashboard");
        } else {
          setAssignTask(isExcomTaskAssignAvailable);
          setCreateTask(isExcomTaskAvailable);
          setPageLoading(false);
        }
      }
    } else if (project) {
      if (projectPolicyData && show) {
        const isProjectAvailable = PolicyValidate(userData, "PROJECT");

        const isProjecrTaskAvailable =
          PolicyValidate(projectPolicyData, "PROJECT_TASK") ||
          isProjectAvailable;

        const isPrjectTaskAssignAvailable =
          PolicyValidate(projectPolicyData, "PROJECT_TASK") ||
          isProjectAvailable;

        setAssignTask(isPrjectTaskAssignAvailable);
        setCreateTask(isProjecrTaskAvailable);
        setPageLoading(false);
      }
    }
  }, [userData, show]);

  useEffect(() => {
    if (show) {
      getTaskById(taskID, (res) => {
        if (res?.status == 200) {
          const task = res?.data?.data;

          const data = {
            task_name: task?.task_name,
            start_date: task?.start_date,
            end_date: task?.end_date,
            priority: task?.priority,
            status: task?.status,
            description: task?.description,
          };
          setFormData(data);
          setTaskData(res?.data?.data);
          setAssigneesArray(res?.data?.data?.users);
        } else {
          // navigate("/dashboard/not-found");
          console.warn("error in task loading by task id");
        }
      });
    }
  }, [show]);

  const handlePrioritySelect = (eventKey) => {
    setSelectedPriority(eventKey);
  };

  const openTaskModal = () => {
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
  };

  const tableHeading = [
    { label: "Task Title", value: "Task_title" },
    { label: "Priority", value: "priority" },
    { label: "Due", value: "due" },
    { label: "Status", value: "status" },
    { label: "Action", value: "ACTION", type: ["VIEW"] },
  ];

  const tableData = [];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title
          className="text-cl-primary"
          id="contained-modal-title-vcenter"
        >
          {taskData?.task_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-lg-8">
            <div>
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div className="text-cl-primary">
                  Main Task Title / Sub Task Title {/* need to discuss */}
                </div>
                {/* {createTask && (
                  <button
                    className="bg-transparent border-0"
                    aria-label="Delete Task"
                  >
                    <img src={deleted} width={25} alt="Delete" />
                  </button>
                )} */}
              </div>
              <h5>
                <b></b>
              </h5>
              <div
                className="d-flex justify-content-between align-items-center mb-3"
                style={{ width: "350px" }}
              >
                <div className="text-cl-primary mb-1 d-flex align-items-center">
                  <img
                    src={loading}
                    style={{ width: "20px", height: "20px" }}
                    alt="Loading"
                    className="me-2"
                  />
                  <span>Status</span>
                </div>
                <div className="form-group">
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={taskData?.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="" hidden>
                      Select Status
                    </option>
                    <option value="TODO">TODO</option>
                    <option value="PROGRESS">In Progress</option>
                    <option value="COMPLETE">Completed</option>
                  </select>
                </div>
              </div>
              <div
                className="d-flex justify-content-between align-items-center mb-3"
                style={{ width: "350px" }}
              >
                <div className="col-md-4 text-cl-primary mb-1 d-flex align-items-center">
                  <img
                    src={flag}
                    style={{ width: "25px", height: "25px" }}
                    alt="Flag"
                  />
                  <span>Start Date</span>
                </div>
                <input
                  type="date"
                  name="start_date"
                  className="form-control ms-3"
                  value={formatDate(taskData?.start_date)}
                  onChange={handleChange}
                />
              </div>
              <div
                className=" d-flex justify-content-between align-items-center mb-3"
                style={{ width: "350px" }}
              >
                <div className="col-md-4 text-cl-primary mb-1 d-flex align-items-center">
                  <img
                    src={flag}
                    style={{ width: "25px", height: "25px" }}
                    alt="Flag"
                  />
                  <span>End Date</span>
                </div>
                <input
                  type="date"
                  name="end_date"
                  className="form-control ms-3"
                  value={formatDate(taskData?.end_date)}
                  onChange={handleChange}
                />
              </div>
              <div
                className="d-flex justify-content-between align-items-center mb-3"
                style={{ width: "350px" }}
              >
                <div className="text-cl-primary mb-1 d-flex align-items-center">
                  <img
                    src={star}
                    style={{ width: "20px", height: "20px" }}
                    alt="Star"
                    className="me-2"
                  />
                  <span>Priority</span>
                </div>
                <div className="form-group">
                  <select
                    className="form-select"
                    id="priority"
                    name="priority"
                    value={taskData?.priority}
                    onChange={handleChange}
                    required
                  >
                    <option value="" hidden>
                      Select Priority
                    </option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <div className="text-cl-primary mb-1 d-flex align-items-center">
                  <img
                    src={clock}
                    style={{ width: "25px", height: "25px" }}
                    alt="Clock"
                  />
                  <span className="ms-2">
                    Created by{" "}
                    <b className="ms-2">
                      {taskData?.createdBy?.firstName}{" "}
                      {taskData?.createdBy?.lastName}
                    </b>
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <div className="text-cl-primary">Description</div>
                <textarea
                  name="description"
                  className="form-control"
                  onChange={handleChange}
                  rows="3"
                >
                  {taskData?.description}
                </textarea>
              </div>
              {/* <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-cl-primary">Sub Tasks</div>
                  {createTask && (
                    <div className="d-flex justify-content-end">
                      <img
                        src={add}
                        alt="Add"
                        style={{
                          width: "30px",
                          height: "30px",
                          cursor: "pointer",
                        }}
                        onClick={openTaskModal}
                      />
                    </div>
                  )}
                </div>
                <div className="d-flex">
                  <CommonSearch primary={true} />
                </div>
                <div className="mt-4">
                  <CommonTable
                    tableHeading={tableHeading}
                    primary={true}
                    tableData={tableData}
                    loading={false}
                    viewAction={() => {
                      // navigateToProject(id);
                    }}
                    editAction={() => {
                      // editProject(id);
                    }}
                  />
                </div>
              </div> */}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="bg-white rounded-3 common-shadow p-3">
              <CommonNotesArea taskID={taskID} show={show} task={true} />

              <div className="d-flex bg-white common-shadow flex-column p-2 rounded-3">
                <div className="d-flex justify-content-between align-items-center gap-4 flex-wrap mt-4 p-2">
                  <div className="d-flex justify-content-between w-100 align-items-center">
                    <h6 className="text-third fw-bold">Assignees</h6>
                    {assignTask && (
                      <button
                        className="border-0 bg-transparent"
                        onClick={() => {
                          openTaskAssignModal();
                        }}
                      >
                        <img
                          src={add}
                          alt="Add"
                          style={{ width: "30px", height: "30px" }}
                        />
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className="mt-4 d-flex justify-content-between align-items-center gap-1 flex-wrap overflow-scroll overflow-x-hidden custom-scrollbar"
                  style={{ maxHeight: 500 }}
                >
                  {assigneesArray?.map((assignee, index) => (
                    <div key={index}>
                      <CommonMemberContainer userData={assignee} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end mt-3">
        <CommonButton onClick={onHide} close={true} text={"Cancel"} />
      </Modal.Footer>
      <CreateTaskModel show={showTaskModal} onHide={closeTaskModal} />
    </Modal>
  );
};

export default TaskDetailModel;
