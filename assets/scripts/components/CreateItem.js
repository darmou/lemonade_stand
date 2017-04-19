import React from "react";
import { connect } from "react-redux";
import { createResource } from "redux-json-api"
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import Form from "./Form";
import FormUtils from "./FormUtils";

class CreateItem extends FormUtils {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            price: "",
            image: ""
        };
    }

    handleRequestClose(){
        this.handleClose();
        this.props.handleRequestClose();
    }


    handleSubmit() {
        this.props.createItem(this.createItem());
        this.setState({name:"",description:"",price:"",image:""}); //Reset the values
        this.props.handleRequestClose(); //Close after submit
    }

    render() {
        const standardActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                id="cancel_item_btn"
                onTouchTap={this.handleRequestClose.bind(this)}
            />,
                <FlatButton
                    label="Submit"
                    primary={true}
                    id="submit_item_btn"
                    keyboardFocused={true}
                    onTouchTap={this.handleSubmit.bind(this)}
                />
        ];

        return <Dialog
            open={this.props.open}
            title="Add New Item To Inventory"
            actions={standardActions}
            onRequestClose={this.handleRequestClose.bind(this)}
        >
            <Form name={this.state.name}
                  description={this.state.description}
                  price={this.state.price}
                  image={this.state.image}
                  chooseFiles={this.chooseFiles.bind(this)}
                  uploadSuccess={this.uploadSuccess.bind(this)}
                  handleChange={this.handleChange.bind(this)}
            />
        </Dialog>

    }
}

const mapDispatchToProps = (dispatch) => {
    return({
        createItem: (item) => { dispatch(createResource(item))}
    });
};


export default connect(null,mapDispatchToProps)(CreateItem);