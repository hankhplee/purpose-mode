import { useState, useEffect } from "react"
import { useCollapse } from "react-collapsed";
import { sendToContentScript } from "@plasmohq/messaging"
import { sendToBackground } from "@plasmohq/messaging"
import { useChromeStorageLocal } from "use-chrome-storage";
import * as constants from "./constants";
import "./css/ToggleSwitch.css";
import "./css/mystyles.css";
import yesIcon from "data-base64:~assets/yes.png";
import noIcon from "data-base64:~assets/no.png";
import setting from "data-base64:~assets/settings.png";
import upIcon from "data-base64:~assets/up.png";
import downIcon from "data-base64:~assets/down.png";

function setBool(key: string, value: boolean) {
  console.log("Setting '" + key + "' to '" + value + "'.");
  chrome.storage.local.set({ key: JSON.stringify(value) });
}

function ToggleSwitch({ label, storage_var, checked, update }) {
  return (
    <div className="columns is-mobile">
      <div className="column is-two-thirds">
        <span className="tag is-white">
          {label}
        </span>
      </div>
      <div className="column">
        <div className="toggle-switch">
          <input type="checkbox"
            className="toggle-checkbox"
            name={storage_var}
            id={storage_var}
            checked={checked}
            onChange={(e) => {
              update(e.target.checked);
              setBool(storage_var, e.target.checked);
              const resp = sendToContentScript({
                name: "toggle",
                body: { "button": storage_var, "state": e.target.checked }
              })
            }} />

          <label className="label" htmlFor={storage_var}>
            <span className="toggleswitch-inner" />
            <span className="toggleswitch-switch" />
          </label>
        </div>
      </div>
    </div>
  );
}

function YouTubeCompactLayoutToggleSwitch({ label, storage_var, checked, update, label_comm, storage_var_comm, checked_comm, update_comm }) {
  return (
    <div>
      <div className="columns is-mobile">
        <div className="column is-two-thirds">
          <span className="tag is-white">
            {label}
          </span>
        </div>
        <div className="column">
          <div className="toggle-switch">
            <input type="checkbox"
              className="toggle-checkbox"
              name={storage_var}
              id={storage_var}
              checked={checked}
              onChange={(e) => {
                update(e.target.checked);
                update_comm(e.target.checked);
                setBool(storage_var, e.target.checked);
                setBool(storage_var_comm, e.target.checked);
                const resp = sendToContentScript({
                  name: "toggle",
                  body: { "button": storage_var, "state": e.target.checked }
                })
                const resp_comm = sendToContentScript({
                  name: "toggle",
                  body: { "button": storage_var_comm, "state": e.target.checked }
                })
              }} />

            <label className="label" htmlFor={storage_var}>
              <span className="toggleswitch-inner" />
              <span className="toggleswitch-switch" />
            </label>
          </div>
        </div>
      </div>
      <div hidden={!checked}>
        <div className="columns is-mobile"
          style={{ marginTop: "-2.5rem" }}>
          <div className="column is-two-thirds">
            <span className="tag is-rounded is-light"
              style={{ fontSize: ".65rem" }}>
              {label_comm}
            </span>
          </div>
          <div className="column">
            <div className="toggle-switch"
            >
              <input type="checkbox"
                className="toggle-checkbox"
                name={storage_var_comm}
                id={storage_var_comm}
                checked={checked_comm}
                onChange={(e) => {
                  update_comm(e.target.checked);
                  setBool(storage_var_comm, e.target.checked);
                  const resp = sendToContentScript({
                    name: "toggle",
                    body: { "button": storage_var_comm, "state": e.target.checked }
                  })
                }} />

              <label className="label" htmlFor={storage_var_comm}
                style={{ height: "16px" }}
              >
                <span className="toggleswitch-inner" />
                <span className="toggleswitch-switch"
                  style={{ height: "10.5px", width: "10.5px" }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobalSwitch({ label, storage_var, checked, update }) {
  var switchColor;
  var switchText;
  if (checked) {
    switchColor = "is-primary";
    switchText = "On";
  }
  else {
    switchColor = "is-danger";
    switchText = "Off";
  }

  return (
    <div className={"box hero " + switchColor}>
      <div className="columns is-mobile"
        style={{ height: "55px" }}
      >
        <div className="column is-two-thirds">
          <span className={"tag is-medium " + switchColor}>
            {label}
          </span>
        </div>
        {/* <div className="column">
          <span className={"tag is-light " + switchColor}>
            {switchText}
          </span>
        </div> */}
        <div className="column">
          <div className="toggle-switch">
            <input type="checkbox"
              className="toggle-checkbox"
              name={storage_var}
              id={storage_var}
              checked={checked}
              onChange={(e) => {
                update(e.target.checked);
                setBool(storage_var, e.target.checked);
                const resp = sendToContentScript({
                  name: "toggle",
                  body: { "button": storage_var, "state": e.target.checked }
                })
              }} />

            <label className="label" htmlFor={storage_var}>
              <span className="toggleswitch-inner" />
              <span className="toggleswitch-switch" />
            </label>
          </div>
          <p className="is-size-7	has-text-centered"
            style={{ width: "37px" }}>
            {switchText}
          </p>
        </div>
      </div>
    </div>
  );

}

function ButtonSwitch({ label, storage_var, current_status }) {
  let currentStatus;
  let buttonText = "";
  let buttonClass = "button is-small is-outlined is-fullwidth ";
  if (current_status == true) {
    currentStatus = yesIcon;
    buttonText = "Go Unblock";
    buttonClass = buttonClass + "is-danger";
  } else if (current_status == false) {
    currentStatus = noIcon;
    buttonText = "Go Block";
    buttonClass = buttonClass + "is-success";
  }

  return (
    <div className="columns is-mobile">
      <div id={label}
        className="column is-three-fifths">
        <span className="icon-text">
          <span className="tag is-white">{label}:</span>
          <span className="icon">
            <img className="image is-16x16 fas fa-home" src={currentStatus}></img>
          </span>
        </span>
      </div>
      <div className="column">
        <button id={storage_var}
          className={buttonClass}
          onClick={(e) => {
            const resp = sendToBackground({
              name: "autoplay",
              body: { "site": storage_var, "state": !current_status }
            })
          }}
        >{buttonText}</button>
      </div>
    </div>
  );
}

function FacebookSwitches() {
  const [compact, setCompact] =
    useChromeStorageLocal(constants.FacebookCompact, false);
  const [finite, setFinite] =
    useChromeStorageLocal(constants.FacebookInfinite, false);
  const [notif, setNotif] =
    useChromeStorageLocal(constants.FacebookNotif, false);
  const [feed, setFeed] =
    useChromeStorageLocal(constants.FacebookFeed, false);
  const [desaturate, setDesaturate] =
    useChromeStorageLocal(constants.FacebookDesaturate, false);
  // const [comments, setComments] =
  //   useChromeStorageLocal("FacebookComments", false);

  return (
    <div className="content">
      <ToggleSwitch
        label="Compact layout"
        storage_var={constants.FacebookCompact}
        checked={compact}
        update={setCompact}
      />
      {/* <ToggleSwitch
       label="Declutter"
       storage_var="FacebookDeclutter"
       checked={declutter}
       update={setDeclutter}
      />
      <ToggleSwitch
       label="Hide newsfeed recommendations"
       storage_var="FacebookRecomms"
       checked={recomms}
       update={setRecomms}
      /> */}
      <ToggleSwitch
        label="Hide notifications"
        storage_var={constants.FacebookNotif}
        checked={notif}
        update={setNotif}
      />
      <ToggleSwitch
        label="Homepage finite scrolling"
        storage_var={constants.FacebookInfinite}
        checked={finite}
        update={setFinite}
      />
      <ToggleSwitch
        label="Hide homepage feeds"
        storage_var={constants.FacebookFeed}
        checked={feed}
        update={setFeed}
      />
      <ToggleSwitch
        label="Desaturate"
        storage_var={constants.FacebookDesaturate}
        checked={desaturate}
        update={setDesaturate}
      />
      {/* <ToggleSwitch
       label="Hide comments"
       storage_var="FacebookComments"
       checked={comments}
       update={setComments}
      /> */}
    </div>
  )
}

function LinkedInSwitches() {
  const [compact, setCompact] =
    useChromeStorageLocal(constants.LinkedInCompact, false);
  const [notif, setNotif] =
    useChromeStorageLocal(constants.LinkedInNotif, false);
  const [finite, setFinite] =
    useChromeStorageLocal(constants.LinkedInInfinite, false);
  const [feed, setFeed] =
    useChromeStorageLocal(constants.LinkedInFeed, false);
  const [desaturate, setDesaturate] =
    useChromeStorageLocal(constants.LinkedInDesaturate, false);
  // const [comments, setComments] =
  //   useChromeStorageLocal("LinkedInComments", false);

  return (
    <div>
      <ToggleSwitch
        label="Compact Layout"
        storage_var={constants.LinkedInCompact}
        checked={compact}
        update={setCompact}
      />
      {/* <ToggleSwitch
        label="Declutter"
        storage_var="LinkedInDeclutter"
        checked={declutter}
        update={setDeclutter}
      />
      <ToggleSwitch
       label="Hide sidebar recommendations"
       storage_var="LinkedInRecomms"
       checked={recomms}
       update={setRecomms}
      /> */}
      <ToggleSwitch
        label="Hide notifications"
        storage_var={constants.LinkedInNotif}
        checked={notif}
        update={setNotif}
      />
      <ToggleSwitch
        label="Homepage finite scrolling"
        storage_var={constants.LinkedInInfinite}
        checked={finite}
        update={setFinite}
      />
      <ToggleSwitch
        label="Hide homepage feeds"
        storage_var={constants.LinkedInFeed}
        checked={feed}
        update={setFeed}
      />
      <ToggleSwitch
        label="Desaturate"
        storage_var={constants.LinkedInDesaturate}
        checked={desaturate}
        update={setDesaturate}
      />
      {/* <ToggleSwitch
       label="Hide comments"
       storage_var="LinkedInComments"
       checked={comments}
       update={setComments}
      /> */}
    </div>
  )
}

function YouTubeSwitches() {
  const [compact, setCompact] =
    useChromeStorageLocal(constants.YouTubeCompact, false);
  const [comments, setComments] =
    useChromeStorageLocal(constants.YouTubeComments, false);
  const [finite, setFinite] =
    useChromeStorageLocal(constants.YouTubeInfinite, false)
  const [notif, setNotif] =
    useChromeStorageLocal(constants.YouTubeNotif, false);
  const [feed, setFeed] =
    useChromeStorageLocal(constants.YouTubeFeed, false);
  const [desaturate, setDesaturate] =
    useChromeStorageLocal(constants.YouTubeDesaturate, false);

  return (
    <div>
      {/* <ToggleSwitch
       label="Compact layout"
       storage_var="YouTubeCompact"
       checked={compact}
       update={setCompact}
      />
      <SmallToggleSwitch
       label="Remove video comments"
       storage_var="YouTubeComments"
       checked={comments}
       update={setComments}
      /> */}
      <YouTubeCompactLayoutToggleSwitch
        label="Compact layout"
        storage_var={constants.YouTubeCompact}
        checked={compact}
        update={setCompact}

        label_comm="Remove video comments"
        storage_var_comm={constants.YouTubeComments}
        checked_comm={comments}
        update_comm={setComments}
      />
      {/* <ToggleSwitch
       label="Declutter"
       storage_var="YouTubeDeclutter"
       checked={declutter}
       update={setDeclutter}
      />
      <ToggleSwitch
       label="Hide video recommendations"
       storage_var="YouTubeRecomm"
       checked={recomm}
       update={setRecomm}
      /> */}
      <ToggleSwitch
        label="Hide notifications"
        storage_var={constants.YouTubeNotif}
        checked={notif}
        update={setNotif}
      />
      <ToggleSwitch
        label="Homepage finite scrolling"
        storage_var={constants.YouTubeInfinite}
        checked={finite}
        update={setFinite}
      />
      <ToggleSwitch
        label="Hide homepage feeds"
        storage_var={constants.YouTubeFeed}
        checked={feed}
        update={setFeed}
      />
      <ToggleSwitch
        label="Desaturate"
        storage_var={constants.YouTubeDesaturate}
        checked={desaturate}
        update={setDesaturate}
      />
    </div>
  )
}

function TwitterSwitches() {
  // const [readOnly, setReadOnly] =
  //   useChromeStorageLocal("TwitterReadOnly", false);
  const [compact, setCompact] =
    useChromeStorageLocal(constants.TwitterCompact, false);
  const [finite, setFinite] =
    useChromeStorageLocal(constants.TwitterInfinite, false);
  const [notif, setNotif] =
    useChromeStorageLocal(constants.TwitterNotif, false);
  const [clutter, setClutter] =
    useChromeStorageLocal(constants.TwitterClutter, false);
  const [recomm, setRecomm] =
    useChromeStorageLocal(constants.TwitterRecomm, false);
  const [feed, setFeed] =
    useChromeStorageLocal(constants.TwitterFeed, false);
  const [desaturate, setDesaturate] =
    useChromeStorageLocal(constants.TwitterDesaturate, false);

  return (
    <div>
      {/* <ToggleSwitch
        label="Read only"
        storage_var="TwitterReadOnly"
        checked={readOnly}
        update={setReadOnly}
      /> */}
      <ToggleSwitch
        label="Compact layout"
        storage_var={constants.TwitterCompact}
        checked={compact}
        update={setCompact}
      />
      {/* <ToggleSwitch
        label="Declutter"
        storage_var="TwitterClutter"
        checked={clutter}
        update={setClutter}
      />
      <ToggleSwitch
       label="Hide sidebar recommendations"
       storage_var="TwitterRecomm"
       checked={recomm}
       update={setRecomm}
      /> */}
      <ToggleSwitch
        label="Hide notifications"
        storage_var={constants.TwitterNotif}
        checked={notif}
        update={setNotif}
      />
      <ToggleSwitch
        label="Homepage finite scrolling"
        storage_var={constants.TwitterInfinite}
        checked={finite}
        update={setFinite}
      />
      <ToggleSwitch
        label="Hide homepage feeds"
        storage_var={constants.TwitterFeed}
        checked={feed}
        update={setFeed}
      />
      <ToggleSwitch
        label="Desaturate"
        storage_var={constants.TwitterDesaturate}
        checked={desaturate}
        update={setDesaturate}
      />
    </div>
  )
}

function AutoPlaySwitch() {
  const [twitterAutoplay] =
    useChromeStorageLocal(constants.TwitterAutoplay, false);
  const [setTwitterAutoplay] =
    useChromeStorageLocal(constants.SetTwitterAutoplay, false);
  const [linkedInAutoplay] =
    useChromeStorageLocal(constants.LinkedInAutoplay, false);
  const [setLinkedInAutoplay] =
    useChromeStorageLocal(constants.SetLinkedInAutoplay, false);
  const [facebookAutoplay] =
    useChromeStorageLocal(constants.FacebookAutoplay, false);
  const [setFacebookAutoplay] =
    useChromeStorageLocal(constants.SetFacebookAutoplay, false);
  const [youTubeAutoplay, setYouTubeAutoplay] =
    useChromeStorageLocal(constants.YouTubeAutoplay, false);

  return (
    <div>

      <ButtonSwitch
        label={constants.Twitter}
        storage_var={constants.TwitterAutoplay}
        current_status={twitterAutoplay}
      />
      <ButtonSwitch
        label={constants.LinkedIn}
        storage_var={constants.LinkedInAutoplay}
        current_status={linkedInAutoplay}
      />
      <ButtonSwitch
        label={constants.Facebook}
        storage_var={constants.FacebookAutoplay}
        current_status={facebookAutoplay}
      />
      <ToggleSwitch
        label={constants.YouTube}
        storage_var={constants.YouTubeAutoplay}
        checked={youTubeAutoplay}
        update={setYouTubeAutoplay}
      />
    </div>
  )

}

function getTabURL() {
  return new Promise<string>((resolve, reject) => {
    try {
      chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      }, function (tabs) {
        resolve(tabs[0].url);
      })
    } catch (e) {
      reject("fail");
    }
  })
}

function ExpandableMenu({ name, matchURL, Switches }) {
  const {
    getCollapseProps,
    getToggleProps,
    isExpanded,
    setExpanded,
  } = useCollapse();

  useEffect(() => {
    const fetchURL = async () => {
      const url = await getTabURL();
      if (matchURL === "") {
        setExpanded(false);
      }
      else if (url.includes(matchURL)) {
        setExpanded(true);
      }
    }
    fetchURL();
  }, []);

  return (
    <div className="collapsible">
      <div className="card">
        <div className="header card-header" {...getToggleProps({
          onClick: () => setExpanded((prevExpanded) => !prevExpanded),
        })}>
          {isExpanded ?
            <p className="card-header-title">{name}
              <span className="icon">
                <img src={upIcon}
                  style={{
                    width: "10px",
                    height: "10px"
                  }}></img>
              </span>
            </p>
            :
            <p className="card-header-title">{name}
              <span className="icon">
                <img src={downIcon}
                  style={{
                    width: "10px",
                    height: "10px"
                  }}></img>
              </span>
            </p>
          }
        </div>

        <div className="card-content" {...getCollapseProps()}>
          <Switches />
        </div>
      </div>
    </div>
  )
}

function IndexPopup() {
  const [enabled, setEnabled] = useChromeStorageLocal(constants.Enable, false);

  return (
    <div
      style={{
        // display: "flex",
        // flexDirection: "column",
        padding: 16,
        width: "300px"
      }}>
      <div id="hero">
        <div>
          <div className="has-text-right">
            <div id="dropdown_setting" className="dropdown is-right">
              <div className="dropdown-trigger">
                <span>
                  {/* <img id="setting_trigger" style={{cursor:"pointer"}} src={setting} /> */}
                </span>
              </div>
              <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content has-text-centered">
                  <div className="dropdown-item">
                    <p className="heading">ID</p>
                    <p id="userId">user id</p>
                  </div>
                  <div className="dropdown-item">
                    <button className="button is-small" id="test_notification">Test notification</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="has-text-centered">
            <h2 className="title is-6"> {constants.ExtName}</h2>
          </div>
        </div>
      </div>
      <nav className="level is-mobile">
        {/* <div className="level-item has-text-centered">
        <div>
          <p className="heading">Today Answered</p>
          <p id="numTodayAnswered">0</p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Total Answered</p>
          <p id="numTotalAnswered">0</p>
        </div>
      </div> */}
      </nav>
      {/* <nav className="level is-mobile">
      <div className="level-item has-text-centered">
        <button className="button is-info is-small" id="questionnaire">Questionnaire</button>
      </div>
    </nav> */}

      <div className="block">
        <ExpandableMenu
          name="Block autoplay setting"
          matchURL=""
          Switches={AutoPlaySwitch}
        />
      </div>

      <GlobalSwitch
        label={constants.ExtName}
        storage_var={constants.Enable}
        checked={enabled}
        update={setEnabled}
      />
      {
        enabled &&
        <div>
          <ExpandableMenu
            name={constants.Twitter}
            matchURL="https://twitter.com"
            Switches={TwitterSwitches}
          />

          <ExpandableMenu
            name={constants.YouTube}
            matchURL="https://www.youtube.com"
            Switches={YouTubeSwitches}
          />

          <ExpandableMenu
            name={constants.Facebook}
            matchURL="https://www.facebook.com"
            Switches={FacebookSwitches}
          />

          <ExpandableMenu
            name={constants.LinkedIn}
            matchURL="https://www.linkedin.com"
            Switches={LinkedInSwitches}
          />

        </div>
      }
    </div>
  )
}

export default IndexPopup
