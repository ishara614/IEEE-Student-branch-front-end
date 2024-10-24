import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { getAccountTransection, getTransection } from '../../../redux/actions/transection';


const FinanceChart = ({ account, selectedWallet }) => {

  const [income, setIncome] = useState();
  const [expence, setExpence] = useState()
  const [time, setTime] = useState();
  const [transactionArray, SettransactionArray] = useState([]);

  useEffect(() => {
    if (account) {
      getAccountTransection(
        selectedWallet,
        '',
        0,
        '',
        '',
        '',
        (res) => {
          if (res?.status == 200) {
            SettransactionArray(res?.data?.data?.content)
          }
        })
    } else {
      getTransection(
        selectedWallet,
        '',
        0,
        '',
        '',
        '',
        (res) => {
          if (res?.status == 200) {
            SettransactionArray(res?.data?.data?.content)
          }
        })
    }

  }, [selectedWallet, account])

  useEffect(() => {
    setIncome([31, 40, 28, 51, 42, 109, 100])
    setExpence([11, 32, 45, 32, 34, 52, 41])
    setTime([
      "2018-09-19T00:00:00.000Z",
      "2018-09-20T01:30:00.000Z",
      "2018-09-21T02:30:00.000Z",
      "2018-09-22T03:30:00.000Z",
      "2018-09-23T04:30:00.000Z",
      "2018-09-24T05:30:00.000Z",
      "2018-09-25T06:30:00.000Z",
    ])
  }, [])

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
                <input type="date" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
              </div>
            </div>

            <div className='col-md-1 text-center'>
              to
            </div>
            <div className='col-md-5'>
              <div className="input-group input-group-sm">
                <input type="date" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
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
