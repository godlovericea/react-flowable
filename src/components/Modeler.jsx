import React from "react";

class Modeler extends React.Component{

    render() {
        return(
            <div className="iframe-wrapper">
                <iframe src="http://127.0.0.1:5500/index.html#/processes" frameBorder="0"></iframe>
            </div>
        )
    }
}

export default Modeler