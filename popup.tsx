import { useState } from "react"
import { sendToContentScript } from "@plasmohq/messaging"
import { sendToBackground } from "@plasmohq/messaging"
import { useChromeStorageLocal } from "use-chrome-storage";
import "./ToggleSwitch.css";
import "./mystyles.css";
// import "./ui.js";
import yesIcon from "data-base64:~assets/yes.png";
import noIcon from "data-base64:~assets/no.png";
import setting from "data-base64:~assets/settings.png";

const extName = "Purpose Mode";

function setBool(key: string, value: boolean) {
    console.log("Setting '" + key + "' to '" + value + "'.");
    chrome.storage.local.set({key: JSON.stringify(value)});
}

function ToggleSwitch({ label, storage_var, checked, update }) {
  return (
    <div className="columns is-mobile">
      <div className="column is-two-thirds">
        <span className="tag">
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
                    body: {"button": storage_var, "state": e.target.checked}
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

function ButtonSwitch({label, storage_var, current_status}){
  let currentStatus;
  let buttonText = "";
  let buttonClass = "button is-small is-outlined is-fullwidth ";
  if(current_status == true){
    currentStatus = yesIcon;
    buttonText = "Go Unblock";
    buttonClass = buttonClass + "is-danger";
  }else if(current_status == false){
    currentStatus = noIcon;
    buttonText = "Go Block";
    buttonClass = buttonClass + "is-success";
  }

  return (
    <div className="columns is-mobile">
      <div id={label}
        className="column">
          <span className="icon-text">
            <span className="tag">{label}:</span>
            <span className="icon">
            <img className="image is-16x16 fas fa-home" src={currentStatus}></img>
            </span>
          </span>
      </div>
      <div className="column">
        <button id={storage_var}
                className= {buttonClass}
                onClick={(e) => {
                  const resp = sendToBackground({
                  name: "autoplay",
                  body: {"site": storage_var, "state": !current_status}
                })
                }} 
        >{buttonText}</button>
      </div>
    </div>
  );
}

function GlobalSwitches() {
  const [desaturate, setDesaturate] =
    useChromeStorageLocal("Desaturate", false);

  return (
    <div>
    <h3>All sites</h3>
    <ToggleSwitch
      label="Desaturate"
      storage_var="Desaturate"
      checked={desaturate}
      update={setDesaturate}
    />
    </div>
  );
}

function FacebookSwitches() {
  const [compact, setCompact] =
    useChromeStorageLocal("FacebookCompact", false);
  const [finite, setFinite] =
    useChromeStorageLocal("FacebookInfinite", false);
  const [declutter, setDeclutter] =
    useChromeStorageLocal("FacebookDeclutter", false);
  const [recomms, setRecomms] =
    useChromeStorageLocal("FacebookRecomms", false);
  const [notif, setNotif] =
    useChromeStorageLocal("FacebookNotif", false);
  const [feed, setFeed] =
    useChromeStorageLocal("FacebookFeed", false);
  const [desaturate, setDesaturate] =
    useChromeStorageLocal("FacebookDesaturate", false);

  return (
    <div className="box">
      <h6 className="title is-6">Facebook</h6>
      <ToggleSwitch
       label="Compact layout"
       storage_var="FacebookCompact"
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
       storage_var="FacebookNotif"
       checked={notif}
       update={setNotif}
      />
      <ToggleSwitch
       label="Finite newsfeed scrolling"
       storage_var="FacebookInfinite"
       checked={finite}
       update={setFinite}
      />
      <ToggleSwitch
       label="Hide newsfeed"
       storage_var="FacebookFeed"
       checked={feed}
       update={setFeed}
      />
      <ToggleSwitch
       label="Desaturate"
       storage_var="FacebookDesaturate"
       checked={desaturate}
       update={setDesaturate}
      />
    </div>
  )
}

function LinkedInSwitches() {
  const [compact, setCompact] =
    useChromeStorageLocal("LinkedInCompact", false);
  const [declutter, setDeclutter] =
    useChromeStorageLocal("LinkedInDeclutter", false);
  const [recomms, setRecomms] =
    useChromeStorageLocal("LinkedInRecomms", false);
  const [notif, setNotif] =
    useChromeStorageLocal("LinkedInNotif", false);
  const [finite, setFinite] =
    useChromeStorageLocal("LinkedInInfinite", false);
  const [feed, setFeed] =
    useChromeStorageLocal("LinkedInFeed", false);
  const [desaturate, setDesaturate] =
    useChromeStorageLocal("LinkedInDesaturate", false);

  return (
    <div className="box">
      <h6 className="title is-6">LinkedIn</h6>
      <ToggleSwitch
        label="Compact Layout"
        storage_var="LinkedInCompact"
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
       storage_var="LinkedInNotif"
       checked={notif}
       update={setNotif}
      />
      <ToggleSwitch
       label="Finite newsfeed scrolling"
       storage_var="LinkedInInfinite"
       checked={finite}
       update={setFinite}
      />
      <ToggleSwitch
       label="Hide newsfeed"
       storage_var="LinkedInFeed"
       checked={feed}
       update={setFeed}
      />
      <ToggleSwitch
       label="Desaturate"
       storage_var="LinkedInDesaturate"
       checked={desaturate}
       update={setDesaturate}
      />
    </div>
  )
}

function YouTubeSwitches() {
  const [compact, setCompact] =
    useChromeStorageLocal("YouTubeCompact", false);
  const [declutter, setDeclutter] =
    useChromeStorageLocal("YouTubeDeclutter", false)
  const [finite, setFinite] =
    useChromeStorageLocal("YouTubeInfinite", false)
  const [recomm, setRecomm] =
    useChromeStorageLocal("YouTubeRecomm", false)
  const [notif, setNotif] =
    useChromeStorageLocal("YouTubeNotif", false);
  const [feed, setFeed] =
    useChromeStorageLocal("YouTubeFeed", false);
  const [desaturate, setDesaturate] =
    useChromeStorageLocal("YouTubeDesaturate", false);

  return (
    <div className="box">
      <h3 className="title is-6">YouTube</h3>
      <ToggleSwitch
       label="Compact layout"
       storage_var="YouTubeCompact"
       checked={compact}
       update={setCompact}
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
        storage_var="YouTubeNotif"
        checked={notif}
        update={setNotif}
      />
      <ToggleSwitch
        label="Finite newsfeed scrolling"
        storage_var="YouTubeInfinite"
        checked={finite}
        update={setFinite}
      />
      <ToggleSwitch
       label="Hide newsfeed"
       storage_var="YouTubeFeed"
       checked={feed}
       update={setFeed}
      />
      <ToggleSwitch
       label="Desaturate"
       storage_var="YouTubeDesaturate"
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
    useChromeStorageLocal("TwitterCompact", false);
  const [finite, setFinite] =
    useChromeStorageLocal("TwitterInfinite", false);
  const [notif, setNotif] =
    useChromeStorageLocal("TwitterNotif", false);
  const [clutter, setClutter] =
    useChromeStorageLocal("TwitterClutter", false);
  const [recomm, setRecomm] =
    useChromeStorageLocal("TwitterRecomm", false);
  const [feed, setFeed] =
    useChromeStorageLocal("TwitterFeed", false);
  const [desaturate, setDesaturate] =
    useChromeStorageLocal("TwitterDesaturate", false);

  return (
    <div className="box">
      <h6 className="title is-6">Twitter</h6>
      {/* <ToggleSwitch
        label="Read only"
        storage_var="TwitterReadOnly"
        checked={readOnly}
        update={setReadOnly}
      /> */}
      <ToggleSwitch
       label="Compact layout"
       storage_var="TwitterCompact"
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
       storage_var="TwitterNotif"
       checked={notif}
       update={setNotif}
      />
      <ToggleSwitch
        label="Finite newsfeed scrolling"
        storage_var="TwitterInfinite"
        checked={finite}
        update={setFinite}
      />
      <ToggleSwitch
       label="Hide newsfeed"
       storage_var="TwitterFeed"
       checked={feed}
       update={setFeed}
      />
      <ToggleSwitch
       label="Desaturate"
       storage_var="TwitterDesaturate"
       checked={desaturate}
       update={setDesaturate}
      />
    </div>
  )
}

function AutoPlaySwitch(){
  const [twitterAutoplay] = 
    useChromeStorageLocal("TwitterAutoplay", false);
  const [setTwitterAutoplay] = 
    useChromeStorageLocal("SetTwitterAutoplay", false);
  const [linkedInAutoplay] = 
    useChromeStorageLocal("LinkedInAutoplay", false);
  const [setLinkedInAutoplay] = 
    useChromeStorageLocal("SetLinkedInAutoplay", false);
  const [facebookAutoplay] = 
    useChromeStorageLocal("FacebookAutoplay", false);
  const [setFacebookAutoplay] = 
    useChromeStorageLocal("SetFacebookAutoplay", false);
  const [youTubeAutoplay,setYouTubeAutoplay] = 
    useChromeStorageLocal("YouTubeAutoplay", false);

  return (
    <div className="box">
      <h6 className="title is-6">Block autoplay</h6>

      <ButtonSwitch
      label="Twitter"
      storage_var="TwitterAutoplay"
      current_status={twitterAutoplay}
      />
      <ButtonSwitch
      label="LinkedIn"
      storage_var="LinkedInAutoplay"
      current_status={linkedInAutoplay}
      />
      <ButtonSwitch
      label="Facebook"
      storage_var="FacebookAutoplay"
      current_status={facebookAutoplay}
      />
      <ToggleSwitch
      label="YouTube"
      storage_var="YouTubeAutoplay"
      checked={youTubeAutoplay}
      update={setYouTubeAutoplay}
    />
    </div>
  )

}

function IndexPopup() {
  const [enabled, setEnabled] = useChromeStorageLocal("Enable", false);

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
          <h2 className="title is-4"> {extName}</h2>
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

    
      <AutoPlaySwitch/>
      
      <div className="box hero is-primary">
        <ToggleSwitch
          label="Purpose Mode Enable"
          storage_var="Enable"
          checked={enabled}
          update={setEnabled}
        />
      </div>
      {
        enabled &&
        <div>
          <FacebookSwitches />
          <LinkedInSwitches />
          <TwitterSwitches />
          <YouTubeSwitches />
        </div>
      }
  </div>
  )
}

export default IndexPopup
