import React from "react";
import { connect } from "react-redux";
import { updateResource, deleteResource } from "redux-json-api";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";

import Form from "./Form";
import FormUtils from "./FormUtils";

class CustomRow extends FormUtils {

    //Note the changes are made locally then sent to the server so when the server gets updated the list is refreshed so we don"t need
    //to worry about parent props changing and having issues with this forked version
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.rowData.name,
            description: this.props.rowData.description,
            price: this.props.rowData.price,
            image: this.props.rowData.image,
            open: false,
            openConfirm: false
        };
    }

    handleChange(name, e) {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    }

    handleOpenConfirm() {
        this.handleClose();
        this.setState({openConfirm: true});
    }

    handleCloseConfirm() {
        this.setState({openConfirm: false});
    }

    updateItem() {
        if(this.props.rowData.id) {
            const {items} = this.props;
            const item = this.findItem(items);
            item.attributes.name = this.state.name;
            item.attributes.description = this.state.description;
            item.attributes.price = (this.state.price.length > 0) ? parseFloat(this.state.price) : 0.00;
            item.attributes.image = this.state.image;
            if(item) { this.props.updateItem(item) };
        }
        this.handleClose();
    }

    deleteItem() {
        if(this.props.rowData.id) {
            const {items} = this.props;
            const item = this.findItem(items);
            if(item) { this.props.deleteItem(item) };
        }
        this.handleCloseConfirm();
    }


    componentWillReceiveProps(nextProps){
        if (nextProps.rowData.name !== this.props.rowData.name) {
            this.setState({ name: nextProps.rowData.name })
        }
        if (nextProps.rowData.description !== this.props.rowData.description) {
            this.setState({ description: nextProps.rowData.description })
        }
        if (nextProps.rowData.price !== this.props.rowData.price) {
            this.setState({ price: nextProps.rowData.price })
        }

         if (nextProps.rowData.image !== this.props.rowData.image) {
             this.setState({ image: nextProps.rowData.image })
         }

    }

    uploadSuccess(resp) {
        this.setState({image: resp.path});
    }

    render() {

        let actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose.bind(this)}
            />,
            <FlatButton
            label="Delete"
            id="delete_btn"
            primary={true}
            onTouchTap={this.handleOpenConfirm.bind(this)}
    />,
            <FlatButton
                label="Submit"
                id="submit_change_btn"
                primary={true}
                onTouchTap={this.updateItem.bind(this)}
            />
        ];

        let deleteActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCloseConfirm.bind(this)}
            />,
            <FlatButton
                label="Submit"
                id="submit_delete_btn"
                primary={true}
                onTouchTap={this.deleteItem.bind(this)}
            />
        ];
        let Cell = this.props.Cell;

        return (
        <tr
            key={this.props.griddleKey}
            style={this.props.style}
            onClick={this.handleOpen.bind(this)}
            className={this.props.className}
        >
            { this.props.columnIds && this.props.columnIds.map(c => (
                <Cell
                    key={`${c}-${this.props.griddleKey}`}
                    griddleKey={this.props.griddleKey}
                    columnId={c}
                    style={this.props.style}
                    className={this.props.className}
                />
            ))}
            <Dialog
                open={this.state.open}
                title="Edit Item"
                actions={actions}
                onRequestClose={this.props.handleRequestClose}
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
            <Dialog
                title="Confirm"
                actions={deleteActions}
                modal={true}
                open={this.state.openConfirm}
            >
                Do you really want to delete this item "{this.props.rowData.name}"?
            </Dialog>
        </tr>);

    }
}
const mapStateToProps = (state) => {
    console.log(state);
    const items = state.api.items || { data: [] };
    return {items}
};

const mapDispatchToProps = (dispatch) => {
    return({
        updateItem: (item) => { dispatch(updateResource(item)) },
        deleteItem: (item) => { dispatch(deleteResource(item)) }
    });
};



export default connect(mapStateToProps, mapDispatchToProps)(CustomRow);