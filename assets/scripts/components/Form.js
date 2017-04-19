import React from "react";
import FileUpload from "react-fileupload";
import RaisedButton from "material-ui/FlatButton";
import Lightbox from "react-images";

class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lightboxIsOpen: false,
        };
    }
    handleChange(name, event) {
        this.props.handleChange(name, event);
    }

    openLightbox () {
        this.setState({ lightboxIsOpen: true });
    }

    closeLightbox() {
        this.setState({ lightboxIsOpen: false })
    }


    render() {

        const options = {
            baseUrl: "/image_upload",
            uploadSuccess: this.props.uploadSuccess,
            chooseFile: this.props.chooseFiles,
            chooseAndUpload: true
        };

        return  (<div>
                    <input placeholder="Name" id="name_input" type="text" value={this.props.name}
                        onChange={this.handleChange.bind(this, "name")} />
                    <input placeholder="Description" id="desc_input" type="text" value={this.props.description}
                           onChange={this.handleChange.bind(this, "description")} />

                    <input placeholder="Price" id="price_input" type="number" value={this.props.price}
                           onChange={this.handleChange.bind(this, "price")} />


                    <input disabled={true} id="image_path" placeholder="Image Path" type="text" value={this.props.image}
                           onChange={this.handleChange.bind(this, "image")} />

                <img id="image_preview" onClick={this.openLightbox.bind(this)} src={this.props.image} />

                <Lightbox
                    images={[{ src: this.props.image } ]}
                    currentImage={0}
                    isOpen={this.state.lightboxIsOpen}
                    onClose={this.closeLightbox.bind(this)}
                />

                     <FileUpload options={options} id="file_upload_btn" uploadSuccess={this.props.uploadSuccess} chooseFile={this.props.chooseFiles}>
                        <RaisedButton ref="chooseAndUpload" label="Select File To Upload"/>
                    </FileUpload>
                </div>
        )
    }
}


export default Form;