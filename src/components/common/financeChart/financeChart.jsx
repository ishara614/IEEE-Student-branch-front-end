import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { getAccountTransection, getTransection } from '../../../redux/actions/transection';


const FinanceChart = ({ account, selectedWallet,refresh }) => {

  const [income, setIncome] = useState();
  const [expence, setExpence] = useState()
  const [time, setTime] = useState();
  const [transactionArray, SettransactionArray] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startDatenormal, setStartDatenormal] = useState('');
  const [endDatenormal, setEndDatenormal] = useState('');

  useEffect(() => {
    if (account) {
      getAccountTransection(
        selectedWallet,
        '',
        0,
        '',
        startDate,
        endDate,
        (res) => {
          if (res?.status == 200) {
            SettransactionArray(res?.data?.data?.content)
            processTransactionsForChart(res?.data?.data?.content)
          }
        })
    } else {
      getTransection(
        selectedWallet,
        '',
        0,
        '',
        startDate,
        endDate,
        (res) => {
          if (res?.status == 200) {
            SettransactionArray(res?.data?.data?.content)
            processTransactionsForChart(res?.data?.data?.content)
          }
        })
    }

  }, [selectedWallet, account, startDate, endDate,refresh])


  const handleStartDateChange = (date) => {
    setStartDatenormal(date);
    setStartDate(formatDateToISO(date))
  }

  const handleEndDateChange = (date) => {
    setEndDatenormal(date);
    setEndDate(formatDateToISO(date))
  }


  const processTransactionsForChart = (transactions) => {
    const income = [];
    const expense = [];
    const time = [];

    transactions.forEach((txn) => {
      const { amount, type, date } = txn;
      time.push(date);
      if (type === "CREDIT") {
        expense.push(amount);
        income.push(0);
      } else if (type === "DEBIT") {
        expense.push(0);
        income.push(amount);
      }
    });

    setIncome(income);
    setExpence(expense);
    setTime(time);
  };

  const formatDateToISO = (date) => {
    if (!date) return '';
    const isoDate = new Date(date).toISOString();
    // Remove the milliseconds part (optional)
    return isoDate.split('.')[0];
  };


  const state = {
    series: [
      {
        name: 'Income',
        data: income,
      },
      {
        name: 'Expense',
        data: expence,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      colors: ['#396AFF', '#FF82AC'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        categories: time,
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    },
  };


  return (
    <>
      <div className='bg-white rounded-3 d-flex flex-column justify-content-center align-items-center common-shadow'>
        <div className='d-flex w-100 justify-content-between align-items-center p-3 flex-wrap'>
          <div className='text-secondary'>
            <h6>Accounts</h6>
          </div>
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
        <div className='w-100'>
          <div>
            <ReactApexChart options={state.options} series={state.series} type="area" height={240} />
          </div>

        </div>

      </div>


    </>


  )
}

export default FinanceChart 
