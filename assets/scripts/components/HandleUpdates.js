import React from "react";

class HandleUpdates extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    findItem(items) {
        let ret_item = null;
        let idx;
        for (idx in items.data) {
            if (items.data[idx].id === this.props.rowData.id) {
                ret_item = items.data[idx];
                break;
            }
        }
        return ret_item;
    }

    handleOpen() {
        this.setState({open: true,


        });
    }

    handleClose() {
        //Reset state if we cancel
        let name = (this.props.hasOwnProperty("rowData")) ? this.props.rowData.name : "";
        let description = (this.props.hasOwnProperty("rowData")) ? this.props.rowData.description : "";
        let price = (this.props.hasOwnProperty("rowData")) ? this.props.rowData.price : "";
        let image = (this.props.hasOwnProperty("rowData")) ? this.props.rowData.image : "";
        this.setState({open: false,
            name: name,
            description: description,
            price: price,
            image: image});
    }

}

export default HandleUpdates;