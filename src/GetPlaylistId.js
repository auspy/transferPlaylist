// * VARIABLES
const urlLocalhost = "http://localhost:3000/";
const urlAws = "https://transferplaylist.onrender.com/";
const urlMain = urlAws;
const typeData = {
  spotify: {
    color: "var(--spotify)",
    icon: (
      <img
        src="/src/assets/images/ImgSpotify.png"
        height={50}
        alt={"spotify"}
      ></img>
    ),
    eg: "https://open.spotify.com/playlist/523Lk85e0sFkOMId4o",
    steps: [
      <div key={Math.random()}>
        <h2>From browser</h2>
        <div>1. open ope.spotify.com on any browser</div>
        <div>2. copy url from search bar</div>
      </div>,
      <div key={Math.random()}>
        <h2>From web app</h2>
        <div>1. Open playlist section </div>
        <div>2. Right click on playlist </div>
        <div>3. click on share playlist</div>
        <div>4. copy share link</div>
      </div>,
    ],
    url: "spotifyToYt",
  },
  youtube: {
    color: "var(--youtube)",
    icon: (
      <img src="/src/assets/images/ImgYt.png" height={50} alt={"youtube"}></img>
    ),
    eg: "https://www.youtube.com/playlist?list=PLFmYDZOVM51fDkVqNCiiu",
    url: "ytToSpotify",
  },
};
const types = ["spotify to youtube", "youtube to spotify"];

// * ICONS
const IconRightArrow = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24.015 16.5H7.5C6.675 16.5 6 17.175 6 18C6 18.825 6.675 19.5 7.5 19.5H24.015V22.185C24.015 22.86 24.825 23.19 25.29 22.71L29.46 18.525C29.745 18.225 29.745 17.76 29.46 17.46L25.29 13.275C24.825 12.795 24.015 13.14 24.015 13.8V16.5Z"
        fill="white"
      />
    </svg>
  );
};

// * COMPONENTS
const TypeButtons = ({ from = "spotify", setFrom = () => {} }) => {
  return (
    <div className="frc w100">
      {types?.map((type) => (
        <div
          onClick={() => {
            setFrom(type);
          }}
          key={type}
          className="caps bold12 w100 textCenter hover lightBorder"
          style={{
            borderWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor:
              type.split("to")[0].trim() == from && typeData[from]?.color,
            padding: "11px 0",
            color:
              type.split("to")[0].trim() == from
                ? "var(--impText)"
                : "var(--lightText)",
          }}
        >
          {type}
        </div>
      ))}
      <RemoveYtAccountBtn />
    </div>
  );
};

const TransferIcons = ({ from = "spotify", to = "youtube" }) => {
  return (
    <div className="frcc w100 hover">
      {/* FROM */}
      {typeData[from]?.icon}
      {/* ARROW */}
      <div className="mh15">
        <IconRightArrow />
      </div>
      {/* TO */}
      {typeData[to]?.icon}
    </div>
  );
};

const SubmitButton = ({ url = "#", from = "", to = "" }) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <button
      style={{
        height: 40,
      }}
      disabled={!url || url === "#" || loading}
      className="priBtn"
      onClick={() => {
        // alert(url);
        setLoading(true);
        console.log("url", url);
        window.location.href = url;
      }}
    >
      {loading ? `Loading...` : `copy from ${from} to ${to}`}
    </button>
  );
};

const ChangeGetPlaylistFromBtn = ({ stepsOf = "", setStepsOf = () => {} }) => {
  return (
    <select
      value={stepsOf}
      onChange={(e) => {
        setStepsOf(e.target.value);
      }}
      className={`selectStepsOfBtn hover mt10`}
    >
      {typeData &&
        Object.keys(typeData).map((type) => <option key={type}>{type}</option>)}
    </select>
  );
};

const HowToGetPlaylistId = ({ from = "" }) => {
  const [stepsOf, setStepsOf] = React.useState(from);
  return (
    <div className="">
      <h1>How to get playlist url?</h1>
      <ChangeGetPlaylistFromBtn stepsOf={stepsOf} setStepsOf={setStepsOf} />
      {/* steps */}
      <div id="steps">{typeData[stepsOf]?.steps?.map((step) => step)}</div>
    </div>
  );
};
// CHANGE ACCOUNT BUTTON
const RemoveYtAccountBtn = () => {
  return (
    <button
      style={{
        height: 40,
      }}
      // className="priBtn"
      onClick={() => {
        fetch(urlMain + "removeYtAccount", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((res) => {
            console.log("response", res, "account remove");
            alert(
              "Current account removed\nYou will be asked to add other account to transfer playlist."
            );
          })
          .catch((err) => {
            console.log(err, "in change yt acc btn");
          });
      }}
    >
      Change Youtube Account
    </button>
  );
};

// * MAIN
const GetPlaylistId = (props) => {
  const [inputUrl, setInputUrl] = React.useState("");
  const [gotoUrl, setGotoUrl] = React.useState(null);
  const domain = "https://4913-43-248-236-207.in.ngrok.io/";
  const [from, setFrom] = React.useState(types[0].split("to")[0].trim());
  const [to, setTo] = React.useState(types[0].split("to")[1].trim());
  const changeToFrom = (type) => {
    if (type) {
      setFrom(type.split("to")[0].trim());
      setTo(type.split("to")[1].trim());
    }
  };
  const getPlaylistId = (url) => {
    const urlParts =
      url?.split("/").filter((item) => item && !item.includes("http")) || [];
    if (from == "youtube") {
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
          urlParts[2]?.length > 0
        ) {
          return urlParts[2].split(/(&|\?)/)[0];
        }
      }
    }
  };
  const changeUrl = () => {
    const playlistId = getPlaylistId(inputUrl);
    if (playlistId) {
      // navigate to next url
      const url =
        // "http://192.168.18.107:3000/" +
        urlMain + typeData[from]?.url + `?playlistId=${playlistId}`;
      // console.log("playlistId", playlistId);
      // navigate(url);
      setGotoUrl(url);
    } else {
      setGotoUrl("#");
    }
  };
  React.useEffect(() => {
    changeUrl();
  }, [inputUrl, from]);

  // * CONSOLE
  // console.log(props,"props");
  console.log(from, "to", to, typeData[from]?.url);
  return (
    <>
      {/* BG BOX */}
      <div className="fcc commonBox">
        {/* TYPE BUTTONS */}
        <TypeButtons from={from} setFrom={changeToFrom} />
        {/* CONTENT BOX */}
        <div className="p10 mb10" style={{ width: "100%" }}>
          {/* TYPES ICONS */}
          <div className="mt30 mb30">
            <TransferIcons from={from} to={to} />
          </div>
          <div className="frc" style={{ flexWrap: "wrap" }}>
            <div className="regu12 paraColor mr10 mb5">{`Enter or paste ${from} playlist url`}</div>
            <div className="regu10 lightColor mb5">{`(Eg: ${typeData[from]?.eg})`}</div>
          </div>
          <input
            type={"text"}
            className={"inputBox mb10"}
            maxLength={200}
            style={{
              height: 46,
              borderColor: !inputUrl
                ? "var(--lightBg)"
                : gotoUrl == "#"
                ? "var(--red)"
                : "var(--green)",
            }}
            value={inputUrl}
            onChange={(e) => {
              console.log(e.target.value);
              setInputUrl(e.target.value);
            }}
            name={"playlistId"}
          />
          <SubmitButton url={gotoUrl} from={from} to={to} />
        </div>
      </div>
      <div className="mt40" />
      {<HowToGetPlaylistId from={from} />}
    </>
  );
};

// * TO RENDER IN HTML
const home = document.getElementById("home");
const root = ReactDOM.createRoot(home);
root.render(<>{<GetPlaylistId {...home.dataset} />}</>);
