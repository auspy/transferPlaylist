import fetch from "node-fetch";
// // // FETCH FUNCTION // // //
export async function toFetch(
  newUrl,
  data,
  method = "POST",
  accessToken,
  headers = {}
) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    redirect: "follow",
  };
  if (accessToken) {
    options["headers"]["Authorization"] = `Bearer ${accessToken}`;
  }
  if (data) {
    options["body"] = JSON.stringify(data);
  }
  return await fetch(newUrl, options)
    .then((response) => response.json())
    .then((docInfo) => {
      // console.log("response data?", docInfo);
      // return docId.body.txnToken;
      return docInfo;
    })
    .catch((err) => {
      console.log("error in fetch is", err);
     throw new Error(err)
    });
}

export async function delay(ms = 0) {
  return setTimeout(() => {}, ms);
}
