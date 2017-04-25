import React from "react";
import HandleUpdates from "./HandleUpdates";


class FormUtils extends HandleUpdates {

    handleChange(name, e) {
        let change = {};
        change[name] = e.target.value;
        this.setState(change);
    }

    uploadSuccess(resp) {
        this.setState({image: resp.path});
    }

    chooseFiles(files) {
        this.setState({image: URL.createObjectURL(files[0])});
    }

    createItem() {
        const item = {
            type: "items",
            attributes: {
                name: this.state.name,
                description: this.state.description,
                price: (this.state.price.length > 0) ? parseFloat(this.state.price) : 0.00,
                image: this.state.image
            },
        };
        return item;
    }
}



export default FormUtils;