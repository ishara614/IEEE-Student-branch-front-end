import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import CommonButton from "../../common/commonButton/commonButton";
import CommonSearchModel from "../commonSearchModel/commonSearchModel";
import { getAllAccount } from "../../../redux/actions/account";
import { addAccountTransection, addouTransection } from "../../../redux/actions/transection";
import { useSelector } from 'react-redux';
import { PolicyValidate } from "../../../utils/valitations/Valitation";
import { useNavigate } from "react-router-dom";
import { getAllOuWallet, getMainWallet, getMyExomWallet, getProjectWalletList } from "../../../redux/actions/wallet";


const AddTransectionModel = ({
  onHide,
  show,
  setTransectionModelShow,
  disabled,
  editable,
  transection,
  refresh,
  setRefresh
}) => {
  const [method, setMethod] = useState("Bank");

  const methodsAll = ["Bank", "Inside", "Budget"];
  const methods = ["Inside", "Budget"];
  const userData = useSelector((state) => state.user.userData);


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    amount: "",
    from_wallet_id: "",
    to_wallet_id: "",
    wallet_id: "",
    account_id: "",
  });


  const [error, setError] = useState({
    title: false,
    description: false,
    type: false,
    amount: false,
    from_wallet_id: false,
    to_wallet_id: false,
    wallet_id: false,
    account_id: false,
    other: false
  });

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [walletModelShow, setWalletModelShow] = useState(false);
  const [proposalModelShow, setProposalModelShow] = useState(false);
  const [isFinanceAllPolicyAvailable, setIsFinanceAllPolicyAvailable] = useState(false);
  const [isFinanceTransactionPolicyAvailable, setIsFinanceTransactionPolicyAvailable] = useState(false);
  const [isFinanceBudgetPolicyAvailable, setIsFinanceBudgetPolicyAvailable] = useState(false);
  const [mainWallet, setMainWallet] = useState(null);
  const [isCheckboxTransferOuChecked, setIsCheckboxTransferOuChecked] = useState(false);
  const [myWallet, setMyWallet] = useState(null);
  const [ouWallets, setOuWallets] = useState([]);
  const [ProjectWallets, setProjectWallets] = useState([]);
  const [viewTransection, setViewTransection] = useState(null);
  const navigate = useNavigate();
  const [isSbChecked, setIsSbChecked] = useState(false);

  useEffect(() => {
    if (show && !disabled) {
      setLoading(false);
      setIsCheckboxTransferOuChecked(false);
      setIsSbChecked(false);
      reset();
      getMyExomWallet((res) => {
        if (res?.status == 200) {
          setMyWallet(res?.data?.data);
          ProjectWalletList(res?.data?.data?.ou?.ouID ? res?.data?.data?.ou?.ouID : 1)
        }
      })
      if (isFinanceAllPolicyAvailable) {
        getMainWallet((res) => {
          if (res?.status == 200) {
            setMainWallet(res?.data?.data?.[0])
          }
        })
        getAllAccount((res) => {
          if (res?.status == 200) {
            setAccounts(res?.data?.data)
          }
        })
        getAllOuWallet((res) => {
          if (res?.status == 200) {
            setOuWallets(res?.data?.data)
          }
        })


      }

    }
  }, [show, isFinanceAllPolicyAvailable]);


  function ProjectWalletList(id) {
    getProjectWalletList(id, (res) => {
      if (res?.status == 200) {
        setProjectWallets(res.data.data)
      }
    })
  }


  useEffect(() => {
    if (userData) {
      const isFinanceAvailable = PolicyValidate(userData, "FINANCE");
      const FinanceAllPolicyAvailable = PolicyValidate(userData, "FINANCE_ALL");
      const FinanceTransactionPolicyAvailable = PolicyValidate(userData, "FINANCE_TRANSACTION");
      const FinanceBudgetPolicyAvailable = PolicyValidate(userData, "FINANCE_BUDGET_PROPOSAL");
      editable || disabled ? setMethod("Budget") : FinanceAllPolicyAvailable ? setMethod("Bank") : setMethod("Budget");
      if (!isFinanceAvailable) {
        navigate('/dashboard')
      } else {
        setIsFinanceAllPolicyAvailable(FinanceAllPolicyAvailable);
        setIsFinanceBudgetPolicyAvailable(FinanceBudgetPolicyAvailable);
        setIsFinanceTransactionPolicyAvailable(FinanceTransactionPolicyAvailable);
      }
    }
  }, [userData])


  const handleTransferOuCheckboxChange = (event) => {
    setIsCheckboxTransferOuChecked(event.target.checked);
  };




  function reset() {
    setFormData({
      title: "",
      description: "",
      type: "",
      amount: "",
      from_wallet_id: "",
      to_wallet_id: "",
      wallet_id: "",
      account_id: "",
    })

    setError({
      title: false,
      description: false,
      type: false,
      amount: false,
      from_wallet_id: false,
      to_wallet_id: false,
      wallet_id: false,
      account_id: false,
      other: false
    })
  }



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: false }));
  };


  const handleShowWalletModelShow = () => {
    setWalletModelShow(true);
  };
  const handleShowProposalModelShow = () => {
    setProposalModelShow(true);
  };

  const handleCheckboxChange = (e) => {
    console.warn(e.target.checked, "lllllll")
    setIsSbChecked(e.target.checked);
  };


  function submit() {
    setLoading(true);
    if (method == "Bank") {
      addBankTransection();
    } else if (method == "Inside") {
      addInsideTransection();
    } else {
      addProjectTransection();
    }

  }


  function addProjectTransection() {
    setError({
      title: false,
      description: false,
      type: false,
      amount: false,
      from_wallet_id: false,
      to_wallet_id: false,
      wallet_id: false,
      account_id: false,
      other: false
    });



    if (
      !formData.title ||
      !formData.type ||
      !formData.amount ||
      !formData.description ||
      !formData.to_wallet_id
    ) {
      setError({
        ...error,
        title: !formData.title,
        description: !formData.description,
        type: !formData.type,
        amount: !formData.amount,
        to_wallet_id: !formData.to_wallet_id
      });
      return;
    }
    const data = {
      "title": formData.title,
      "description": formData.description,
      "type": formData.type,
      "amount": formData.amount,
      "wallet_id": myWallet?.id,
      "to_wallet_id": formData.to_wallet_id
    }

    addouTransection(data, (res) => {
      if (res.status == 201) {
        setLoading(false);
        setRefresh(refresh + 1)
        onHide();
      } else {
        setLoading(false);
        setError({
          ...error,
          other: true,
        });
      }
    })
  }


  function addInsideTransection() {
    setError({
      title: false,
      description: false,
      type: false,
      amount: false,
      from_wallet_id: false,
      to_wallet_id: false,
      wallet_id: false,
      account_id: false,
      other: false
    });

    const isToWalletRequired = isCheckboxTransferOuChecked && !formData.to_wallet_id;

    if (
      !formData.title ||
      !formData.type ||
      !formData.amount ||
      !formData.description ||
      isToWalletRequired
    ) {
      setError({
        ...error,
        title: !formData.title,
        description: !formData.description,
        type: !formData.type,
        amount: !formData.amount,
        to_wallet_id: isToWalletRequired
      });
      return;
    }
    const data = {
      "title": formData.title,
      "description": formData.description,
      "type": formData.type,
      "amount": formData.amount,
      "wallet_id": myWallet?.id,
      "to_wallet_id": formData.to_wallet_id
    }

    addouTransection(data, (res) => {
      if (res.status == 201) {
        setLoading(false);
        setRefresh(refresh + 1)
        onHide();
      } else {
        setLoading(false);
        setError({
          ...error,
          other: true,
        });
      }
    })
  }

  function addBankTransection() {
    setError({
      title: false,
      description: false,
      type: false,
      amount: false,
      from_wallet_id: false,
      to_wallet_id: false,
      wallet_id: false,
      account_id: false,
      other: false
    });

    if (
      !formData.title ||
      !formData.account_id ||
      !formData.type ||
      !formData.amount ||
      !formData.description
    ) {
      setError({
        ...error,
        title: !formData.title,
        description: !formData.description,
        type: !formData.type,
        amount: !formData.amount,
        account_id: !formData.account_id,
      });
      return;
    }
    const data = {
      "title": formData.title,
      "description": formData.description,
      "type": formData.type,
      "amount": formData.amount,
      "account_id": formData.account_id,
      "to_wallet_id": isSbChecked ? mainWallet?.id : null
    }

    addAccountTransection(data, (res) => {
      if (res.status == 201) {
        setLoading(false);
        setRefresh(refresh + 1)
        onHide();
      } else {
        setLoading(false);
        setError({
          ...error,
          other: true,
        });
      }
    })
  }




  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        animation={true}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            className="text-cl-primary"
            id="contained-modal-title-vcenter"
          >
            {editable ? "Edit" : disabled ? "View" : "Add"} Transaction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            {disabled ? (
              <>

                <div className="text-end">
                  <h5>{transection?.referenceId}</h5>
                </div>
                <div className="row mt-3">
                  <div className="col-4 fw-medium">Title</div>
                  <div className="col-8 text-end">{transection?.title}</div>
                </div>

                <div className="row mt-3">
                  <div className="col-4 fw-medium">Description</div>
                  <div className="col-8 text-end">{transection?.description}</div>
                </div>

                <div className="row mt-3">
                  <div className="col-4 fw-medium">Type</div>
                  <div className="col-8 text-end">{transection?.type}</div>
                </div>

                <div className="row mt-3">
                  <div className="col-4 fw-medium">Amount</div>
                  <div className="col-8 text-end">{transection?.amount}</div>
                </div>

                {
                  transection?.account ? (

                    <div className="row mt-3">
                      <div className="col-4 fw-medium">Combined Account</div>
                      <div className="col-8 text-end">{transection?.account?.account_number} | {transection?.account?.bank_name}</div>
                    </div>
                  ) : null
                }


                {
                  transection?.to_wallet ? (

                    <div className="row mt-3">
                      <div className="col-4 fw-medium">Combined Wallet</div>
                      <div className="col-8 text-end">
                        {transection?.to_wallet?.type === "MAIN" && "SB Wallet"}
                        {transection?.to_wallet?.type === "EXCOM" && transection.to_wallet?.ou?.ouName}
                        {transection?.to_wallet?.type === "PROJECT" && transection.to_wallet?.project?.projectName}
                      </div>

                    </div>
                  ) : null
                }




              </>

            ) : (
              <>
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic example"
                >
                  {(isFinanceAllPolicyAvailable ? methodsAll : methods).map((item, index) => {
                    return (
                      <button
                        onClick={() => {
                          setMethod(item);
                        }}
                        key={index}
                        type="button"
                        className={`btn ${item == method ? "bag-primary text-white" : "text-dark"
                          }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <div className="">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label text-dark"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      name='title'
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`form-control w-100 ${error.title ? "is-invalid" : ""}`}
                      placeholder="title"
                      disabled={disabled}
                    />
                    <div className="invalid-feedback">
                      This field is required.
                    </div>
                  </div>
                </div>

                {method == "Bank" ? (
                  <div className="mt-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label text-dark"
                    >
                      Account
                    </label>
                    <select
                      name='account_id'
                      value={formData.account_id}
                      onChange={handleInputChange}
                      className={`form-control w-100 ${error.account_id ? "is-invalid" : ""}`}
                      aria-label="Large select example"
                      disabled={disabled}
                    >
                      <option selected hidden={true}>Select Account</option>
                      {
                        accounts?.map((item, index) => {
                          return (
                            <option key={index} value={item?.id}>{item?.account_number + " - " + item?.bank_name}</option>
                          )

                        })
                      }
                    </select>
                    <div className="invalid-feedback">
                      This field is required.
                    </div>
                  </div>
                ) : null}

                {method == "Bank" ? (
                  <div class="form-check mt-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      onChange={handleCheckboxChange}
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Transfer to SB
                    </label>
                  </div>
                ) : null}

                <div className="mt-3">
                  <label
                    for="exampleFormControlInput1"
                    className="form-label text-dark"
                  >
                    Type
                  </label>
                  <select
                    aria-label="Large select example"
                    disabled={disabled}
                    name='type'
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`form-control w-100 ${error.type ? "is-invalid" : ""}`}
                  >
                    <option selected>Select Type</option>
                    <option value="CREDIT">Credit</option>
                    <option value="DEBIT">Debit</option>
                  </select>
                  <div className="invalid-feedback">
                    This field is required.
                  </div>
                </div>

                {method == "Inside" && isFinanceAllPolicyAvailable ? (
                  <div class="form-check mt-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      onChange={handleTransferOuCheckboxChange}
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Transfer to Ou Wallets
                    </label>
                  </div>
                ) : null}

                {(method == "Budget" || method == "Inside") && isFinanceAllPolicyAvailable &&
                  isCheckboxTransferOuChecked ? (
                  <div className="mt-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label text-dark"
                    >
                      To Wallet
                    </label>
                    <select
                      name='to_wallet_id'
                      value={formData.to_wallet_id}
                      onChange={handleInputChange}
                      className={`form-control w-100 ${error.to_wallet_id ? "is-invalid" : ""}`}
                      aria-label="Large select example"
                      disabled={disabled}
                    >
                      <option selected hidden={true}>Select a Wallet</option>
                      {
                        ouWallets?.map((item, index) => {
                          return (
                            <option key={index} value={item.id}>{item.ou.ouName}</option>
                          )
                        })
                      }
                    </select>
                    <div className="invalid-feedback">
                      This field is required.
                    </div>
                  </div>
                ) : null}

                {method == "Budget" ? (
                  <div className="mt-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label text-dark"
                    >
                      Project Wallet
                    </label>
                    <select
                      name='to_wallet_id'
                      value={formData.to_wallet_id}
                      onChange={handleInputChange}
                      className={`form-control w-100 ${error.to_wallet_id ? "is-invalid" : ""}`}
                      aria-label="Large select example"
                      disabled={disabled}
                    >
                      <option selected hidden={true}>Select a Wallet</option>
                      {
                        ProjectWallets?.map((item, index) => {
                          return (
                            <option key={index} value={item.id}>{item.project.projectName}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                ) : null}

                <div className="mt-3">
                  <div className="">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label text-dark"
                    >
                      Amount
                    </label>
                    <input
                      type="number"
                      name='amount'
                      value={formData.amount}
                      onChange={handleInputChange}
                      className={`form-control w-100 ${error.amount ? "is-invalid" : ""}`}
                      placeholder="amount"
                      disabled={disabled}
                    />
                    <div className="invalid-feedback">
                      This field is required.
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div class="form-group">
                    <label for="exampleFormControlTextarea1">Description</label>
                    <textarea
                      name='description'
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`form-control w-100 ${error.description ? "is-invalid" : ""}`}
                      rows="3"
                      disabled={disabled}
                    ></textarea>
                    <div className="invalid-feedback">
                      This field is required.
                    </div>
                  </div>
                </div>

                <div className="mt-3 w-100 text-center text-danger">{
                  error.other ? "Failed to add transaction" : ''
                }</div>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          <div>
            <CommonButton onClick={onHide} close={true} text={"Close"} />
          </div>
          {
            disabled ? null : (
              <div>
                <CommonButton onClick={submit} load={loading} text={"Add"} />
              </div>
            )
          }

        </Modal.Footer>
      </Modal>

    </>
  );
};

export default AddTransectionModel;
