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
import facebookIcon from "data-base64:~assets/Facebook.png";
import twitterIcon from "data-base64:~assets/Twitter.png";
import linkedInIcon from "data-base64:~assets/LinkedIn.png";
import youTubeIcon from "data-base64:~assets/YouTube.png";
import axios from 'axios';

const extName = "Purpose Mode";

function startFeatureSampling(storage_var,current_status){
  const resp = sendToBackground({
    name: "feature change",
    body: {"changed_feature": storage_var, "initial_value": current_status}
  });
}

function startFeatureSamplingYouTubeComplactLayout(storage_var,current_status,comment_current_status){
  const resp = sendToBackground({
    name: "feature change",
    body: {"changed_feature": storage_var, "initial_value": current_status, "initial_value_comment":comment_current_status}
  });
}

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
                  startFeatureSampling(storage_var,checked);
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

function StudyToggleSwitch({storage_var, checked, update }) {
  return (
    <div className="columns is-mobile">
      <div className="column is-two-thirds">
        <span className="tag is-warning">Study condition</span>
      </div>
      <div className="column">
        <div className="toggle-switch">
          <input type="checkbox"
                className="toggle-checkbox"
                name={storage_var}
                id={storage_var}
                checked={checked}
                onChange={(e) => {
                  var con = confirm("Are you sure you want to change the study setting? Please confirm this action with the research team.");
                  if (con) {
                    var status_change = e.target.checked;
                    update(e.target.checked);
                    setBool(storage_var, e.target.checked);
                    chrome.storage.local.set({"esm_counter_today": 0});
                    
                    // ping server
                    chrome.storage.local.get("uid").then(function (uid) {
                      var ping = {};
                      var date = new Date(Date.now());
                      var current_time = date.toString().replace(/ \(.*\)/ig, '');
                      var unix_time = new Date().getTime();
                      var status;
                      if(status_change){
                        status = "interventions enabled";
                      }
                      else{
                        status = "interventions disabled";
                      }
                      ping["timestamp"] = current_time;
                      ping["unix_time"] = unix_time
                      ping["status"] = status;
                      axios.post('https://purpose-mode-backend.nymity.ch/submit', {
                          uid: uid.uid,
                          type:"study_status",
                          data: ping
                        })
                        .catch(function (error) {
                          console.log(error);
                          alert("ping failed: "+ error);
                        });
                    });
                  }
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

function YouTubeCompactLayoutToggleSwitch({label, storage_var, checked, update, label_comm, storage_var_comm, checked_comm, update_comm}){
  return(
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
                      body: {"button": storage_var, "state": e.target.checked}
                    })
                    startFeatureSamplingYouTubeComplactLayout(storage_var,checked,checked_comm);
                    const resp_comm = sendToContentScript({
                      name: "toggle",
                      body: {"button": storage_var_comm, "state": e.target.checked}
                    })
                  }} />

            <label className="label" htmlFor={storage_var}>
              <span className="toggleswitch-inner" />
              <span className="toggleswitch-switch" />
            </label>
          </div>
        </div>
      </div>
      <div hidden = {!checked}>
        <div className="columns is-mobile"
          style={{marginTop:"-2.5rem"}}>
          <div className="column is-two-thirds">
            <span className="tag is-rounded is-light"
            style={{fontSize:".65rem"}}>
            > {label_comm}
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
                        body: {"button": storage_var_comm, "state": e.target.checked}
                      })
                      startFeatureSampling(storage_var_comm,checked_comm);
                    }} />

              <label className="label" htmlFor={storage_var_comm}
              style={{height: "16px"}}
              >
                <span className="toggleswitch-inner" />
                <span className="toggleswitch-switch" 
                style={{height:"10.5px", width:"10.5px"}}
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
                  });
                  startFeatureSampling(storage_var,current_status);
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
  // const [comments, setComments] =
  //   useChromeStorageLocal("FacebookComments", false);

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
       label="Homepage finite scrolling"
       storage_var="FacebookInfinite"
       checked={finite}
       update={setFinite}
      />
      <ToggleSwitch
       label="Hide homepage feeds"
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
  // const [comments, setComments] =
  //   useChromeStorageLocal("LinkedInComments", false);

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
       label="Homepage finite scrolling"
       storage_var="LinkedInInfinite"
       checked={finite}
       update={setFinite}
      />
      <ToggleSwitch
       label="Hide homepage feeds"
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
    useChromeStorageLocal("YouTubeCompact", false);
  const [comments, setComments] =
    useChromeStorageLocal("YouTubeComments", false);
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
        storage_var="YouTubeCompact"
        checked={compact}
        update={setCompact}

        label_comm="Remove video comments"
        storage_var_comm="YouTubeComments"
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
        storage_var="YouTubeNotif"
        checked={notif}
        update={setNotif}
      />
      <ToggleSwitch
        label="Homepage finite scrolling"
        storage_var="YouTubeInfinite"
        checked={finite}
        update={setFinite}
      />
      <ToggleSwitch
       label="Hide homepage feeds"
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
        label="Homepage finite scrolling"
        storage_var="TwitterInfinite"
        checked={finite}
        update={setFinite}
      />
      <ToggleSwitch
       label="Hide homepage feeds"
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

  var isSetting = false;
  if (matchURL === "setting"){
    isSetting = true;
  }

  useEffect(() => {
    const fetchURL = async () => {
      const url = await getTabURL();
      if (matchURL === "setting"){
        setExpanded(false);
      }
      else if (url.includes(matchURL)) {
        setExpanded(true);
      }
      else if (matchURL === "https://twitter.com" && url.includes("https://x.com")){
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
            <p className="card-header-title">
              <div hidden = {!isSetting}>
                <img
                  className="image is-16x16"
                  src={setting}>
                </img>
              </div>
              {name}
              <span className="icon">
                <img src={upIcon}
                style={{
                  width: "10px",
                  height: "10px"
                }}></img>
              </span>
            </p>
            :
            <p className="card-header-title">
              <div hidden = {!isSetting}>
                <img
                  className="image is-16x16"
                  src={setting}>
                </img>
              </div>
              {name} 
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
  const [intervention, setIntervention] = useChromeStorageLocal("enableIntervention", false);
  const [uid] = useChromeStorageLocal("uid","Error");
  const [sampled_esm] = useChromeStorageLocal("sampled_esm",null);
  const [sampled_feature_change] = useChromeStorageLocal("sampled_feature_questioinnaire",null);
  const [esm_counter_today] = useChromeStorageLocal("esm_counter_today",0);
  const [esm_counter_total] = useChromeStorageLocal("esm_counter_total",0);
  
  var questionnaireText;
  if(sampled_esm === null){
    questionnaireText = "No Questionnaire";
  } else{
    questionnaireText = "Questionnaire";
  }

  var featureQuestionnaireText;
  var featureButtonHeight;
  if(sampled_feature_change === null){
    featureQuestionnaireText = "No feature changes made";
    featureButtonHeight = "40px";
  } else{
    featureQuestionnaireText = "Feature(s) changed! Tell us why!";
    featureButtonHeight = "55px";
  }

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
                {/* <div className="dropdown-item">
                  <button className="button is-small" id="test_questionnaire"
                  onClick={(e) => {
                    const resp = sendToContentScript({
                    name: "test questionnaire"
                    })
                  }} 
                  >Test questionnaire</button> 
                </div> */}
                <br/>
                <div className="content is-small" hidden = {!intervention}>
                  Forgot about what each feature does?{" "}
                  <a
                  onClick={(e) => {
                    chrome.tabs.create({url: "https://docs.google.com/presentation/d/1Rnzz-iJ-d7cDc__P5x9M3aNJk5M5tPrnQelOa5ts5ZE/edit?usp=sharing"});
                  }}
                  >feature knowledge bank</a>
                </div>
                <div className="content is-small">
                  Extension does not work properly? Follow the{" "}
                  <a
                  onClick={(e) => {
                    chrome.tabs.create({url: "https://docs.google.com/document/d/1cSxZ0V1C6PCBN_9skQdWckvX-83qL8Q8yAdSIGepmqs/edit?usp=sharing"});
                  }}
                  >instructions</a>
                  {" "}to reset the extension.
                </div>
                <div className="content is-small">
                  For any questions, contact us at haopingl@cs.cmu.edu
                </div>
                <hr/>
                <div className="content is-small">
                  <p>Please follow the research team's instructions for the setting:</p>
                  <StudyToggleSwitch
                  storage_var = "enableIntervention"
                  checked = {intervention}
                  update  = {setIntervention}
                  /> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav className="level is-mobile block">
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Today Answered</p>
          <p id="numTodayAnswered">{esm_counter_today}</p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Total Answered</p>
          <p id="numTotalAnswered">{esm_counter_total}</p>
        </div>
      </div>
    </nav>
    <nav className="level is-mobile">
      <div className="level-item has-text-centered">
      <div className="buttons">
        <button className="button is-primary is-small" id="questionnaire"
        style={{width:"120px",height:"40px"}}
        disabled = {sampled_esm===null}
          onClick={(e) => {
            const resp = sendToBackground({
            name: "open questionnaire",
          })
          }} 
        >
        <span>
        {questionnaireText} <br />
          <img 
              className="image is-16x16"
              src={twitterIcon}>
          </img> {" "}
          <img 
              className="image is-16x16"
              src={facebookIcon}>
          </img> {" "}
          <img 
              className="image is-16x16"
              src={linkedInIcon}>
          </img> {" "}
          <img 
              className="image is-16x16"
              src={youTubeIcon}>
          </img>
        </span>
        </button>
        <div hidden = {!intervention} >
        <button 
        className="button is-info is-small" id="feature_questionnaire"
        style={{width:"120px", height:featureButtonHeight, whiteSpace: "normal"}}
        disabled = {sampled_feature_change===null}
          onClick={(e) => {
            const resp = sendToBackground({
            name: "open feature questionnaire",
          })
          }} 
        >{featureQuestionnaireText}</button>
        </div>
        </div>
      </div>
    </nav>

      <div className="block" hidden = {!intervention}>  
        <ExpandableMenu
            name="Block autoplay setting"
            matchURL="setting"
            Switches={AutoPlaySwitch}
            />
      </div>

      <GlobalSwitch
          label="Purpose Mode"
          storage_var="Enable"
          checked={enabled}
          update={setEnabled}
        />
      {
        enabled && 
        <div hidden = {!intervention}>
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
