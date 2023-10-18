"use strict";

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}
function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit(arr, i) {
  var _i =
    null == arr
      ? null
      : ("undefined" != typeof Symbol && arr[Symbol.iterator]) ||
        arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (((_x = (_i = _i.call(arr)).next), 0 === i)) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else
        for (
          ;
          !(_n = (_s = _x.call(_i)).done) &&
          (_arr.push(_s.value), _arr.length !== i);
          _n = !0
        );
    } catch (err) {
      (_d = !0), (_e = err);
    } finally {
      try {
        if (
          !_n &&
          null != _i["return"] &&
          ((_r = _i["return"]()), Object(_r) !== _r)
        )
          return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
// * VARIABLES
var urlLocalhost = "http://localhost:3000/";
var urlAws = "https://transferplaylist.onrender.com/";
var urlMain = urlAws;
var typeData = {
  spotify: {
    color: "var(--spotify)",
    icon: /*#__PURE__*/ React.createElement("img", {
      src: "/src/assets/images/ImgSpotify.png",
      height: 50,
      alt: "spotify",
    }),
    eg: "https://open.spotify.com/playlist/523Lk85e0sFkOMId4o",
    steps: [
      /*#__PURE__*/ React.createElement(
        "div",
        {
          key: Math.random(),
        },
        /*#__PURE__*/ React.createElement("h2", null, "From browser"),
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          "1. open ope.spotify.com on any browser"
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          "2. copy url from search bar"
        )
      ),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          key: Math.random(),
        },
        /*#__PURE__*/ React.createElement("h2", null, "From web app"),
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          "1. Open playlist section "
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          "2. Right click on playlist "
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          null,
          "3. click on share playlist"
        ),
        /*#__PURE__*/ React.createElement("div", null, "4. copy share link")
      ),
    ],
    url: "spotifyToYt",
  },
  youtube: {
    color: "var(--youtube)",
    icon: /*#__PURE__*/ React.createElement("img", {
      src: "/src/assets/images/ImgYt.png",
      height: 50,
      alt: "youtube",
    }),
    eg: "https://www.youtube.com/playlist?list=PLFmYDZOVM51fDkVqNCiiu",
    url: "ytToSpotify",
  },
};
var types = ["spotify to youtube", "youtube to spotify"];

// * ICONS
var IconRightArrow = function IconRightArrow() {
  return /*#__PURE__*/ React.createElement(
    "svg",
    {
      width: "36",
      height: "36",
      viewBox: "0 0 36 36",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
    },
    /*#__PURE__*/ React.createElement("path", {
      d: "M24.015 16.5H7.5C6.675 16.5 6 17.175 6 18C6 18.825 6.675 19.5 7.5 19.5H24.015V22.185C24.015 22.86 24.825 23.19 25.29 22.71L29.46 18.525C29.745 18.225 29.745 17.76 29.46 17.46L25.29 13.275C24.825 12.795 24.015 13.14 24.015 13.8V16.5Z",
      fill: "white",
    })
  );
};

// * COMPONENTS
var TypeButtons = function TypeButtons(_ref) {
  var _ref$from = _ref.from,
    from = _ref$from === void 0 ? "spotify" : _ref$from,
    _ref$setFrom = _ref.setFrom,
    setFrom = _ref$setFrom === void 0 ? function () {} : _ref$setFrom;
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "frc w100",
    },
    types === null || types === void 0
      ? void 0
      : types.map(function (type) {
          var _typeData$from;
          return /*#__PURE__*/ React.createElement(
            "div",
            {
              onClick: function onClick() {
                setFrom(type);
              },
              key: type,
              className: "caps bold12 w100 textCenter hover lightBorder",
              style: {
                borderWidth: 0,
                borderBottomWidth: 1,
                borderBottomColor:
                  type.split("to")[0].trim() == from &&
                  ((_typeData$from = typeData[from]) === null ||
                  _typeData$from === void 0
                    ? void 0
                    : _typeData$from.color),
                padding: "11px 0",
                color:
                  type.split("to")[0].trim() == from
                    ? "var(--impText)"
                    : "var(--lightText)",
              },
            },
            type
          );
        }),
    /*#__PURE__*/ React.createElement(RemoveYtAccountBtn, null)
  );
};
var TransferIcons = function TransferIcons(_ref2) {
  var _typeData$from2, _typeData$to;
  var _ref2$from = _ref2.from,
    from = _ref2$from === void 0 ? "spotify" : _ref2$from,
    _ref2$to = _ref2.to,
    to = _ref2$to === void 0 ? "youtube" : _ref2$to;
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "frcc w100 hover",
    },
    (_typeData$from2 = typeData[from]) === null || _typeData$from2 === void 0
      ? void 0
      : _typeData$from2.icon,
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "mh15",
      },
      /*#__PURE__*/ React.createElement(IconRightArrow, null)
    ),
    (_typeData$to = typeData[to]) === null || _typeData$to === void 0
      ? void 0
      : _typeData$to.icon
  );
};
var SubmitButton = function SubmitButton(_ref3) {
  var _ref3$url = _ref3.url,
    url = _ref3$url === void 0 ? "#" : _ref3$url,
    _ref3$from = _ref3.from,
    from = _ref3$from === void 0 ? "" : _ref3$from,
    _ref3$to = _ref3.to,
    to = _ref3$to === void 0 ? "" : _ref3$to;
  var _React$useState = React.useState(false),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    loading = _React$useState2[0],
    setLoading = _React$useState2[1];
  return /*#__PURE__*/ React.createElement(
    "button",
    {
      style: {
        height: 40,
      },
      disabled: !url || url === "#" || loading,
      className: "priBtn",
      onClick: function onClick() {
        // alert(url);
        setLoading(true);
        console.log("url", url);
        window.location.href = url;
      },
    },
    loading ? "Loading..." : "copy from ".concat(from, " to ").concat(to)
  );
};
var ChangeGetPlaylistFromBtn = function ChangeGetPlaylistFromBtn(_ref4) {
  var _ref4$stepsOf = _ref4.stepsOf,
    stepsOf = _ref4$stepsOf === void 0 ? "" : _ref4$stepsOf,
    _ref4$setStepsOf = _ref4.setStepsOf,
    setStepsOf =
      _ref4$setStepsOf === void 0 ? function () {} : _ref4$setStepsOf;
  return /*#__PURE__*/ React.createElement(
    "select",
    {
      value: stepsOf,
      onChange: function onChange(e) {
        setStepsOf(e.target.value);
      },
      className: "selectStepsOfBtn hover mt10",
    },
    typeData &&
      Object.keys(typeData).map(function (type) {
        return /*#__PURE__*/ React.createElement(
          "option",
          {
            key: type,
          },
          type
        );
      })
  );
};
var HowToGetPlaylistId = function HowToGetPlaylistId(_ref5) {
  var _typeData$stepsOf, _typeData$stepsOf$ste;
  var _ref5$from = _ref5.from,
    from = _ref5$from === void 0 ? "" : _ref5$from;
  var _React$useState3 = React.useState(from),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    stepsOf = _React$useState4[0],
    setStepsOf = _React$useState4[1];
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: "",
    },
    /*#__PURE__*/ React.createElement("h1", null, "How to get playlist url?"),
    /*#__PURE__*/ React.createElement(ChangeGetPlaylistFromBtn, {
      stepsOf: stepsOf,
      setStepsOf: setStepsOf,
    }),
    /*#__PURE__*/ React.createElement(
      "div",
      {
        id: "steps",
      },
      (_typeData$stepsOf = typeData[stepsOf]) === null ||
        _typeData$stepsOf === void 0
        ? void 0
        : (_typeData$stepsOf$ste = _typeData$stepsOf.steps) === null ||
          _typeData$stepsOf$ste === void 0
        ? void 0
        : _typeData$stepsOf$ste.map(function (step) {
            return step;
          })
    )
  );
};
// CHANGE ACCOUNT BUTTON
var RemoveYtAccountBtn = function RemoveYtAccountBtn() {
  return /*#__PURE__*/ React.createElement(
    "button",
    {
      style: {
        height: 40,
      },
      // className="priBtn"
      onClick: function onClick() {
        fetch(urlMain + "removeYtAccount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (res) {
            console.log("response", res, "account remove");
            alert(
              "Current account removed\nYou will be asked to add other account to transfer playlist."
            );
          })
          ["catch"](function (err) {
            console.log(err, "in change yt acc btn");
          });
      },
    },
    "Change Youtube Account"
  );
};

// * MAIN
var GetPlaylistId = function GetPlaylistId(props) {
  var _typeData$from4, _typeData$from5;
  var _React$useState5 = React.useState(""),
    _React$useState6 = _slicedToArray(_React$useState5, 2),
    inputUrl = _React$useState6[0],
    setInputUrl = _React$useState6[1];
  var _React$useState7 = React.useState(null),
    _React$useState8 = _slicedToArray(_React$useState7, 2),
    gotoUrl = _React$useState8[0],
    setGotoUrl = _React$useState8[1];
  var domain = "https://4913-43-248-236-207.in.ngrok.io/";
  var _React$useState9 = React.useState(types[0].split("to")[0].trim()),
    _React$useState10 = _slicedToArray(_React$useState9, 2),
    from = _React$useState10[0],
    setFrom = _React$useState10[1];
  var _React$useState11 = React.useState(types[0].split("to")[1].trim()),
    _React$useState12 = _slicedToArray(_React$useState11, 2),
    to = _React$useState12[0],
    setTo = _React$useState12[1];
  var changeToFrom = function changeToFrom(type) {
    if (type) {
      setFrom(type.split("to")[0].trim());
      setTo(type.split("to")[1].trim());
    }
  };
  var getPlaylistId = function getPlaylistId(url) {
    var urlParts =
      (url === null || url === void 0
        ? void 0
        : url.split("/").filter(function (item) {
            return item && !item.includes("http");
          })) || [];
    if (from == "youtube") {
      // https://www.youtube.com/playlist?list=PLFmYDZOVM51fDVu1od-Yk2URRkVqNCiiu
      if (urlParts.length === 2) {
        var _urlParts$;
        if (
          urlParts[0] === "www.youtube.com" &&
          (_urlParts$ = urlParts[1]) !== null &&
          _urlParts$ !== void 0 &&
          _urlParts$.includes("list=")
        ) {
          return urlParts[1].split("list=")[1].split("&")[0];
        }
      }
    } else {
      // https://open.spotify.com/playlist/523Lk85e0sFkOgPm2MId4o
      if (urlParts.length === 3) {
        var _urlParts$2;
        if (
          urlParts[0] === "open.spotify.com" &&
          urlParts[1] === "playlist" &&
          ((_urlParts$2 = urlParts[2]) === null || _urlParts$2 === void 0
            ? void 0
            : _urlParts$2.length) > 0
        ) {
          return urlParts[2].split(/(&|\?)/)[0];
        }
      }
    }
  };
  var changeUrl = function changeUrl() {
    var playlistId = getPlaylistId(inputUrl);
    if (playlistId) {
      var _typeData$from3;
      // navigate to next url
      var url =
        // "http://192.168.18.107:3000/" +
        urlMain +
        ((_typeData$from3 = typeData[from]) === null ||
        _typeData$from3 === void 0
          ? void 0
          : _typeData$from3.url) +
        "?playlistId=".concat(playlistId);
      // console.log("playlistId", playlistId);
      // navigate(url);
      setGotoUrl(url);
    } else {
      setGotoUrl("#");
    }
  };
  React.useEffect(
    function () {
      changeUrl();
    },
    [inputUrl, from]
  );

  // * CONSOLE
  // console.log(props,"props");
  console.log(
    from,
    "to",
    to,
    (_typeData$from4 = typeData[from]) === null || _typeData$from4 === void 0
      ? void 0
      : _typeData$from4.url
  );
  return /*#__PURE__*/ React.createElement(
    React.Fragment,
    null,
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: "fcc commonBox",
      },
      /*#__PURE__*/ React.createElement(TypeButtons, {
        from: from,
        setFrom: changeToFrom,
      }),
      /*#__PURE__*/ React.createElement(
        "div",
        {
          className: "p10 mb10",
          style: {
            width: "100%",
          },
        },
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "mt30 mb30",
          },
          /*#__PURE__*/ React.createElement(TransferIcons, {
            from: from,
            to: to,
          })
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            className: "frc",
            style: {
              flexWrap: "wrap",
            },
          },
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "regu12 paraColor mr10 mb5",
            },
            "Enter or paste ".concat(from, " playlist url")
          ),
          /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "regu10 lightColor mb5",
            },
            "(Eg: ".concat(
              (_typeData$from5 = typeData[from]) === null ||
                _typeData$from5 === void 0
                ? void 0
                : _typeData$from5.eg,
              ")"
            )
          )
        ),
        /*#__PURE__*/ React.createElement("input", {
          type: "text",
          className: "inputBox mb10",
          maxLength: 200,
          style: {
            height: 46,
            borderColor: !inputUrl
              ? "var(--lightBg)"
              : gotoUrl == "#"
              ? "var(--red)"
              : "var(--green)",
          },
          value: inputUrl,
          onChange: function onChange(e) {
            console.log(e.target.value);
            setInputUrl(e.target.value);
          },
          name: "playlistId",
        }),
        /*#__PURE__*/ React.createElement(SubmitButton, {
          url: gotoUrl,
          from: from,
          to: to,
        })
      )
    ),
    /*#__PURE__*/ React.createElement("div", {
      className: "mt40",
    }),
    /*#__PURE__*/ React.createElement(HowToGetPlaylistId, {
      from: from,
    })
  );
};

// * TO RENDER IN HTML
var home = document.getElementById("home");
var root = ReactDOM.createRoot(home);
root.render(
  /*#__PURE__*/ React.createElement(
    React.Fragment,
    null,
    /*#__PURE__*/ React.createElement(GetPlaylistId, home.dataset)
  )
);
