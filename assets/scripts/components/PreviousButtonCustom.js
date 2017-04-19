import React from "react";
import RaisedButton from "material-ui/FlatButton";

const PreviousButton = ({ hasPrevious, onClick, style, className, text }) => hasPrevious ? (
    <RaisedButton id="previous_btn" label={text} onClick={onClick} style={style} className={className}/>
) :
    null;

export default PreviousButton;