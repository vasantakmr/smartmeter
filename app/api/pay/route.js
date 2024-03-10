import { NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const HOST_URL = "http://localhost"

export async function POST(req, res) {

    const body = await req.json();
    console.log("hello", body);
    const transactionid = "Tr-" + uuidv4().toString(36).slice(-6);

    const payload = {
        merchantId: "M22HWWC6SJT62",
        merchantTransactionId: transactionid,
        merchantUserId: 'MUID-' + uuidv4().toString(36).slice(-6),
        amount: body.customAmount ? (body.customAmount * 100) : (body.amount * 100),
        redirectUrl: HOST_URL + `/api/status/${transactionid}`,
        redirectMode: "POST",
        callbackUrl: HOST_URL + `/api/status/${transactionid}`,
        mobileNumber: body.mobileNumber,
        paymentInstrument: {
            type: "PAY_PAGE",
        },
    };


    const dataPayload = JSON.stringify(payload);
    console.log(dataPayload);

    const dataBase64 = Buffer.from(dataPayload).toString("base64");
    console.log(dataBase64);


    const fullURL =
        dataBase64 + "/pg/v1/pay" + "9d9dacfb-e754-4cd8-ada5-15535c8a5e30";
    const dataSha256 = sha256(fullURL);

    const checksum = dataSha256 + "###" + "1";
    console.log("c====", checksum);



    const UAT_PAY_API_URL =
        "https://api.phonepe.com/apis/hermes/pg/v1/pay";


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


    console.log(response.status)
    const redirect = response.data.data.instrumentResponse.redirectInfo.url;

    console.log(redirect)
    if (response.status == "200") 
        return Response.json(
            { success: true, redirecturl: redirect },
            { status: 200 }
        )

    else return NextResponse.redirect(HOST_URL + "/failure", {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
    });



}
