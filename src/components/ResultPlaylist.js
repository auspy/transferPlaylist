// * COMPONENTS
const TryAgainBtn = React.memo(() => {
  return (
    <div className="bannerBox">
      <h2 className="semi14 lightBgColor textCenter">
        to Try with different playlist{" "}
        <a href="#" className="rColor">
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
        <img
          src="/src/assets/images/ImgYt.png"
          height={50}
          alt={"youtube"}
          className="mr20"
        ></img>
        {/* HEADING */}
        <h1
          className="caps"
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

const IconGoto = () => {
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
};

const NewPlaylistLink = React.memo(
  ({
    type = "youtube",
    gotoLink = "https://www.youtube.com/playlist?list=PLFmYDZOVM51fDVu1od-Yk2URRkVqNCiiu",
  }) => {
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
            defaultValue={gotoLink}
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
              alert(gotoLink);
              // window.location.href = url;
            }}
          >
            <span className="mr5">GOTO</span>
            <IconGoto />
          </button>
        </div>
      </>
    );
  }
);

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
const ResultPlaylist = () => {
  const failedSongs = ["song name"];
  return (
    <>
      {/* TRY AGAIN OPTION */}
      <TryAgainBtn />
      {/* BG BOX */}
      <div className="commonBox p20 mt20">
        {/* PLAYLIST TYPE HEADING */}
        <Heading type={"youtube"} />
        {/* NEW PLAYLIST LINK */}
        <div className="mt30" />
        <NewPlaylistLink type={"youtube"} />
        {/* FAILED SONGS */}
        <FailedList list={failedSongs} />
      </div>
    </>
  );
};

// * TO RENDER IN HTML
const root = ReactDOM.createRoot(document.getElementById("results"));
root.render(<>{<ResultPlaylist />}</>);
