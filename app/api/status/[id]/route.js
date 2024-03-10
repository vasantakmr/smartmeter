import { NextResponse } from "next/server";
import sha256 from "crypto-js/sha256";
import axios from "axios";

export async function POST(req, res) {
  const data = await req.formData();
  console.log(data);
  const status = data.get("code");
  const merchantId = data.get("merchantId");
  const transactionId = data.get("transactionId");

  const st =
    `/pg/v1/status/${merchantId}/${transactionId}` +
    `9d9dacfb-e754-4cd8-ada5-15535c8a5e30`;
  // console.log(st)
  const dataSha256 = sha256(st);

  console.log("____________________________________________________________________________________________________________________________________________________")
  console.log(merchantId, transactionId, st, status)
  const checksum = dataSha256 + "###" + process.env.NEXT_PUBLIC_SALT_INDEX;
  console.log(checksum);




  const options = {
    method: "GET",
    url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${transactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };
  console.log("____________________________________________________________________________________________________________________________________________________")

  // CHECK PAYMENT STATUS
  const response = await axios.request(options);
  console.log("r===", response.data.code);


  if (response.data.code == "PAYMENT_SUCCESS")
    return NextResponse.redirect("https://smartmeter-live.vercel.app/success", {
      status: 301,
    });
  else return NextResponse.redirect("https://smartmeter-live.vercel.app/failure", {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  });


}
