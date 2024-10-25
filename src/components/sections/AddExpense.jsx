import React, { useEffect, useState } from "react";
import expense from "../../assets/images/expense.png";
import "../../App.css";
import CommonButton from "../common/commonButton/commonButton";
import { addouTransection } from "../../redux/actions/transection";



const AddExpense = ({ selectedWallet, handleClose }) => {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "CREDIT",
    amount: "",
    from_wallet_id: "",
    to_wallet_id: "",
    wallet_id: selectedWallet,
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

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: false }));
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

  function submit() {
    setLoading(true);
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
      !formData.amount ||
      !formData.description
    ) {
      setError({
        ...error,
        title: !formData.title,
        description: !formData.description,
        amount: !formData.amount,

      });
      return;
    }
    const data = {
      "title": formData.title,
      "description": formData.description,
      "type": formData.type,
      "amount": formData.amount,
      "wallet_id": selectedWallet,
    }

    addouTransection(data, (res) => {
      if (res.status == 201) {
        setLoading(false);
        reset();
        handleClose();

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
    <div
      className="container bg-white rounded-4 common-shadow"
    >
      <h5 className="fw-bold text-cl-primary">Add Expenses</h5>
      <div className="row pt-5">
        <div className="col-lg-6 col-md-6 sol-sm-12 ps-5 pe-5">
          <div className="row pb-3">
            <label htmlFor="input-field" className="Text-input-label pb-2">
              Expense
            </label>
            <div>
              <input
                type="text"
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                className={`form-control w-100 ${error.title ? "is-invalid" : ""}`}
                placeholder="Expense"

              />
              <div className="invalid-feedback">
                This field is required.
              </div>
            </div>
          </div>
          <div className="row pb-3">
            <label htmlFor="input-field" className="Text-input-label pb-2">
              Amount
            </label>
            <div>
              <input
                type="number"
                name='amount'
                value={formData.amount}
                onChange={handleInputChange}
                className={`form-control w-100 ${error.title ? "is-invalid" : ""}`}
                placeholder="amount"
              />
              <div className="invalid-feedback">
                This field is required.
              </div>
            </div>
          </div>
          <div className="row pb-3">
            <label htmlFor="input-field" className="Text-input-label pb-2">
              Description
            </label>
            <div>
              <textarea
                type="text"
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                className={`form-control w-100 ${error.title ? "is-invalid" : ""}`}
                placeholder="description"

              />
              <div className="invalid-feedback">
                This field is required.
              </div>
            </div>
          </div>
          <div className="mt-3 w-100 text-center text-danger">{
            error.other ? "Failed to add transaction" : ''
          }</div>
        </div>
        <div
          className="col-lg-6 col-md-6 sol-sm-12"
        // style={{backgroundColor:'red'}}
        >
          <div className="d-flex align-items-center justify-content-center">
            <img src={expense} />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 pb-5 pt-3">
        <CommonButton onClick={submit} text={"Add Expense"} width={200} load={loading} />
        <CommonButton
          text={"Close"}
          close
          onClick={handleClose}
          width={150}
        />
      </div>
    </div>
  );
};

export default AddExpense;
