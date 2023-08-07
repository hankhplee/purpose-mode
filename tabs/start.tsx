
import "../mystyles.css";
import axios from 'axios';

function StartPage() {
    return (
        <body>
            <section className="hero is-small is-primary is-bold">
                <div className="hero-body">
                <div className="container">
                    <h1 className="title has-text-centered">
                    Purpose Mode
                    </h1>
                </div>
                </div>
            </section>
            <section>
                <div className="container">
                    <div className="content is-large">
                        <p>
                        <br/>
                        Welcome! If you see this page, it means that you have successfully installed Purpose Mode, a research-purposed browser
                        extension developed by Brave Software Research team. In this study, we study people's experience when browsing Twitter, Facebook, LinkedIn, and YouTube.
                        <br/>
                        <br/>
                        Since you are first time here, please tell us your participant ID in the input box below. If you have not known your participant ID, please consult the researcher that contacted you for the information.
                        <br/>
                        <nav className="level">
                            <div className="level-item">
                                <input style={{width: "15%"}} id='input_user_id' className="input" type="text" placeholder="e.g., P36"/>
                            </div>
                        </nav>
                        <br/>
                        If you have any questions about the study, please do not hesitate to contact us via <a href="mailto:haopingl@cs.cmu.edu">haopingl@cs.cmu.edu/</a>
                        </p>
                    </div>
                    <nav className="level">
                        <div className="level-item"><button id='btn_start' className="button is-primary"
                            onClick={(e) => {
                                var uid = document.getElementById('input_user_id').value;
                                chrome.storage.local.set({ 'uid': uid });

                                // ping server
                                var ping = {};
                                var date = new Date(Date.now());
                                var current_time = date.toString().replace(/ \(.*\)/ig, '');
                                var unix_time = new Date().getTime();
                                ping["timestamp"] = current_time;
                                ping["unix_time"] = unix_time;
                                ping["status"] = "participant registered";
                                axios.post('https://purpose-mode-backend.nymity.ch/submit', {
                                    uid: uid,
                                    type:"study_status",
                                    data: ping
                                  })
                                  .then(function (response) {
                                    console.log(response);
                                    alert("Registration is successful!\nWelcome to the study.");
                                    window.close();
                                  })
                                  .catch(function (error) {
                                    console.log(error);
                                    alert("Registration failed: "+ error);
                                  });
                              }}
                        >Start</button></div>
                    </nav>
                </div>
            </section>
            </body>
    )
}

export default StartPage