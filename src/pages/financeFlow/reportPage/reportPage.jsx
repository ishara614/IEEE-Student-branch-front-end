import React, { useEffect, useState } from 'react'
import logo from '../../../assets/images/logo.png'
import CommonTable from '../../../components/common/commonTable/commonTable'
import CommonButton from '../../../components/common/commonButton/commonButton'
import { usePDF } from 'react-to-pdf';
import { useSelector } from 'react-redux';
import CommonLoader from '../../../components/common/commonLoader/commonLoader';
import { useNavigate } from 'react-router-dom';
import { PolicyValidate } from '../../../utils/valitations/Valitation';
import { getMyExomWallet } from '../../../redux/actions/wallet';
import { getTransection } from '../../../redux/actions/transection';



const ReportPage = () => {
    const { toPDF, targetRef } = usePDF({ filename: 'report.pdf' });
    const userData = useSelector((state) => state.user.userData);
    const [pageLoading, setPageLoading] = useState(true);
    const navigate = useNavigate();
    const [myWallet, setMyWallet] = useState(null);
    const [transactionArray, SettransactionArray] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startDatenormal, setStartDatenormal] = useState('');
    const [endDatenormal, setEndDatenormal] = useState('');

    useEffect(() => {
        setPageLoading(true)
        if (userData) {
            const isFinanceAvailable = PolicyValidate(userData, "FINANCE");
            const isFinanceTransectionAvailable = PolicyValidate(userData, "FINANCE_TRANSACTION");
            if (isFinanceAvailable && isFinanceTransectionAvailable) {
                setPageLoading(false);
                getMyExomWallet((res) => {
                    if (res?.status == 200) {
                        setMyWallet(res?.data?.data)
                    }
                })
            } else {
                navigate('/dashboard')

            }
        }
    }, [userData])


    useEffect(() => {
        getTransection(
            myWallet?.id,
            '',
            0,
            '',
            startDate,
            endDate,
            (res) => {
                if (res?.status == 200) {
                    SettransactionArray(res?.data?.data?.content)
                }
            })




    }, [myWallet, endDate, startDate])

    const formatDateToISO = (date) => {
        if (!date) return '';
        const isoDate = new Date(date).toISOString();
        // Remove the milliseconds part (optional)
        return isoDate.split('.')[0];
      };


    const handleStartDateChange = (date) => {
        setStartDatenormal(date);
        setStartDate(formatDateToISO(date))
    }

    const handleEndDateChange = (date) => {
        setEndDatenormal(date);
        setEndDate(formatDateToISO(date))
    }


    const tableHeading = [
        {
            label: "Reference ID",
            value: "referenceId"
        },
        {
            label: "Date",
            value: "date"
        },
        {
            label: "Transection Details",
            value: "TRANSECTION"
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



    return (
        <>

            {pageLoading ? (
                <CommonLoader />
            ) : (
                <>
                    <div className='d-flex justify-content-end pe-5'><div><CommonButton onClick={() => toPDF()} text={"Download"} /></div></div>
                    <div className='mb-5 p-5' ref={targetRef}>
                        <div className='d-flex justify-content-end'>
                            <div className='row align-items-center gap-3 justify-content-center'>
                                <div className='col-md-5'>
                                    <div className="input-group input-group-sm">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={startDatenormal}
                                            onChange={(e) => handleStartDateChange(e.target.value)}  // Update start date state
                                            aria-label="Sizing example input"
                                            aria-describedby="inputGroup-sizing-sm"
                                        />
                                    </div>
                                </div>

                                <div className='col-md-1 text-center'>
                                    to
                                </div>

                                <div className='col-md-5'>
                                    <div className="input-group input-group-sm">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={endDatenormal}
                                            onChange={(e) => handleEndDateChange(e.target.value)}  // Update end date state
                                            aria-label="Sizing example input"
                                            aria-describedby="inputGroup-sizing-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className='mt-5 d-flex justify-content-between flex-wrap flex-md-row-reverse gap-4'>
                            <div className='d-flex flex-column justify-content-between'>
                                <img src={logo} style={{ width: 200 }} />
                            </div>
                            <div className='flex flex-column'>
                                <div>
                                    <h4>Finance Report</h4>
                                </div>
                                <div className='d-flex mt-2 gap-5 justify-content-between'>
                                    <div className='text-black-50'>Invoice Date</div>
                                    <div><h6>Sep 24, 2023</h6></div>
                                </div>
                                <div className='d-flex  mt-2 gap-5 justify-content-between'>
                                    <div className='text-black-50'>Due Date</div>
                                    <div><h6>Sep 30, 2023</h6></div>
                                </div>
                                <div className='d-flex  mt-2 gap-5 justify-content-between'>
                                    <div className='text-black-50'>Initial Amount</div>
                                    <div><h6>LKR 12000.00</h6></div>
                                </div>
                            </div>

                        </div> */}

                        <div className='mt-4'>
                            <CommonTable tableHeading={tableHeading} finance={true} report={true} tableData={transactionArray} primary={true} loading={false} />
                        </div>

                        {/* <div className='mt-5 d-flex justify-content-end'>
                            <div className='flex flex-column' style={{ minWidth: 320 }}>
                                <div className='d-flex  mt-2 gap-5 justify-content-between'>
                                    <div className='text-black-50'>Initial Amount</div>
                                    <div><h6>1200000.00</h6></div>
                                </div>
                                <div className='d-flex  mt-2 gap-5 justify-content-between'>
                                    <div className='text-black-50'>Credit</div>
                                    <div><h6 style={{ color: "#16DBAA" }}>+12000.00</h6></div>
                                </div>
                                <div className='d-flex  mt-2 gap-5 justify-content-between'>
                                    <div className='text-black-50'>Debit</div>
                                    <div><h6 style={{ color: "#FE5C73" }}>-12000.00</h6></div>
                                </div>
                                <hr className='text-black-50' />
                                <div className='d-flex  mt-2 gap-5 justify-content-between'>
                                    <div className='h4'>Balance</div>
                                    <div><h4>12000.00</h4></div>
                                </div>
                                <hr className='text-black-50' />
                            </div>
                        </div> */}
                    </div>
                </>
            )}
        </>
    )
}

export default ReportPage
