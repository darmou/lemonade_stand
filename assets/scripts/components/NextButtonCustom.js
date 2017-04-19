import React from "react";
import RaisedButton from "material-ui/FlatButton";


const NextButton = ({ hasNext, onClick, style, className, text }) => hasNext ? (
    <RaisedButton id="next_btn" label={text} onClick={onClick} style={style} className={className}/>
) :
    null;

export default NextButton;