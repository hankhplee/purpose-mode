import { useChromeStorageLocal } from "use-chrome-storage";

import "../mystyles.css";
import facebookIcon from "data-base64:~assets/Facebook.png";
import twitterIcon from "data-base64:~assets/Twitter.png";
import linkedInIcon from "data-base64:~assets/LinkedIn.png";
import youTubeIcon from "data-base64:~assets/YouTube.png";
import axios from 'axios';

function ESMPage() {

    const [esm] = useChromeStorageLocal("sampled_esm");

    if(!esm){
        return(
            <div>
                No ESM at this moment. Please check in later.
            </div>
        );
    }

    console.log("ESM", esm);
    // get site name
    const esmSite = esm.esm_site;
    if(esmSite != "Twitter" && esmSite != "Facebook" && esmSite != "LinkedIn" && esmSite != "YouTube"){
        return(
            <div>
                No ESM at this moment. Please check in later.
            </div>
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
    const timestamp = esm.esm_time;


    return (
    <div>
        <section className="hero is-primary">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">
                        User Experience Questionnaire
                    </h1>
                </div>
            </div>
        </section>
        <div className="container">
            <div className="section">
                <div className="box">
                    <div className="container">
                        <p className="content has-text-centered">Webpage Screenshot</p>
                        <figure className="image block">
                            <img id="webpage_screenshot" style={{marginLeft: "auto", marginRight: "auto"}} src={esm.esm_screenshot}/>
                        </figure>
                        <br/>
                        <p className="content">
                            We notice that you are currently browsing <span>{esmSite}</span> {" "}
                            <img 
                            style={{height: "20px", 
                                    width: "20px"}}
                            src={siteLogo}></img>. Let us know what your experience is!
                            <br />
                            Current as of: <span id="esm_time">{timestamp}</span>
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
                            2. Which of the following best describes your purpose for browsing {esmSite} at the moment:
                            <span style={{color:"red"}}>*</span>
                        </label>    
                        <div className="control">
                            <div className="select">
                                <select id="q_purpose"
                                onChange={(e) => {
                                    console.log("Others onchange");
                                    if(e.target.value=="Others"){
                                        document.getElementById("q_purpose_others").disabled = false;
                                    }else{
                                        document.getElementById("q_purpose_others").disabled = true;
                                    }
                                  }}>
                                    <option></option>
                                    <option
                                        value="Finding">
                                        Finding: Looking for specific facts or information (e.g., weather, location)
                                    </option>
                                    <option
                                        value="Information gathering">
                                        Researching/ Information gathering: Researching some broader topic (e.g., job hunting, planning a vacation)
                                    </option>
                                    <option value="Browsing">
                                        Browsing: Pure browsing out of personal or work-related interest with no specific goal in mind (e.g., for self's routine/habit/passing time/entertainment)</option>
                                    <option value="Communicating">
                                        Communicating: (e.g., messaging, blogging and posting updates)</option>
                                    <option value="Others">
                                        Others (Fill in the blank if you choose 'Others')</option>
                                </select>
                            </div>
                            <p className="help has-text-danger">
                                <br/>
                                Fill in the following blank if you choose 'Others':
                            </p>
                            <div className="content">
                                <input className="input" id="q_purpose_others"
                                    placeholder="Fill in this blank if you choose 'Others'" disabled/>
                            </div>
                        </div>
                    </div>
                    <div className="box">
                        <div className="field">
                            <label className="label">
                                3. How will you describe the distractions you feel right now when browsing {esmSite}:
                                <span style={{color:"red"}}>*</span>
                            </label>
                            <div className="control">
                                <label className="radio">
                                    <input type="radio" value="Yes" name="q_distraction"
                                    onClick={(e) => {
                                        if(e.target.checked){
                                            document.getElementById("q_distraction_detail").innerHTML = "4. Please explain what things about " + esmSite + " lead you to feel distracted: <span style='color:red'>*</span>";
                                        }
                                    }}
                                    />
                                    {" "}I am distracted.<br/>
                                </label>
                                <label className="radio">
                                    <input type="radio" value="No" name="q_distraction"
                                    onClick={(e) => {
                                        if(e.target.checked){
                                            document.getElementById("q_distraction_detail").innerHTML = "4. Please explain what things about " + esmSite + " lead you to feel not distracted: <span style='color:red'>*</span>";
                                        }
                                    }}/>
                                    {" "}I am <i>NOT</i> distracted.<br/>
                                </label>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label" id="q_distraction_detail">
                                4. Please explain what things about {esmSite} lead you to feel distracted or not distracted (based on your answer to Q3):
                                <span style={{color:"red"}}>*</span>
                            </label>
                            <div className="control">
                                <input className="input" type="q_explanation" id="q_distraction_text" required
                                    />
                            </div>
                        </div>
                    </div>

                    <div className="box">
                        <p className="label">
                            Reflecting on your current browsing experience on {esmSite}:
                        </p>
                        <br/>
                        
                        <div className="field">
                            <p className="label">
                                5. How much do you feel out of or in control?<span style={{color:"red"}}>*</span>
                            </p>
                            <div className="columns">
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        1: Very out of control  <br />
                                        <input type="radio" value="1" name="q_control"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        2: Out of control <br />
                                        <input type="radio" value="2" name="q_control"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        3: Neither out of nor in control <br />
                                        <input type="radio" value="3" name="q_control"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        4: In control <br />
                                        <input type="radio" value="4" name="q_control"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        5: Very in control <br />
                                        <input type="radio" value="5" name="q_control"/>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <p className="label">
                                6. How much do you feel dissatisfied or satisfied?<span style={{color:"red"}}>*</span>
                            </p>
                            <div className="columns">
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        1: Very dissatisfied <br />
                                        <input type="radio" value="1" name="q_satisfaction"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        2: Dissatisfied <br />
                                        <input type="radio" value="2" name="q_satisfaction"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        3: Neither dissatisfied nor satisfied <br />
                                        <input type="radio" value="3" name="q_satisfaction"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        4: Satisfied <br />
                                        <input type="radio" value="4" name="q_satisfaction"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        5: Very satisfied <br />
                                        <input type="radio" value="5" name="q_satisfaction"/>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <p className="label">
                                7. How much does the current browsing experience conflict with or support your personal goals?<span style={{color:"red"}}>*</span>
                            </p>
                            <div className="columns">
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        1: Very in conflict <br />
                                        <input type="radio" value="1" name="q_goal"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        2: In conflict <br />
                                        <input type="radio" value="2" name="q_goal"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        3: Neither in conflict nor supported <br />
                                        <input type="radio" value="3" name="q_goal"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        4: Supported <br />
                                        <input type="radio" value="4" name="q_goal"/>
                                    </label>
                                </div>
                                <div className="column has-text-centered">
                                    <label className="radio has-text-centered">
                                        5: Very supported <br />
                                        <input type="radio" value="5" name="q_satisfaction"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="button is-primary" id="btn_submit"
                        onClick={(e) => {
                            var answers = {};
                            var required_check = [
                                false, // current_activity
                                false, // purpose
                                false, // distraction
                                false, // distraction_text
                                false, // agency
                                false, // satisfaction
                                false  // goal_alignment
                                ]
                            
                            // current browsing activity
                            answers["current_activity"] = document.getElementById("q_activity").value;
                            if (answers["current_activity"]) {
                                required_check[0] = true;
                            }

                            // browsing purpose
                            var q_purpose = document.getElementById("q_purpose");
                            var q_purpose_index = q_purpose.selectedIndex;
                            if (q_purpose[q_purpose_index].value == "Others") {
                                var q_purpose_others = document.getElementById("q_purpose_others");
                                answers["purpose_other"] = q_purpose_others.value;
                            }
                            answers["purpose"] = q_purpose[q_purpose_index].value;

                            if (answers["purpose"] == "Others"){
                                if(answers["purpose_other"]){
                                    required_check[1] = true;
                                }
                            }
                            else{
                                if (answers["purpose"]){
                                    required_check[1] = true;
                                }
                            }
                            
                            // distraction
                            var required_distraction = false;
                            var q_distraction = document.getElementsByName("q_distraction");
                            for (var i = 0; i < q_distraction.length; ++i) {
                                if (q_distraction[i].checked) {
                                    answers["distraction"] = q_distraction[i].value;
                                    required_distraction = true;
                                    break;
                                }
                            }
                            required_check[2] = required_distraction;
                            
                            // distraction text
                            answers["distraction_text"] = document.getElementById("q_distraction_text").value;
                            if (answers["distraction_text"]) {
                                required_check[3] = true;
                            }
                            
                            // agency
                            var required_control = false;
                            var q_control = document.getElementsByName("q_control");
                            for (var i = 0; i < q_control.length; ++i) {
                                if (q_control[i].checked) {
                                    answers["agency"] = q_control[i].value;
                                    required_control = true;
                                    break;
                                }
                            }
                            required_check[4] = required_control;

                            // satisfaction
                            var required_satisfaction = false;
                            var q_satisfaction = document.getElementsByName("q_satisfaction");
                            for (var i = 0; i < q_satisfaction.length; ++i) {
                                if (q_satisfaction[i].checked) {
                                    answers["satisfaction"] = q_satisfaction[i].value;
                                    required_satisfaction = true;
                                    break;
                                }
                            }
                            required_check[5] = required_satisfaction;

                            // goal alignment
                            var required_goal_alignment = false;
                            var q_goal_alignment = document.getElementsByName("q_goal");
                            for (var i = 0; i < q_goal_alignment.length; ++i) {
                                if (q_goal_alignment[i].checked) {
                                    answers["goal_alignment"] = q_goal_alignment[i].value;
                                    required_goal_alignment = true;
                                    break;
                                }
                            }
                            required_check[6] = required_goal_alignment;
                            
                            //check required fields
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
                                console.log(answers);
                                axios.post('https://purpose-mode-backend.nymity.ch/submit', {
                                    ESM: answers
                                  })
                                  .then(function (response) {
                                    console.log(response);
                                    alert("Response submitted!");
                                    window.close();
                                  })
                                  .catch(function (error) {
                                    console.log(error);
                                    alert("Submission failed: "+ error);
                                  });
                            }
                            
                          }}
                    >Submit</button>
                    </div>
                </div>
        </div>
    </div>
    )
}

export default ESMPage



