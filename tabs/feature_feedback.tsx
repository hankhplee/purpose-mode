import { useChromeStorageLocal } from "use-chrome-storage";

import "../mystyles.css";
import facebookIcon from "data-base64:~assets/Facebook.png";
import twitterIcon from "data-base64:~assets/Twitter.png";
import linkedInIcon from "data-base64:~assets/LinkedIn.png";
import youTubeIcon from "data-base64:~assets/YouTube.png";
import axios from 'axios';

function SkipButton({size}){
    
    return(
        <button className={"button is-warning "+size}
            onClick={(e) => {
                var con = confirm("Are you sure to skip and quit this questionnaire?");
                if (con) {
                    // reset feature change cache
                    chrome.storage.local.set({"sampled_feature_questioinnaire": null});
                    chrome.storage.local.set({"sampling_feature_lock": false});
                    window.close();
                }
            }
        }
        >Skip & Close</button>
    );
}

function NoESMPage(){
    return(
        <section className="hero is-info">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title has-text-centered">
                        No feature feedback questionnaire to reply right now. Please close the page and check in later!
                    </h1>
                </div>
            </div>
        </section>
    );
}

function ItemRecord(name,value){
    var featureName;
    var changeValue;
    var changeTextColor;
    if(name === "Compact"){
        featureName = "Compact layout"
    }
    else if(name === "Infinite"){
        featureName = "Finite newsfeed scrolling"
    }
    else if(name === "Notif"){
        featureName = "Hide notifications"
    }
    else if(name === "Feed"){
        featureName = "Hide newsfeed"
    }
    else if(name === "Desaturate"){
        featureName = "FacebookDesaturate"
    }
    else if(name === "Autoplay"){
        featureName = "Block autoplay"
    }

    if(value){
        changeValue = "On";
        changeTextColor = "is-success";
    }
    else{
        changeValue = "Off";
        changeTextColor = "is-danger";
    }

    return(
        <div className="tags has-addons">
            <span className="tag is-medium is-white">{featureName}</span>
            <span className={"tag is-medium "+changeTextColor}>{changeValue}</span>
        </div>
    )
}

function ChangeSummary(changes){
    var changeList = changes.changes;
    console.log(changeList);
    var rows = [];
    for (const [key, value] of Object.entries(changeList)) {
        rows.push(ItemRecord(key,value));
    }

    return(rows)
}

function FeatureQuestionnairePage() {

    const [questionnaire] = useChromeStorageLocal("sampled_feature_questioinnaire_in_progress");
    const [uid] = useChromeStorageLocal("uid");

    if(!questionnaire){
        return(
            <NoESMPage/>
        );
    }

    console.log("feature change", questionnaire);
    // get site name
    const esmSite = questionnaire.sampled_site;
    if(esmSite != "Twitter" && esmSite != "Facebook" && esmSite != "LinkedIn" && esmSite != "YouTube"){
        return(
            <NoESMPage/>
        );
    }
    // get site logo
    var siteLogo;
    if(esmSite === "Twitter"){
        siteLogo = twitterIcon;
    }
    else if(esmSite === "Facebook"){
        siteLogo = facebookIcon;
    }
    else if(esmSite === "YouTube"){
        siteLogo = youTubeIcon;
    }
    else if(esmSite === "LinkedIn"){
        siteLogo = linkedInIcon;
    }
    // get esm time
    const timestamp = questionnaire.sampled_time;


    return (
    <div>
        <section className="hero is-info is-small">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">
                        Feature Questionnaire
                    </h1>
                </div>
            </div>
        </section>
        <div className="container">
            <div className="section">
                <div className="box">
                    <div className="container">
                        <p className="content">
                        We notice you just made the following change(s) on Purpose Mode when browsing <span>{esmSite}</span> {" "}
                            <img 
                            style={{height: "20px", 
                                    width: "20px"}}
                            src={siteLogo}></img>. Please share your experience with us!
                            <br />
                        </p>

                        <ChangeSummary 
                            changes={questionnaire.feature_changed}
                        />
                        Current as of: <span id="esm_time">{timestamp}</span>
                        <br />
                        <p className="content">
                            If you can not response to this questionnaire for any reason (e.g., this does not match their current browsing activity), please hit <SkipButton size="is-small"/> to skip this questionnaire.
                        </p>
                    </div>
                </div>
                <div>
                    <div className="box">
                        <label className="label">
                            1. Please briefly describe what you are currently doing on {esmSite}: 
                            <span style={{color:"red"}}>*</span>
                        </label>
                        <p className="help">your response to this question will be used in the interview to help you recall your memory about this moment. Please note any information that will help you to remember.</p><br/>
                        <div className="control">
                            <input className="input" type="q_activity" id="q_activity" required
                            />
                        </div>
                    </div>
                    
                    <div className="box">
                        <label className="label">
                            2. Please elaborate on why you make those feature changes on {esmSite}: 
                            <span style={{color:"red"}}>*</span>
                        </label>
                        <p className="help">your response to this question will be used in the interview to help you recall your memory about this moment. Please note any information that will help you to remember.</p><br/>
                        <div className="control">
                            <input className="input" type="q_reason" id="q_reason" required
                            />
                        </div>
                    </div>
                    
                    <div className="buttons">
                    <button className="button is-primary is-medium" id="btn_submit"
                        onClick={(e) => {
                            var answers = {};
                            var required_check = [
                                false, // current_activity
                                false, // reason
                                ]

                            // current browsing activity
                            answers["current_activity"] = document.getElementById("q_activity").value;
                            if (answers["current_activity"]) {
                                required_check[0] = true;
                            }

                            // reason of change(s)                            
                            answers["reason"] = document.getElementById("q_reason").value;
                            if (answers["reason"]) {
                                required_check[1] = true;
                            }
                            
                            chrome.storage.local.get(["sampled_esm"]).then(function (status) {
                                //esm counter checks and check required fields
                                var pass_requirement_check = true;
                                var alarmIndex = [];
                                for (var i = 0; i < required_check.length; ++i) {
                                    if (!required_check[i]) {
                                        pass_requirement_check = false;
                                        alarmIndex.push(i + 1);
                                    }
                                }
                                if (!pass_requirement_check) {
                                    var alert_message = "Please answer the following questions: " + alarmIndex.join(',');
                                    alert(alert_message);
                                }
                                else{
                                    console.log("feature questionnaire responses: ",answers);
                                    var feature_questionnaire_record = {};
                                    feature_questionnaire_record["questionnaire_responses"]       =  answers;
                                    feature_questionnaire_record["sampled_time"]                  =  questionnaire.sampled_time;
                                    feature_questionnaire_record["sampled_time_unix_second"]      =  questionnaire.sampled_time_unix_second;
                                    feature_questionnaire_record["sampled_site"]                  =  questionnaire.sampled_site;
                                    feature_questionnaire_record["feature_changed"]               =  questionnaire.feature_changed;
                                    
                                    console.log("feature questionnaire record:", feature_questionnaire_record);

                                    axios.post('https://purpose-mode-backend.nymity.ch/submit', {
                                        uid: uid,
                                        type: "feature_feedback_questionnaire",
                                        data: feature_questionnaire_record
                                    })
                                    .then(function (response) {
                                        console.log(response);
                                        var current_time = new Date().getTime()/1000;
                                        // reset feature change cache
                                        chrome.storage.local.set({"last_feature_questionnaire_time": current_time});
                                        chrome.storage.local.set({"sampled_feature_questioinnaire": null});
                                        chrome.storage.local.set({"sampling_feature_lock": false});
                                        alert("Response submitted!");
                                        if(status.sampled_esm === null){
                                            chrome.action.setBadgeText({ text: "" });
                                        }
                                        window.close();
                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                        alert("Submission failed: "+ error);
                                    });
                                }
                            });
                          }}
                    >Submit</button>
                    <SkipButton
                    size="is-medium"/>
                    </div>
                    </div>
                </div>
        </div>
    </div>
    )
}

export default FeatureQuestionnairePage



