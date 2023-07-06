import { useState } from "react"
import { sendToContentScript } from "@plasmohq/messaging"
import { sendToBackground } from "@plasmohq/messaging"
import { useChromeStorageLocal } from "use-chrome-storage";
import "./ToggleSwitch.css";
import yesIcon from "data-base64:~assets/yes.png";
import noIcon from "data-base64:~assets/no.png";

const extName = "Purpose Mode";

function setBool(key: string, value: boolean) {
    console.log("Setting '" + key + "' to '" + value + "'.");
    chrome.storage.local.set({key: JSON.stringify(value)});
}

function ToggleSwitch({ label, storage_var, checked, update }) {
  return (
    <div className="container">
      <div className="container-child">
        {label}{" "}
      </div>

      <div className="toggle-switch">
        <input type="checkbox"
               className="checkbox"
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
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
}

function ButtonSwitch({label, storage_var, current_status}){
  let currentStatus;
  let buttonText = "";
  if(current_status == true){
    // currentStatus = "V";
    currentStatus = yesIcon;
    buttonText = "Unblock";
  }else{
    currentStatus = noIcon;
    buttonText = "Block";
  }

  return (
    <div className="container">
      <div id={label} className="container-child">
        {label}: <img src={currentStatus} style={{
        width: "20px",
        height: "20px"
      }}></img>
      </div>
      <button id={storage_var}
              onClick={(e) => {
                const resp = sendToBackground({
                 name: "autoplay",
                 body: {"site": storage_var, "state": !current_status}
               })
              }} 
      >{buttonText}</button>
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
  const [finite, setFinite] =
    useChromeStorageLocal("FacebookInfinite", false)
  const [declutter, setDeclutter] =
    useChromeStorageLocal("FacebookDeclutter", false)
  const [recomms, setRecomms] =
    useChromeStorageLocal("FacebookRecomms", false)
  const [notif, setNotif] =
    useChromeStorageLocal("FacebookNotif", false)

  return (
    <div>
      <h3>Facebook</h3>
      <ToggleSwitch
       label="Declutter"
       storage_var="FacebookDeclutter"
       checked={declutter}
       update={setDeclutter}
      />
      <ToggleSwitch
       label="Finite scrolling"
       storage_var="FacebookInfinite"
       checked={finite}
       update={setFinite}
      />
      <ToggleSwitch
       label="Hide notifications"
       storage_var="FacebookNotif"
       checked={notif}
       update={setNotif}
      />
      <ToggleSwitch
       label="Hide recommendations"
       storage_var="FacebookRecomms"
       checked={recomms}
       update={setRecomms}
      />
    </div>
  )
}

function LinkedInSwitches() {
  const [declutter, setDeclutter] =
    useChromeStorageLocal("LinkedInDeclutter", false);
  const [recomms, setRecomms] =
    useChromeStorageLocal("LinkedInRecomms", false);
  const [notif, setNotif] =
    useChromeStorageLocal("LinkedInNotif", false);
  const [finite, setFinite] =
    useChromeStorageLocal("LinkedInInfinite", false)

  return (
    <div>
      <h3>LinkedIn</h3>
      <ToggleSwitch
        label="Declutter"
        storage_var="LinkedInDeclutter"
        checked={declutter}
        update={setDeclutter}
      />
      <ToggleSwitch
       label="Finite scrolling"
       storage_var="LinkedInInfinite"
       checked={finite}
       update={setFinite}
      />
      <ToggleSwitch
       label="Hide notifications"
       storage_var="LinkedInNotif"
       checked={notif}
       update={setNotif}
      />
      <ToggleSwitch
       label="Hide recommendations"
       storage_var="LinkedInRecomms"
       checked={recomms}
       update={setRecomms}
      />
    </div>
  )
}

function YouTubeSwitches() {
  const [declutter, setDeclutter] =
    useChromeStorageLocal("YouTubeDeclutter", false)
  const [finite, setFinite] =
    useChromeStorageLocal("YouTubeInfinite", false)
  const [recomm, setRecomm] =
    useChromeStorageLocal("YouTubeRecomm", false)
  const [notif, setNotif] =
    useChromeStorageLocal("YouTubeNotif", false);

  return (
    <div>
      <h3>YouTube</h3>
      <ToggleSwitch
       label="Declutter"
       storage_var="YouTubeDeclutter"
       checked={declutter}
       update={setDeclutter}
      />
      <ToggleSwitch
        label="Finite scrolling"
        storage_var="YouTubeInfinite"
        checked={finite}
        update={setFinite}
      />
      <ToggleSwitch
        label="Hide notifications"
        storage_var="YouTubeNotif"
        checked={notif}
        update={setNotif}
      />
      <ToggleSwitch
       label="Hide recommendations"
       storage_var="YouTubeRecomm"
       checked={recomm}
       update={setRecomm}
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
    useChromeStorageLocal("TwitterInfinite", false)
  const [notif, setNotif] =
    useChromeStorageLocal("TwitterNotif", false)
  const [clutter, setClutter] =
    useChromeStorageLocal("TwitterClutter", false);
  const [recomm, setRecomm] =
    useChromeStorageLocal("TwitterRecomm", false)

  return (
    <div>
      <h3>Twitter</h3>
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
      <ToggleSwitch
        label="Declutter"
        storage_var="TwitterClutter"
        checked={clutter}
        update={setClutter}
      />
      <ToggleSwitch
        label="Finite scrolling"
        storage_var="TwitterInfinite"
        checked={finite}
        update={setFinite}
      />
      <ToggleSwitch
       label="Hide notifications"
       storage_var="TwitterNotif"
       checked={notif}
       update={setNotif}
      />
      <ToggleSwitch
       label="Hide recommendations"
       storage_var="TwitterRecomm"
       checked={recomm}
       update={setRecomm}
      />
    </div>
  )
}

function AutoPlaySwitch(){
  const [twitterAutoplay] = 
    useChromeStorageLocal("TwitterAutoplay", false);
  const [setTwitterAutoplay] = 
    useChromeStorageLocal("SetTwitterAutoplay", false);

  return (
    <div>
      <h4>Autoplay Blocking</h4>

      <ButtonSwitch
      label="Twitter"
      storage_var="TwitterAutoplay"
      current_status={twitterAutoplay}
      />
      <hr></hr>
    </div>
  )

}

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (msg.type !== "autoplay setting update") {
//       console.log("Ignoring non-autoplay event.");
//       return;
//   }

//   console.log("update autoplay status of " + msg.body.site +
//               "' changed to '" + msg.body.state + "'.");
//   updateAutoPlayStatus(msg.body.site,msg.body.state);
  
// })

// function updateAutoPlayStatus(site, state){
//   var id, updateState;
//   if(site.includes("Twitter")){
//     id = "Twitter";
//   }

//   if(state === true){
//     updateState = id+": V";
//   }
//   else{
//     updateState = id+": X";
//   }
//   console.log("update label: ",updateState);
//   document.getElementById(id).innerHTML = updateState;
// }

function IndexPopup() {
  const [enabled, setEnabled] = useChromeStorageLocal("Enable", false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: "300px"
      }}>

      <h2>{extName}</h2>
      <div>
        <AutoPlaySwitch/>
      </div>
      <div>
        <br/>
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
          <GlobalSwitches />
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
