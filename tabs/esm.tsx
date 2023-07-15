import { useChromeStorageLocal } from "use-chrome-storage";

import "../mystyles.css";
import facebookIcon from "data-base64:~assets/Facebook.png";
import twitterIcon from "data-base64:~assets/Twitter.png";
import linkedInIcon from "data-base64:~assets/LinkedIn.png";
import youTubeIcon from "data-base64:~assets/YouTube.png";


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
                                <select id="q_purpose">
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
                            <p className="content is-small has-text-danger">
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
                                3.1. How will you describe the distractions you feel right now when browsing {esmSite}:
                                <span style={{color:"red"}}>*</span>
                            </label>
                            <div className="control">
                                <label className="radio">
                                    <input type="radio" value="Yes" name="q_distraction"/>
                                    {" "}I am distracted.<br/>
                                </label>
                                <label className="radio">
                                    <input type="radio" value="No" name="q_distraction"/>
                                    {" "}I am <i>NOT</i> distracted.<br/>
                                </label>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">
                                3.2. Please explain what things about {esmSite} lead you to feel distracted or not distracted (based on your answer to Q3.1):
                                <span style={{color:"red"}}>*</span>
                            </label>
                            <div className="control">
                                <input className="input" type="q_explanation" id="q_explanation" required
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
                                4.1 How much do you feel out of or in control?<span style={{color:"red"}}>*</span>
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
                                4.2 How much do you feel dissatisfied or satisfied?<span style={{color:"red"}}>*</span>
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
                                4.3 How much does the current browsing experience conflict with or support your personal goals?<span style={{color:"red"}}>*</span>
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
                    <button className="button is-primary" id="btn_submit">Submit</button>
                    </div>
                </div>
            <div id="app"></div>
        </div>
    </div>
    )
}

export default ESMPage



