import fetch from "node-fetch";
// // // FETCH FUNCTION // // //
export async function toFetch(
  newUrl,
  data,
  method = "POST",
  headers = { Authorization, "Content-Type": "application/json" }
) {
  const options = {
    method: method,
    headers: {
      ...headers,
    },
    redirect: "follow",
  };
  if (data) {
    options["body"] = JSON.stringify(data);
  }
  return await fetch(newUrl, options)
    .then((response) => response.json())
    .then((docInfo) => {
      console.log("response data?", docInfo);
      // return docId.body.txnToken;
      return docInfo;
    })
    .catch((err) => {
      console.log("error in fetch is", err);
      return null;
    });
}
