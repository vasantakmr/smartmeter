"use client"
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import sha256 from "crypto-js/sha256";
import { redirect } from "next/navigation";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


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
      merchantId: "PGTESTPAYUAT93",
      merchantTransactionId: transactionid,
      merchantUserId: 'MUID-' + uuidv4().toString(36).slice(-6),
      amount: customAmount ? (customAmount * 100) : (amount * 100),
      redirectUrl: `http://localhost:3000/success`,
      redirectMode: "POST",
      callbackUrl: `http://localhost:3000/api/status/${transactionid}`,
      mobileNumber: mobileNumber,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };


    const dataPayload = JSON.stringify(payload);
    console.log(dataPayload);

    const dataBase64 = Buffer.from(dataPayload).toString("base64");
    console.log(dataBase64);


    const fullURL =
      dataBase64 + "/pg/v1/pay" + "875126e4-5a13-4dae-ad60-5b8c8b629035";
    const dataSha256 = sha256(fullURL);

    const checksum = dataSha256 + "###" + "1";
    console.log("c====", checksum);



    const UAT_PAY_API_URL =
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";


    const response = await axios.post(
      UAT_PAY_API_URL,
      {
        request: dataBase64,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );


    const redirect = response.data.data.instrumentResponse.redirectInfo.url;
    router.push(redirect)


  }


  return (
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
  )
}

export default Pay