import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonPieChart from "../../../components/common/commonPieChart/commonPieChart";
import CommonStatusCountCard from "../../../components/common/commonStatusCountCard/commonStatusCountCard";
import CommonButton from "../../../components/common/commonButton/commonButton";
import { useNavigate } from "react-router-dom";
import CommonSearch from "../../../components/common/commonSearch/commonSearch";
import CommonDropAndDrag from "../../../components/common/commonDropAndDrag/commonDropAndDrag";
import Profile from "../../../assets/images/profile.png";
import BalloonImage from "../../../assets/images/Party Balloons.png";
import TaskModel from "../../../components/models/createTaskModel/createTaskModel";
import TaskDetailModel from "../../../components/models/taskDetailModel/taskDetailModel";
import { useSelector } from "react-redux";
import CommonLoader from "../../../components/common/commonLoader/commonLoader";
import { PolicyValidate } from "../../../utils/valitations/Valitation";
// import { getOUById } from "../../../redux/actions/ou";
import { getAllExcomMember, getOUById } from "../../../redux/actions/ou";
import CommonPagination from "../../../components/common/commonPagination/commonPagination";
import { getTaskCount } from "../../../redux/actions/task";



function ExecutiveCommitteePage() {
  const { id } = useParams();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();
  const [taskPolicy, settaskPolicy] = useState(false);
  const userData = useSelector((state) => state.user.userData);
  const [pageLoading, setPageLoading] = useState(true);
  const [refreshTasks, setRefreshTasks] = useState(0);
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotaltPage] = useState(0);
  const { id: ouId } = useParams();
  const [searchItem, setsearchItem] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [taskCount, setTaskCount] = useState({
    todo: 0,
    progress: 0,
    complete: 0,
  });



  useEffect(() => {
    setPageLoading(true);

    if (userData) {
      const isExcomAvailable = PolicyValidate(userData, "EXCOM");

      const isExcomTaskAvailable = PolicyValidate(userData, "EXCOM_TASK");

      if (!isExcomAvailable) {
        navigate("/dashboard");
      } else {
        settaskPolicy(isExcomTaskAvailable);
        setPageLoading(false);
      }

      getOUById(id, (res) => {
        if (res.status == 200) {
          getExcomTaskCount();

        } else {
          navigate("/dashboard/not-found");
        }
      });
    }
  }, [userData]);

  useEffect(() => {
    getAllExcomMember(0, "", ouId, "", (response) => {
      // console.log("response now:", response.data.data.content)
      if (response && response.data) {
        const userList = response.data.data.content.map((user) => ({
          id: user?.user?.userID,
          fullName: `${user?.user?.firstName} ${user?.user?.lastName}`,
        }));
        setMembers(userList);
      }
    });
  }, []);

  const navigateToexcomDetailPage = () => {
    navigate(`/dashboard/executive-committee/${id}/detail`);
  };

  const openTaskModal = () => {
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
  };

  const openTaskDetailModel = (task) => {
    setSelectedTask(task);
  };

  const closeTaskDetailModel = () => {
    setSelectedTask(null);
  };

  const handleSearchChange = (e) => setsearchItem(e);
  const handlePriorityChange = (e) => setPriority(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleMemberChange = (e) => {
    console.warn(e.target.value, "e.target.valuee.target.valuee.target.value")
    setSelectedMemberId(e.target.value)
  };

  function getExcomTaskCount() {
    getTaskCount("EXCOM", "", id, (res) => {
      if (res?.status == 200) {
        let count = res?.data?.data;
        setTaskCount({
          todo: count?.todo,
          progress: count?.progress,
          complete: count?.complete,
        });
      } else {
        console.warn("Error in task count loading");
      }
    });
  }

  return (
    <>
      {pageLoading ? (
        <CommonLoader />
      ) : (
        <>
          <div className="p-3">
            <div className="d-flex justify-content-end gap-4 align-items-center flex-wrap">
              {taskPolicy ? (
                <div>
                  <CommonButton onClick={openTaskModal} text={"Create Tasks"} />
                </div>
              ) : null}

              <div>
                <CommonButton
                  onClick={navigateToexcomDetailPage}
                  text={"Excom Details"}
                />
              </div>
            </div>

            <div className="text-cl-primary mt-4">Tasks</div>
            <div className="d-flex mt-3 justify-content-between align-items-center gap-4 flex-wrap">
              {console.log("taskCount", taskCount)}
              {(taskCount.todo > 0 || taskCount.progress > 0 || taskCount.complete > 0) &&   <div onClick={() => openTaskDetailModel("Pie Chart")}>
                <CommonPieChart todo={taskCount.todo} progress={taskCount.progress} complete={taskCount.complete} />
              </div>}
            
              <div className="d-flex justify-content-between flex-wrap flex-grow-1 gap-4">
                <div>
                  <CommonStatusCountCard type={"TODO"} count={taskCount.todo} />
                </div>
                <div>
                  <CommonStatusCountCard type={"ONGOING"} count={taskCount.progress} />
                </div>
                <div>
                  <CommonStatusCountCard type={"COMPLETE"} count={taskCount.complete} />
                </div>
              </div>
            </div>

            <div className="d-flex mt-5 justify-content-between align-items-center flex-wrap gap-4">
              <div className="text-cl-primary mt-4">Board</div>
            </div>

            <div className="d-flex flex-column bg-white common-shadow rounded-3 p-3 mt-4">
              <div className="d-flex justify-content-between align-items-center w-100 flex-wrap gap-4">
                <div>
                  <CommonSearch primary={true} onChange={handleSearchChange} />
                </div>

                <div className="">
                  <select
                    className="form-select w-100"
                    aria-label="Large select example"
                    value={priority}
                    onChange={handlePriorityChange}
                  >
                    <option selected value={''}> Priority</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
                <div className="">
                  <select
                    className="form-select w-100"
                    aria-label="Large select example"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option selected value={''}>Status</option>
                    <option value="TODO">TO DO</option>
                    <option value="PROGRESS">PROGRESS</option>
                    <option value="COMPLETE">COMPLETED</option>
                  </select>
                </div>
                {taskPolicy && (
                  <div>
                    <select
                      className="form-select w-100"
                      aria-label="Large select example"
                      value={selectedMemberId}
                      onChange={handleMemberChange}
                    >
                      <option selected value={''}>Assignee</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              </div>
              <div
                className="mt-4 d-flex justify-content-between overflow-scroll overflow-y-hidden custom-scrollbar"
                style={{ maxWidth: 1300 }}
              >
                <CommonDropAndDrag
                  id={id}
                  excom={true}
                  refresh={refreshTasks}
                  search={searchItem}
                  status={status}
                  user_id={selectedMemberId}
                  page={currentPage}
                  priority={priority}
                  setTotaltPage={setTotaltPage}
                  referhTaskCount={() => getExcomTaskCount()}
                />
              </div>
              {totalPage > 1 ? (
                <div className="mt-5 d-flex justify-content-end">
                  <CommonPagination currentPage={currentPage} pages={totalPage} setCurrentPage={setCurrentPage} />
                </div>
              ) : null}

            </div>
            <TaskModel
              show={showTaskModal}
              onHide={closeTaskModal}
              type={"EXCOM"}
              ouID={id}
              changed={() => {
                setRefreshTasks(refreshTasks + 1);
              }}
            />
          </div>
        </>
      )}
    </>
  );
}

export default ExecutiveCommitteePage;
