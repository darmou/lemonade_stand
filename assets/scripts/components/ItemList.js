import React from "react";
import { connect } from "react-redux";
import { readEndpoint } from "redux-json-api";
import Griddle, { RowDefinition, ColumnDefinition, plugins  } from "griddle-react";
import PropTypes from "prop-types";
import CustomRow from "./CustomRow";
import ImageComponent from "./ImageComponent";
import NextButton from "./NextButtonCustom";
import PreviousButton from "./PreviousButtonCustom";


class ItemList extends React.Component {


    componentWillMount() {
        this.props.getInventoryItems();
    }

    withCustomProps(WrappedComponent, customProps) {
        return class PP extends React.Component {
            constructor(props) {
                super(props);
            }
            render() {
                return <WrappedComponent {...customProps} {...this.props} />;
            }
        };
    }


    render() {
        const rowDataSelector = (state, { griddleKey }) => {
            return state
                .get('data')
                .find(r => r.get('griddleKey') === griddleKey)
                .toJSON();
        };

        const enhancedWithRowData = connect((state, props) => {
            return {
                rowData: rowDataSelector(state, props),
            };
        });

        // We need to make a new object each time to avoid reference issues
        const entry = {id: null, name: null, description: null, price: null, image: null};
        let TABLE_DATA = [entry];

        this.props.items.data.map((item) => {
            const newEntry  = Object.assign({}, entry, {
                id: item.id,
                name: item.attributes.name,
                description: item.attributes.description,
                price: item.attributes.price,
                image: item.attributes.image
            });
            TABLE_DATA.push(newEntry);
        });

        if(TABLE_DATA.length > 1) {
            TABLE_DATA.shift(); //Once our data is loaded remove the first empty row used for reference by Griddle.
        }

        const NewLayout = ({ Table, Pagination, Filter, SettingsWrapper }) => (
            <div>
                <Filter/>
                <Table />
                <Pagination />
            </div>
        );

        const pageProperties = {
                currentPage: 1,
                pageSize: 4
            };


        return (
            <Griddle
                     components={
                         {Row:  enhancedWithRowData(this.withCustomProps(CustomRow, {store: this.props.store})),
                             Layout: NewLayout,
                             NextButton: NextButton,
                             PreviousButton: PreviousButton
                         }
                     }
                     plugins={[plugins.LocalPlugin]}
                     pageProperties={pageProperties}
                     data={TABLE_DATA}>
                <RowDefinition >
                    <ColumnDefinition id="id" order={1}/>
                    <ColumnDefinition id="name" sortable={true} sortType={PropTypes.string} order={2}/>
                    <ColumnDefinition id="description" order={3} />
                    <ColumnDefinition id="price" sortable={true} order={4} />
                    <ColumnDefinition id="image" sortable={false} order={5} customComponent={enhancedWithRowData(ImageComponent)}/>
                </RowDefinition>
            </Griddle>
        );
    }

};



const mapStateToProps = (state) => {
    console.log(state); // Check the console to see how the state object changes as we read the API
    const items = state.api.items || { data: [] };
    return {
        items
    }
};

const mapDispatchToProps = (dispatch) => {
    return({
        getInventoryItems: () => { dispatch(readEndpoint("items"))}
    });
};



const ApiResults = connect(
    mapStateToProps, mapDispatchToProps
)(ItemList);

export default ApiResults;
