import React from "react";

class ImageComponent extends React.Component {

    render() {
        return  (<img className="tableImage" src={this.props.rowData.image}/>)
    }
}


export default ImageComponent;