const typeDataNew = {
  spotify: {
    color: "var(--spotify)",
    icon: (
      <img
        src="/src/assets/images/ImgSpotify.png"
        height={50}
        alt={"spotify"}
      ></img>
    ),
  },
  youtube: {
    color: "var(--youtube)",
    icon: (
      <img src="/src/assets/images/ImgYt.png" height={50} alt={"youtube"}></img>
    ),
  },
};

// * COMPONENTS
const TryAgainBtn = React.memo(() => {
  return (
    <div className="bannerBox">
      <h2 className="semi14 lightBgColor textCenter">
        to Try with different playlist{" "}
        <a href="/" className="rColor">
          <u>click here</u>
        </a>
      </h2>
    </div>
  );
});

const Heading = React.memo(({ type = "youtube" }) => {
  return (
    <>
      <div className="frcc">
        {/* ICON */}
        {typeDataNew?.[type]?.icon}
        {/* HEADING */}
        <h1
          className="caps ml20"
          style={{
            width: "min-content",
          }}
        >
          {type} playlist
        </h1>
      </div>
    </>
  );
});

const IconGoto = React.memo(() => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3333 6.66667V12.5833L11.5833 10.8333L8.16667 14.0833L5.83333 11.6667L9.25 8.41667L7.41667 6.66667H13.3333ZM2.5 4.16667V15.8333C2.5 16.75 3.25 17.5 4.16667 17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V4.16667C17.5 3.25 16.75 2.5 15.8333 2.5H4.16667C3.25 2.5 2.5 3.25 2.5 4.16667ZM4.16667 4.16667H15.8333V15.8333H4.16667V4.16667Z"
        fill="white"
      />
    </svg>
  );
});

const NewPlaylistLink = React.memo(({ type = "youtube", playlistId }) => {
  const [gotoLink, setGoToLink] = React.useState("#");
  console.log(type, playlistId);
  React.useEffect(() => {
    let link = "#";
    if (type == "spotify") {
      link = `https://open.spotify.com/playlist/${playlistId}`;
    } else if (type == "youtube") {
      link = `https://www.youtube.com/playlist?list=${playlistId}`;
    }
    console.log("hrer", link);
    setGoToLink(link);
  }, [type, playlistId]);
  console.log("GOTO LINK", gotoLink);
  return (
    <>
      <div className="regu12 paraColor mr10 mb5">{`Link to new ${type} playlist`}</div>
      <div className="frc">
        <input
          className={"inputBox frc"}
          style={{
            height: 46,
            borderColor: "var(--impText)",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            //   whiteSpace: "nowrap",
            //   overflow: "hidden",
          }}
          value={gotoLink}
          type={"text"}
          disabled={true}
        />
        <button
          disabled={!gotoLink || gotoLink === "#"}
          style={{
            width: "unset",
            height: 46,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderLeftWidth: 0,
          }}
          className="priBtn p10 frc"
          onClick={() => {
            if (gotoLink) {
              // window.location.href = gotoLink;
              window.open(gotoLink,"_blank")
            }
          }}
        >
          <span className="mr5">GOTO</span>
          <IconGoto />
        </button>
      </div>
    </>
  );
});

const FailedList = ({ list }) => {
  if (!(Array.isArray(list) && list.length > 0)) {
    return;
  }
  return (
    <>
      <hr className="mv20" />
      {/* <h1 style={{
    fontSize:24,
    fontWeight:600
  }} >Failed to transfer these songs :</h1> */}
      <h2>Failed to transfer these songs</h2>
      {list?.map((item, i) => (
        <div key={item + i}>
          {i + 1}. {item}
        </div>
      ))}
    </>
  );
};

// * MAIN
const ResultPlaylist = (props) => {
  const result = props.result && JSON.parse(props.result);
  console.log("props results", result);
  const failedSongs = result.failed;
  const playlistId = result.playlistId;
  const convertedTo = String(result.type);
  console.log(failedSongs, playlistId);
  return (
    <>
      {/* TRY AGAIN OPTION */}
      <TryAgainBtn />
      {/* BG BOX */}
      <div className="commonBox p20 mt20">
        {/* PLAYLIST TYPE HEADING */}
        <Heading type={convertedTo} />
        {/* NEW PLAYLIST LINK */}
        <div className="mt30" />
        <NewPlaylistLink type={convertedTo} playlistId={playlistId} />
        {/* FAILED SONGS */}
        <FailedList list={failedSongs} />
      </div>
    </>
  );
};

// * TO RENDER IN HTML
const results = document.getElementById("results");
const resultsRoot = ReactDOM.createRoot(results);
resultsRoot.render(<>{<ResultPlaylist {...results.dataset} />}</>);
