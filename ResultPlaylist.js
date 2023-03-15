"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var typeDataNew = {
  spotify: {
    color: "var(--spotify)",
    icon: /*#__PURE__*/React.createElement("img", {
      src: "/src/assets/images/ImgSpotify.png",
      height: 50,
      alt: "spotify"
    })
  },
  youtube: {
    color: "var(--youtube)",
    icon: /*#__PURE__*/React.createElement("img", {
      src: "/src/assets/images/ImgYt.png",
      height: 50,
      alt: "youtube"
    })
  }
};

// * COMPONENTS
var TryAgainBtn = React.memo(function () {
  return /*#__PURE__*/React.createElement("div", {
    className: "bannerBox"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "semi14 lightBgColor textCenter"
  }, "to Try with different playlist", " ", /*#__PURE__*/React.createElement("a", {
    href: "/",
    className: "rColor"
  }, /*#__PURE__*/React.createElement("u", null, "click here"))));
});
var Heading = React.memo(function (_ref) {
  var _typeDataNew$type;
  var _ref$type = _ref.type,
    type = _ref$type === void 0 ? "youtube" : _ref$type;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "frcc"
  }, typeDataNew === null || typeDataNew === void 0 ? void 0 : (_typeDataNew$type = typeDataNew[type]) === null || _typeDataNew$type === void 0 ? void 0 : _typeDataNew$type.icon, /*#__PURE__*/React.createElement("h1", {
    className: "caps ml20",
    style: {
      width: "min-content"
    }
  }, type, " playlist")));
});
var IconGoto = React.memo(function () {
  return /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13.3333 6.66667V12.5833L11.5833 10.8333L8.16667 14.0833L5.83333 11.6667L9.25 8.41667L7.41667 6.66667H13.3333ZM2.5 4.16667V15.8333C2.5 16.75 3.25 17.5 4.16667 17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V4.16667C17.5 3.25 16.75 2.5 15.8333 2.5H4.16667C3.25 2.5 2.5 3.25 2.5 4.16667ZM4.16667 4.16667H15.8333V15.8333H4.16667V4.16667Z",
    fill: "white"
  }));
});
var NewPlaylistLink = React.memo(function (_ref2) {
  var _ref2$type = _ref2.type,
    type = _ref2$type === void 0 ? "youtube" : _ref2$type,
    playlistId = _ref2.playlistId;
  var _React$useState = React.useState("#"),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    gotoLink = _React$useState2[0],
    setGoToLink = _React$useState2[1];
  console.log(type, playlistId);
  React.useEffect(function () {
    var link = "#";
    if (type == "spotify") {
      link = "https://open.spotify.com/playlist/".concat(playlistId);
    } else if (type == "youtube") {
      link = "https://www.youtube.com/playlist?list=".concat(playlistId);
    }
    console.log("hrer", link);
    setGoToLink(link);
  }, [type, playlistId]);
  console.log("GOTO LINK", gotoLink);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "regu12 paraColor mr10 mb5"
  }, "Link to new ".concat(type, " playlist")), /*#__PURE__*/React.createElement("div", {
    className: "frc"
  }, /*#__PURE__*/React.createElement("input", {
    className: "inputBox frc",
    style: {
      height: 46,
      borderColor: "var(--impText)",
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
      //   whiteSpace: "nowrap",
      //   overflow: "hidden",
    },

    value: gotoLink,
    type: "text",
    disabled: true
  }), /*#__PURE__*/React.createElement("button", {
    disabled: !gotoLink || gotoLink === "#",
    style: {
      width: "unset",
      height: 46,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeftWidth: 0
    },
    className: "priBtn p10 frc",
    onClick: function onClick() {
      if (gotoLink) {
        // window.location.href = gotoLink;
        window.open(gotoLink, "_blank");
      }
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mr5"
  }, "GOTO"), /*#__PURE__*/React.createElement(IconGoto, null))));
});
var FailedList = function FailedList(_ref3) {
  var list = _ref3.list;
  if (!(Array.isArray(list) && list.length > 0)) {
    return;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", {
    className: "mv20"
  }), /*#__PURE__*/React.createElement("h2", null, "Failed to transfer these songs"), list === null || list === void 0 ? void 0 : list.map(function (item, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: item + i
    }, i + 1, ". ", item);
  }));
};

// * MAIN
var ResultPlaylist = function ResultPlaylist(props) {
  var result = props.result && JSON.parse(props.result);
  console.log("props results", result);
  var failedSongs = result.failed;
  var playlistId = result.playlistId;
  var convertedTo = String(result.type);
  console.log(failedSongs, playlistId);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TryAgainBtn, null), /*#__PURE__*/React.createElement("div", {
    className: "commonBox p20 mt20"
  }, /*#__PURE__*/React.createElement(Heading, {
    type: convertedTo
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt30"
  }), /*#__PURE__*/React.createElement(NewPlaylistLink, {
    type: convertedTo,
    playlistId: playlistId
  }), /*#__PURE__*/React.createElement(FailedList, {
    list: failedSongs
  })));
};

// * TO RENDER IN HTML
var results = document.getElementById("results");
var resultsRoot = ReactDOM.createRoot(results);
resultsRoot.render( /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ResultPlaylist, results.dataset)));