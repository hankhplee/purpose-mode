import { useState, useEffect } from "react"
import { useCollapse } from "react-collapsed";
import { sendToContentScript } from "@plasmohq/messaging"
import { sendToBackground } from "@plasmohq/messaging"
import { useChromeStorageLocal } from "use-chrome-storage";
import "./ToggleSwitch.css";
import "./mystyles.css";
import yesIcon from "data-base64:~assets/yes.png";
import noIcon from "data-base64:~assets/no.png";
import setting from "data-base64:~assets/settings.png";
import upIcon from "data-base64:~assets/up.png";
import downIcon from "data-base64:~assets/down.png";

const extName = "Purpose Mode";

function setBool(key: string, value: boolean) {
    console.log("Setting '" + key + "' to '" + value + "'.");
    chrome.storage.local.set({key: JSON.stringify(value)});
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

function GlobalSwitch({ label, storage_var, checked, update }) {
  var switchColor;
  var switchText;
  if(checked){
    switchColor = "is-primary";
    switchText = "On";
  }
  else{
    switchColor = "is-danger";
    switchText = "Off";
  }
  
  return (
  <div className={"box hero "+switchColor}>
    <div className="columns is-mobile"
    style={{height: "55px"}}
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
                      body: {"button": storage_var, "state": e.target.checked}
                    })
                  }} />

            <label className="label" htmlFor={storage_var}>
              <span className="toggleswitch-inner" />
              <span className="toggleswitch-switch" />
            </label>
          </div>
          <p className="is-size-7	has-text-centered"
            style={{width: "37px"}}>
            {switchText}
          </p>
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
    <div className="content">
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
    <div>
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
    <div>
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
    <div>
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
    <div>

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

function ExpandableMenu({name, matchURL, Switches}) {
  const {
    getCollapseProps,
    getToggleProps,
    isExpanded,
    setExpanded,
  } = useCollapse();

  useEffect(() => {
    const fetchURL = async () => {
      const url = await getTabURL();
      if (matchURL === ""){
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
          { isExpanded ?
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
  const [enabled, setEnabled] = useChromeStorageLocal("Enable", false);
  const uid = useChromeStorageLocal("uid");

  return (
    <div
      style={{
        // display: "flex",
        // flexDirection: "column",
        padding: 16,
        width: "300px"
      }}>
    <div id="hero" className="block">
      <div className="columns is-mobile">
        <div className="column has-text-right">
          <div id="dropdown_setting" className="dropdown is-right">
            <div className="dropdown-trigger">
              <span>
                <img id="setting_trigger" style={{cursor:"pointer"}} src={setting} 
                onClick={(e) => {
                  var dropdown_setting = document.getElementById("dropdown_setting");
                  var dropdown_setting_class = dropdown_setting.getAttribute('class');
                  if (dropdown_setting_class == "dropdown is-right") {
                    dropdown_setting.setAttribute('class', "dropdown is-right is-active");
                  }
                  else {
                    dropdown_setting.setAttribute('class', "dropdown is-right");
                  }
                }}
                />
              </span>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
              <div className="dropdown-content has-text-centered">
                <div className="dropdown-item">
                  <p className="heading">ID</p> 
                  <p id="userId">{uid}</p>
                </div> 
                <div className="dropdown-item">
                  <button className="button is-small" id="test_notification"
                  onClick={(e) => {
                    const resp = sendToBackground({
                    name: "test notification"
                    })
                  }} 
                  >Test notification</button> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<<<<<<< HEAD
    <nav className="level is-mobile block">
=======
    <nav className="level is-mobile">
>>>>>>> 9cf21d4 (Added ESM study interface)
      <div className="level-item has-text-centered">
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
      </div>
    </nav>
    <nav className="level is-mobile">
      <div className="level-item has-text-centered">
        <button className="button is-info is-small" id="questionnaire"
          onClick={(e) => {
            const resp = sendToBackground({
            name: "open questionnaire",
          })
          }} 
        >Questionnaire</button>
      </div>
    </nav>
<<<<<<< HEAD

      <div className="block">  
        <ExpandableMenu
            name="Block autoplay setting"
            matchURL=""
            Switches={AutoPlaySwitch}
            />
      </div>
=======
>>>>>>> 9cf21d4 (Added ESM study interface)

      <GlobalSwitch
          label="Purpose Mode"
          storage_var="Enable"
          checked={enabled}
          update={setEnabled}
        />
      {
        enabled &&
        <div>
          <ExpandableMenu
           name="Twitter"
           matchURL="https://twitter.com"
           Switches={TwitterSwitches}
          />

          <ExpandableMenu
           name="YouTube"
           matchURL="https://www.youtube.com"
           Switches={YouTubeSwitches}
          />
          
          <ExpandableMenu
           name="Facebook"
           matchURL="https://www.facebook.com"
           Switches={FacebookSwitches}
          />

          <ExpandableMenu
           name="LinkedIn"
           matchURL="https://www.linkedin.com"
           Switches={LinkedInSwitches}
          />

        </div>
      }
  </div>
  )
}

export default IndexPopup
