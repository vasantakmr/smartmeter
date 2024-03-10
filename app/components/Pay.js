"use client"
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import sha256 from "crypto-js/sha256";
import { redirect } from "next/navigation";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


const HOST_URL = "http://localhost"

const Pay = () => {

  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleRadioChange = (e) => {
    setAmount(e.target.value);
    setCustomAmount(''); // Clear custom amount on radio selection
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);

    // setAmount(''); // Clear radio button selection on custom amount entry
  };

  const makePayment = async (e) => {

    e.preventDefault();

    if (!amount) {
      setAmount(customAmount)
    }
    // Submit form data (amount and customAmount) using appropriate methods (e.g., fetch)
    console.log('Submitting form:', { mobileNumber, amount, customAmount });

    const transactionid = "Tr-" + uuidv4().toString(36).slice(-6);

    const payload = {
      merchantId: "M22HWWC6SJT62",
      merchantTransactionId: transactionid,
      merchantUserId: 'MUID-' + uuidv4().toString(36).slice(-6),
      amount: customAmount ? (customAmount * 100) : (amount * 100),
      redirectUrl: HOST_URL + `/api/status/${transactionid}`,
      redirectMode: "POST",
      callbackUrl: HOST_URL + `/api/status/${transactionid}`,
      mobileNumber: mobileNumber,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };


    const dataPayload = JSON.stringify(payload);
    // console.log(dataPayload);

    const dataBase64 = Buffer.from(dataPayload).toString("base64");
    // console.log(dataBase64);


    const fullURL =
      dataBase64 + "/pg/v1/pay" + "9d9dacfb-e754-4cd8-ada5-15535c8a5e30";
    const dataSha256 = sha256(fullURL);

    const checksum = dataSha256 + "###" + "1";
    // console.log("c====", checksum);



    const UAT_PAY_API_URL =
      "https://api.phonepe.com/apis/hermes/pg/v1/pay";


    const response = await axios.post(
      HOST_URL+"/api/pay",
      {
        mobileNumber: mobileNumber,
        customAmount: customAmount,
        amount: amount
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );


    console.log(response.data.redirecturl)
    const redirect = response.data.redirecturl;
    router.push(redirect)


  }


  return (
    <>
      <nav className="block w-full max-w-screen-xl px-4 py-2 mx-auto  bg-white border shadow-md rounded-xl border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
        <div className="container flex items-center justify-between mx-auto text-blue-gray-900">
          <a
            href="#"
            className="mr-4 block cursor-pointer py-1.5 font-sans text-base font-medium leading-relaxed text-inherit antialiased"
          >
            Smart Meter
          </a>
          <div className="hidden lg:block">
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">

              <li className="flex items-center p-1 font-sans text-sm antialiased font-medium leading-normal gap-x-2 text-blue-gray-900">
                <svg
                  width={16}
                  height={15}
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 0.5C4.73478 0.5 4.48043 0.605357 4.29289 0.792893C4.10536 0.98043 4 1.23478 4 1.5C4 1.76522 4.10536 2.01957 4.29289 2.20711C4.48043 2.39464 4.73478 2.5 5 2.5H11C11.2652 2.5 11.5196 2.39464 11.7071 2.20711C11.8946 2.01957 12 1.76522 12 1.5C12 1.23478 11.8946 0.98043 11.7071 0.792893C11.5196 0.605357 11.2652 0.5 11 0.5H5ZM2 4.5C2 4.23478 2.10536 3.98043 2.29289 3.79289C2.48043 3.60536 2.73478 3.5 3 3.5H13C13.2652 3.5 13.5196 3.60536 13.7071 3.79289C13.8946 3.98043 14 4.23478 14 4.5C14 4.76522 13.8946 5.01957 13.7071 5.20711C13.5196 5.39464 13.2652 5.5 13 5.5H3C2.73478 5.5 2.48043 5.39464 2.29289 5.20711C2.10536 5.01957 2 4.76522 2 4.5ZM0 8.5C0 7.96957 0.210714 7.46086 0.585786 7.08579C0.960859 6.71071 1.46957 6.5 2 6.5H14C14.5304 6.5 15.0391 6.71071 15.4142 7.08579C15.7893 7.46086 16 7.96957 16 8.5V12.5C16 13.0304 15.7893 13.5391 15.4142 13.9142C15.0391 14.2893 14.5304 14.5 14 14.5H2C1.46957 14.5 0.960859 14.2893 0.585786 13.9142C0.210714 13.5391 0 13.0304 0 12.5V8.5Z"
                    fill="#90A4AE"
                  />
                </svg>
                <a href="https://rinvent.com" className="flex items-center">
                  RiNVeNT
                </a>
              </li>
              <li className="flex items-center p-1 font-sans text-sm antialiased font-medium leading-normal gap-x-2 text-blue-gray-900">
                <svg
                  width={14}
                  height={15}
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 0.5C1.46957 0.5 0.960859 0.710714 0.585786 1.08579C0.210714 1.46086 0 1.96957 0 2.5V4.5C0 5.03043 0.210714 5.53914 0.585786 5.91421C0.960859 6.28929 1.46957 6.5 2 6.5H4C4.53043 6.5 5.03914 6.28929 5.41421 5.91421C5.78929 5.53914 6 5.03043 6 4.5V2.5C6 1.96957 5.78929 1.46086 5.41421 1.08579C5.03914 0.710714 4.53043 0.5 4 0.5H2ZM2 8.5C1.46957 8.5 0.960859 8.71071 0.585786 9.08579C0.210714 9.46086 0 9.96957 0 10.5V12.5C0 13.0304 0.210714 13.5391 0.585786 13.9142C0.960859 14.2893 1.46957 14.5 2 14.5H4C4.53043 14.5 5.03914 14.2893 5.41421 13.9142C5.78929 13.5391 6 13.0304 6 12.5V10.5C6 9.96957 5.78929 9.46086 5.41421 9.08579C5.03914 8.71071 4.53043 8.5 4 8.5H2ZM8 2.5C8 1.96957 8.21071 1.46086 8.58579 1.08579C8.96086 0.710714 9.46957 0.5 10 0.5H12C12.5304 0.5 13.0391 0.710714 13.4142 1.08579C13.7893 1.46086 14 1.96957 14 2.5V4.5C14 5.03043 13.7893 5.53914 13.4142 5.91421C13.0391 6.28929 12.5304 6.5 12 6.5H10C9.46957 6.5 8.96086 6.28929 8.58579 5.91421C8.21071 5.53914 8 5.03043 8 4.5V2.5ZM8 10.5C8 9.96957 8.21071 9.46086 8.58579 9.08579C8.96086 8.71071 9.46957 8.5 10 8.5H12C12.5304 8.5 13.0391 8.71071 13.4142 9.08579C13.7893 9.46086 14 9.96957 14 10.5V12.5C14 13.0304 13.7893 13.5391 13.4142 13.9142C13.0391 14.2893 12.5304 14.5 12 14.5H10C9.46957 14.5 8.96086 14.2893 8.58579 13.9142C8.21071 13.5391 8 13.0304 8 12.5V10.5Z"
                    fill="#90A4AE"
                  />
                </svg>
                <a href="#" className="flex items-center">
                  About
                </a>
              </li>
              <li className="flex items-center p-1 font-sans text-sm antialiased font-medium leading-normal gap-x-2 text-blue-gray-900">
                <svg
                  width={16}
                  height={17}
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16 8.5C16 10.6217 15.1571 12.6566 13.6569 14.1569C12.1566 15.6571 10.1217 16.5 8 16.5C5.87827 16.5 3.84344 15.6571 2.34315 14.1569C0.842855 12.6566 0 10.6217 0 8.5C0 6.37827 0.842855 4.34344 2.34315 2.84315C3.84344 1.34285 5.87827 0.5 8 0.5C10.1217 0.5 12.1566 1.34285 13.6569 2.84315C15.1571 4.34344 16 6.37827 16 8.5ZM10 5.5C10 6.03043 9.78929 6.53914 9.41421 6.91421C9.03914 7.28929 8.53043 7.5 8 7.5C7.46957 7.5 6.96086 7.28929 6.58579 6.91421C6.21071 6.53914 6 6.03043 6 5.5C6 4.96957 6.21071 4.46086 6.58579 4.08579C6.96086 3.71071 7.46957 3.5 8 3.5C8.53043 3.5 9.03914 3.71071 9.41421 4.08579C9.78929 4.46086 10 4.96957 10 5.5ZM8 9.5C7.0426 9.49981 6.10528 9.77449 5.29942 10.2914C4.49356 10.8083 3.85304 11.5457 3.454 12.416C4.01668 13.0706 4.71427 13.5958 5.49894 13.9555C6.28362 14.3152 7.13681 14.5009 8 14.5C8.86319 14.5009 9.71638 14.3152 10.5011 13.9555C11.2857 13.5958 11.9833 13.0706 12.546 12.416C12.147 11.5457 11.5064 10.8083 10.7006 10.2914C9.89472 9.77449 8.9574 9.49981 8 9.5Z"
                    fill="#90A4AE"
                  />
                </svg>
                <a href="mailto:info@rinvent.com" className="flex items-center">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <button
            className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
            type="button"
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </span>
          </button>
        </div>
      </nav>

      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={(e) => makePayment(e)} method="POST">
            <div>
              <label
                htmlFor="Mobile"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mobile Number
              </label>
              <div className="mt-2">
                <input
                  id="Mobile"
                  name="mobile"
                  value={mobileNumber}
                  onChange={(e) => handleMobileNumberChange(e)}
                  required={true}
                  className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <h2>Select Recharge Amount</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="amount100">
                <input
                  type="radio"
                  id="amount100"
                  name="amount"
                  value="100"
                  className="w-4 h-4 mr-2"
                  onChange={handleRadioChange}
                />
                100
              </label>
              <label htmlFor="amount200">
                <input
                  type="radio"
                  id="amount200"
                  name="amount"
                  value="200"
                  className="w-4 h-4 mr-2"
                  onChange={handleRadioChange}
                />
                200
              </label>
              <label htmlFor="amount300">
                <input
                  type="radio"
                  id="amount300"
                  name="amount"
                  value="300"
                  className="w-4 h-4 mr-2"
                  onChange={handleRadioChange}
                />
                300
              </label>
              <label htmlFor="amount500">
                <input
                  type="radio"
                  id="amount500"
                  name="amount"
                  value="500"
                  className="w-4 h-4 mr-2"
                  onChange={handleRadioChange}
                />
                500
              </label>
              <label htmlFor="custom">
                <input
                  type="radio"
                  id="customAmount"
                  name="amount"
                  value="custom"
                  className="w-4 h-4 mr-2"
                  onChange={handleRadioChange}
                />
                Custom
              </label>
            </div>
            {amount === 'custom' && (
              <div className="flex items-center gap-2">
                <label htmlFor="customAmountInput">Enter Amount: </label>
                <input
                  type="number"
                  id="customAmountInput"
                  name="customAmount"
                  min="1"
                  className="rounded-md border border-gray-300 p-2"
                  value={customAmount}
                  required
                  onChange={handleCustomAmountChange}
                />
              </div>
            )}
            <div></div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Pay
              </button>
            </div>
          </form>
        </div>
      </div>
    </>

  )
}

export default Pay
