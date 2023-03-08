import { useEffect, useState } from "react";
import { urlLocalhost } from "../../paths";

const GetPlaylistId = ({ type = "spotify" }) => {
  const [spotifyUrl, setSpotifyUrl] = useState(null);
  const [url, setuUrl] = useState(null);
  const fromYoutube = type === "youtube";
  const domain = "https://4913-43-248-236-207.in.ngrok.io/";
  const getPlaylistId = (url) => {
    const urlParts =
      url?.split("/").filter((item) => item && !item.includes("http")) || [];
    if (fromYoutube) {
      // https://www.youtube.com/playlist?list=PLFmYDZOVM51fDVu1od-Yk2URRkVqNCiiu
      if (urlParts.length === 2) {
        if (
          urlParts[0] === "www.youtube.com" &&
          urlParts[1]?.includes("list=")
        ) {
          return urlParts[1].split("list=")[1].split("&")[0];
        }
      }
    } else {
      // https://open.spotify.com/playlist/523Lk85e0sFkOgPm2MId4o
      if (urlParts.length === 3) {
        if (
          urlParts[0] === "open.spotify.com" &&
          urlParts[1] === "playlist" &&
          urlParts[2].length > 0
        ) {
          return urlParts[2];
        }
      }
    }
  };
  const changeUrl = () => {
    const playlistId = getPlaylistId(spotifyUrl);
    if (playlistId) {
      // navigate to next url
      const url =
        // "http://192.168.18.107:3000/" +
        urlLocalhost +
        (fromYoutube ? "ytToSpotify" : "spotifyToYt") +
        `?playlistId=${playlistId}`;
      // console.log("playlistId", playlistId);
      // navigate(url);
      setuUrl(url);
    }
  };
  useEffect(() => {
    changeUrl();
  }, [spotifyUrl]);
  return (
    <>
      <h1>{fromYoutube ? "Youtube to Spotify" : "Spotify to Youtube"}</h1>
      <label htmlFor="playlistId">{`Enter ${type} playlist url`}</label>
      <input
        type={"text"}
        maxLength={200}
        onChange={(e) => {
          console.log(e.target.value);
          setSpotifyUrl(e.target.value);
        }}
        name={"playlistId"}
      />
      {/* <button
        disabled={spotifyUrl?.length < 1}
        onClick={() => {
          const playlistId = getPlaylistId(spotifyUrl);
          if (playlistId) {
            // navigate to next url
            const url =
              urlLocalhost +
              (fromYoutube ? "ytToSpotify" : "spotifyToYt") +
              `?playlistId=${playlistId}`;
            // console.log("playlistId", playlistId);
            // navigate(url);
            toFetch(url, null, "GET").then((data) => {
              console.log(data, "here");
            });
          } else {
            alert("wrong url");
          }
        }}
      >
        Submit
      </button> */}
      <a
        href={url}
        onClick={() => {
          console.log(url);
        }}
      >
        Submit
      </a>
    </>
  );
};

export default GetPlaylistId;
