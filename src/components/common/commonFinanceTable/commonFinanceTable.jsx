import React, { useEffect, useState } from 'react'
import CommonSearch from '../commonSearch/commonSearch';
import CommonTable from '../commonTable/commonTable';
import CommonPagination from '../commonPagination/commonPagination';
import AddTransectionModel from '../../models/addTransectionModel/addTransectionModel';
import { getAccountTransection, getTransection } from '../../../redux/actions/transection';


const CommonFinanceTable = ({ selectedWallet, account, refresh }) => {

  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transectionModelShow, setTransectionModelShow] = useState(false);
  const [disable, setDisable] = useState(false);
  const [editable, setEditable] = useState(false);
  const [selectedTransection, setselectedTransection] = useState(null);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [transactionArray, SettransactionArray] = useState([]);

  const handleCloseTransectionModel = () => {
    setTransectionModelShow(false);
    setDisable(false)
    setEditable(false)
    setId(null)

  }
  const handleShowTransectionModel = () => { setTransectionModelShow(true); }
  const handleSearch = (e) => setSearch(e);

  function viewTransection(transection) {
    setselectedTransection(transection)
    setDisable(true)
    setEditable(false)
    handleShowTransectionModel()
  }

  useEffect(() => {
    if (account) {
      getAccountTransection(
        selectedWallet,
        search,
        currentPage - 1,
        selectedType,
        '',
        '',
        (res) => {
          if (res?.status == 200) {
            const formattedTransactions = res?.data?.data?.content.map(transaction => {
              return {
                ...transaction,
                formattedDateTime: new Date(transaction.date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',   // Jan, Feb, etc.
                  day: 'numeric',    // 1, 2, 3, etc.
                  hour: '2-digit',   // 12-hour format with leading zeros
                  minute: '2-digit', // Minute with leading zeros
                  second: '2-digit', // Second with leading zeros (optional)
                  hour12: true       // Set to `true` for 12-hour format (AM/PM), `false` for 24-hour format
                })
              }
            });
            SettransactionArray(formattedTransactions)
            setTotalPage(res?.data?.data?.totalPages)
          }
        })
    } else {
      getTransection(
        selectedWallet,
        search,
        currentPage - 1,
        selectedType,
        '',
        '',
        (res) => {
          if (res?.status == 200) {
            const formattedTransactions = res?.data?.data?.content.map(transaction => {
              return {
                ...transaction,
                formattedDateTime: new Date(transaction.date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',   // Jan, Feb, etc.
                  day: 'numeric',    // 1, 2, 3, etc.
                  hour: '2-digit',   // 12-hour format with leading zeros
                  minute: '2-digit', // Minute with leading zeros
                  second: '2-digit', // Second with leading zeros (optional)
                  hour12: true       // Set to `true` for 12-hour format (AM/PM), `false` for 24-hour format
                })
              }
            });
            SettransactionArray(formattedTransactions)
            setTotalPage(res?.data?.data?.totalPages)
          }
        })
    }

  }, [selectedWallet, selectedType, search, account, refresh])


  const typeDetail = [
    {
      label: "All Transactions",
      value: ""
    },
    {
      label: "Credit",
      value: "CREDIT"
    },
    {
      label: "Debit",
      value: "DEBIT"
    },
  ]

  const tableHeading = [
    {
      label: "",
      value: "STARTIMAGE"
    },
    {
      label: "Reference Id",
      value: "referenceId"
    },
    {
      label: "Title",
      value: "title"
    },
    {
      label: "Type",
      value: "type"
    },
    {
      label: "Date",
      value: "formattedDateTime"
    },
    {
      label: "Balance",
      value: "balance"
    },
    {
      label: "Amount",
      value: "amount"
    },
    {
      label: "",
      value: "ACTION",
      type: ["VIEW"]
    },
  ]


  useEffect(() => {
    setSelectedType("")
  }, [])
  return (
    <>
      <div>
        <div className='d-flex align-items-center gap-4'>
          {typeDetail.map((item, index) => {
            return (
              <div key={index} className='d-flex flex-column gap-1'>
                <div>
                  <button onClick={() => { setSelectedType(item.value) }} className='border-0 bg-transparent'>{item.label}</button>
                </div>
                {item.value == selectedType ? <div className='bg-third' style={{ height: 2 }}></div> : null}
              </div>
            )
          })}
        </div>
        <div className='d-flex justify-content-end mt-3'>
          <CommonSearch onChange={handleSearch} primary={true} />
        </div>
        <div className='mt-3 p-3 rounded-4 bg-white common-shadow d-flex flex-column justify-content-between table-container'>
          <CommonTable tableHeading={tableHeading} tableData={transactionArray} finance={true} loading={false} viewAction={(transection) => { viewTransection(transection) }} />
          <div className='mt-4 d-flex justify-content-end'>
            <CommonPagination pages={totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>

        </div>

      </div>
      <AddTransectionModel disabled={disable} editable={editable} transection={selectedTransection} show={transectionModelShow} onHide={handleCloseTransectionModel} setTransectionModelShow={setTransectionModelShow} />
    </>
  )
}

export default CommonFinanceTable
