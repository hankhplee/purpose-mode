import { useState } from "react"
import { sendToContentScript } from "@plasmohq/messaging"
import { useChromeStorageLocal } from "use-chrome-storage";
import "./ToggleSwitch.css";

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
               name={label}
               id={label}
               checked={checked}
               onChange={(e) => {
                 update(e.target.checked);
                 setBool(storage_var, e.target.checked);
                 const resp = sendToContentScript({
                  name: "toggle",
                  body: {"button": storage_var, "state": e.target.checked}
                })
               }} />

        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
}

function GlobalSwitches() {
  const [desaturate, setDesaturate] =
    useChromeStorageLocal("Desaturate", false);


  return (
    <div>
    <h3>Global options</h3>
    <ToggleSwitch
      label="Desaturate"
      storage_var="Desaturate"
      checked={desaturate}
      update={setDesaturate}
    />
    <hr />
    </div>
  );
}

function LinkedInSwitches() {
  const [declutter, setDeclutter] =
    useChromeStorageLocal("LinkedInDeclutter", false);
  const [recomms, setRecomms] =
    useChromeStorageLocal("LinkedInRecomms", false);
  const [notif, setNotif] =
    useChromeStorageLocal("LinkedInNotif", false);

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
       label="No recommendations"
       storage_var="LinkedInRecomms"
       checked={recomms}
       update={setRecomms}
      />
      <ToggleSwitch
       label="No notifications"
       storage_var="LinkedInNotif"
       checked={notif}
       update={setNotif}
      />
    <hr />
    </div>
  )
}

function TwitterSwitches() {
  const [readOnly, setReadOnly] =
    useChromeStorageLocal("TwitterReadOnly", false);
  const [compact, setCompact] =
    useChromeStorageLocal("TwitterCompact", false);
  const [hideClutter, setHideClutter] =
    useChromeStorageLocal("hide-clutter", false);

  return (
    <div>
      <h3>Twitter</h3>
      <ToggleSwitch
        label="Read only"
        storage_var="TwitterReadOnly"
        checked={readOnly}
        update={setReadOnly}
      />
      <ToggleSwitch
       label="Compact layout"
       storage_var="TwitterCompact"
       checked={compact}
       update={setCompact}
      />
      <ToggleSwitch
        label="Hide clutter"
        storage_var="TwitterHideClutter"
        checked={hideClutter}
        update={setHideClutter}
      />
    <hr />
    </div>
  )
}

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
      <ToggleSwitch
        label="Enable"
        storage_var="Enable"
        checked={enabled}
        update={setEnabled}
      />
      <hr />
      </div>
      {
        enabled &&
        <div>
          <GlobalSwitches />
          <TwitterSwitches />
          <LinkedInSwitches />
        </div>
      }

      <a href="https://github.com/brave-experiments/purpose-mode"
         target="_blank">
        GitHub
      </a>
    </div>
  )
}

export default IndexPopup
