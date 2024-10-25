import React, { useEffect, useState } from "react";
import CommonBalanceCard from "../../../../components/common/commonBalanceCard/commonBalanceCard";
import CommonButton from "../../../../components/common/commonButton/commonButton";
import CommonFinanceTable from "../../../../components/common/commonFinanceTable/commonFinanceTable";
import AddExpense from "../../../../components/sections/AddExpense";
import { useDispatch, useSelector } from "react-redux";
import CommonLoader from "../../../../components/common/commonLoader/commonLoader";
import { PolicyValidate } from "../../../../utils/valitations/Valitation";
import { useNavigate, useParams } from "react-router-dom";
import { projectPolicy } from "../../../../redux/reducers/userSlice";
import { getProjectById } from "../../../../redux/actions/project";
import { getWalletByProject } from "../../../../redux/actions/wallet";
import { getWalletBalance } from "../../../../redux/actions/transection";


const ProjectFinanceLanding = () => {
  const [showAddSection, setShowAddSection] = useState(false);
  const { id } = useParams();
  const userData = useSelector((state) => state.user.userData);
  const projectPolicyData = useSelector((state) => state.user.projectPolicy);
  const [pageLoading, setPageLoading] = useState(true);
  const distpatch = useDispatch();
  const [projectData, setProjectData] = useState(null);
  const [isFinanceAvailable, setIsFinanceAvailable] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  const [mainBalance, setMainBalance] = useState(0);
  const [creditBalance, setCreditBalancee] = useState(0);
  const [debitBalance, setDebitBalance] = useState(0);

  const handleOpenAddSection = () => {
    setShowAddSection(!showAddSection);
  };



  useEffect(() => {
    setPageLoading(true);
    if (userData) {
      if (projectPolicyData) {
        policyCheck(projectPolicyData, false);
        setProject(projectPolicyData?.project)
      } else {
        getProjectById(id, (res) => {
          if (res?.status == 200) {
            setProject(res?.data?.data?.project)
            policyCheck(res?.data?.data, true);
          } else {
            setPageLoading(false);
            navigate(-1);
          }
        })
      }
    }
  }, [userData, projectPolicyData, id])


  useEffect(() => {

      getWalletByProject(id, (res) => {
        if (res?.status == 200) {
          setSelectedWallet(res?.data?.data?.id);
          getWalletBalance(res.data.data.id, (res1) => {
            if (res?.status == 200) {
              setMainBalance(res1?.data?.data?.main_balance)
              setCreditBalancee(res1?.data?.data?.credit_balance)
              setDebitBalance(res1?.data?.data?.debit_balance)
            }
          })
        }
      })
  }, [project,userData, projectPolicyData, id,showAddSection])

  function policyCheck(data, useAPI) {
    setProjectData(data);
    const isEventPolicyAvailable = PolicyValidate(data?.my_user_role_details, "PROJECT_FINANCE");
    const isAllPolicyAvailable = PolicyValidate(userData, "PROJECT");
    if (!(isEventPolicyAvailable || isAllPolicyAvailable)) {
      navigate(-1);
    }
    if (useAPI) {
      distpatch(projectPolicy(data))
    }
    setPageLoading(false);
  }

  return (
    <>
      {pageLoading ? (
        <CommonLoader />
      ) : (
        <>
          {showAddSection ? (
            <AddExpense selectedWallet={selectedWallet} handleClose={handleOpenAddSection} />
          ) : (
            <div className="container">
              <div className="d-flex justify-content-center justify-content-lg-between align-items-center flex-wrap gap-3 mt-5">
                <CommonBalanceCard
                  wallet={true}
                  text={"Wallet Balance"}
                  amount={parseFloat(mainBalance).toFixed(1)}
                />

                <CommonBalanceCard text={"Income"} amount={parseFloat(debitBalance).toFixed(1)} />

                <CommonBalanceCard text={"Expense"} amount={parseFloat(creditBalance).toFixed(1)} />
              </div>

              <div className="mt-5 d-flex justify-content-between align-items-center gap-4 flex-wrap">
                <div className="text-cl-primary fw-bold">
                  Recent Transactions
                </div>
                <div className="d-flex justify-content-end gap-4">
                  <div>
                    <CommonButton
                      text={"Expenses"}
                      onClick={handleOpenAddSection}
                    />
                  </div>
                  {/* <div>
                    <CommonButton text={"Report"} />
                  </div> */}
                </div>
              </div>
              <div className="container mt-4">
                <CommonFinanceTable selectedWallet={selectedWallet} />
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProjectFinanceLanding;
