import React from 'react'
import circle from '../../../assets/images/Circles.png'
import Spiral from '../../../assets/images/Spiral.png'
import Spiral2 from '../../../assets/images/Spiral2.png'
import Edit from '../../../assets/icons/editWhite.png'
import View from '../../../assets/icons/viewWhite.png'
const BankAccountCard = () => {
    return (
        <>

            <div className='bag-primary d-flex flex-column rounded-3 p-3' style={{ maxWidth: 360 }}>
                <div className='text-center' style={{ marginTop: -10 }}>
                    <img src={Spiral} className='w-50' />
                </div>

                <div className='d-flex justify-content-end align-items-center gap-2' style={{ marginTop: -40 }}>
                    <div>
                        <button className='border-0 bg-transparent'>
                            <img style={{ width: 21, height: 17 }} src={Edit} />
                        </button>

                    </div>
                    <div>
                        <button className='border-0 bg-transparent'>
                            <img style={{ width: 21, height: 17 }} src={View} />
                        </button>
                    </div>
                </div>
                <div>
                    <div className='text-white' style={{ fontSize: 10 }}>
                        Current Balance
                    </div>
                    <div className='text-white'>
                        <h4>LKR 500000.00</h4>
                    </div>
                </div>
                <div>
                    <div className='text-white' style={{ fontSize: 10 }}>
                        Account Number
                    </div>
                    <div className='text-white'>
                        <h5>12222 22222 222222 2222</h5>
                    </div>
                </div>

                <div className='d-flex justify-content-between align-items-center'>
                    <div>
                        <div className='text-white' style={{ fontSize: 10 }}>
                            Bank
                        </div>
                        <div className='text-white'>
                            <h6>Bank of Ceylon</h6>
                        </div>
                    </div>
                    <div>
                        <div className='text-white text-end' style={{ fontSize: 10 }}>
                            Account Number
                        </div>
                        <div className='text-white text-end'>
                            <h6>Badulla</h6>
                        </div>
                    </div>
                </div>
                <div className='text-start' style={{marginBottom:-15, marginRight:-15, marginTop:-70}}>
                    <img src={Spiral2} />
                </div>
                <div className='text-end' style={{marginBottom:-15, marginRight:-15, marginTop:-50}}>
                    <img src={circle} />
                </div>
            </div>

        </>
    )
}

export default BankAccountCard
