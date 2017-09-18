import React, { Component } from 'react';

class App extends Component {
    constructor() {
        super();
        this.state = {propertyData: []};
        this.fetchData = this.fetchData.bind(this);
    }
    fetchData() {
        fetch('/data', {
            mode: 'no-cors',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(propertyData => this.setState({propertyData: propertyData}));
    }
    componentWillMount() {
        document.body.style.backgroundColor = "#FEFCFF";
        document.body.style.height = "100%";
    }
    render() {
        const style = {
            container: {
                margin:"0 auto",
                width: "90%",
                minHeight: "100%",
                position: "relative",
                fontFamily: "'Raleway', sans-serif",
                color: "#3D3C3A"
            },
            header: {
                margin:"0 auto",
                width: "90%",
                height: "100px",
                position: "relative",
                top: "0",
                left: "0"
            },
            title: {
                fontSize: "70px",
                verticalAlign: "bottom"
            },
            bodyContainer: {
                margin:"0 auto",
                width: "90%",
                position: "relative"
            },
            button: {
                verticalAlign: "middle",
                float: "left"
            }
        };
        return (
            <div style={style.container}>
                <div style={style.header}>
                    <h1 style={style.title}>Properties in California</h1>
                </div>
                <div style={style.bodyContainer}>
                    <div style={style.button}>
                        <Button_Component onClick={this.fetchData} />
                    </div>
                    <div style={{clear:"both"}}></div>
                    <div>
                        <Table_Component propertyData={this.state.propertyData} />
                    </div>
                </div>
            </div>
        )
    }
}

class Button_Component extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const style = {
            backgroundColor: "#314CB6",
            border: "0px",
            color: "#F7F7FF",
            borderRadius: "10px",
            MozBorderRadius: "10px",
            WebkitBorderRadius: "10px",
            height: "50px",
            width: "200px",
            fontSize: "20px",
            textAlign: "center"
        };
        return (
            <button style={style} onClick={this.props.onClick}>List Properties</button>
        )
    }
}

class Table_Component extends Component {
    constructor(props) {
        super(props);
    }
    render() {  
        const style = {
            table: {
                borderSpacing: "0px 5px",
                textAlign: "center",
            },
            thead: {
            },
            thRow: {
                height:"80px", 
                margin: "10px 0 5px 0",
                backgroundColor:"#F2F2F3"
            },
            tbody: {
            },
            nameHeader: {
                borderTopLeftRadius: "15px",
                MozBorderRadiusTopLeft: "15px",
                WebkitBorderTopLeftRadius: "15px",
                
                borderBottomLeftRadius: "15px",
                MozBorderRadiusBottomLeft: "15px",
                WebkitBorderBottomLeftRadius: "15px",
            },
            missingDataEncodingHeader: {
                borderTopRightRadius: "15px",
                MozBorderRadiusTopRight: "15px",
                WebkitBorderTopRightRadius: "15px",
                
                borderBottomRightRadius: "15px",
                MozBorderRadiusBottomRight: "15px",
                WebkitBorderBottomRightRadius: "15px",
            }
        };
        
        var tableRows = this.props.propertyData.map(function(rowData, index){
            return <TR_Component key={index} rowData={rowData} />
        });
        
        var tableSkeleton =
            <table style={style.table}>
                <thead style={style.thead}>
                    <tr style={style.thRow}>
                        <th style={style.nameHeader}>PROP_NAME</th>
                        <th>ADDRESS</th>
                        <th>CITY</th>
                        <th>STATE_ID</th>
                        <th>ZIP</th>
                        <th>MISSING_ <br /> FIELD_ <br /> COUNT</th>
                        <th style={style.missingDataEncodingHeader}>MISSING_ <br /> DATA_ <br /> ENCODING</th>
                    </tr>
                </thead>
                <tbody style={style.tbody}>
                    {tableRows}
                </tbody>
            </table>
        ;
        
        var element = (tableRows.length > 0) ? tableSkeleton : null;
        
        return (
            element
        )
    }
}

class TR_Component extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const style = {
            row: {
                backgroundColor: "#F4F7FF",
                height: "40px",
                fontSize: "16px",
                marginBottom: "3px"
            },
            nameCell: {
                borderTopLeftRadius: "15px",
                MozBorderRadiusTopLeft: "15px",
                WebkitBorderTopLeftRadius: "15px",
                
                borderBottomLeftRadius: "15px",
                MozBorderRadiusBottomLeft: "15px",
                WebkitBorderBottomLeftRadius: "15px",
            },
            missingDataEncodingCell: {
                borderTopRightRadius: "15px",
                MozBorderRadiusTopRight: "15px",
                WebkitBorderTopRightRadius: "15px",
                
                borderBottomRightRadius: "15px",
                MozBorderRadiusBottomRight: "15px",
                WebkitBorderBottomRightRadius: "15px",
            }
            
        };
        
        var property = this.props.rowData;
        return (
            <tr style={style.row}>
                <TD_Component value={property.PROP_NAME} style={style.nameCell} />
                <TD_Component value={property.ADDRESS} />
                <TD_Component value={property.CITY} />
                <TD_Component value={property.STATE_ID} />
                <TD_Component value={property.ZIP} />
                <TD_Component value={property.MISSING_FIELD_COUNT} />
                <TD_Component value={property.MISSING_DATA_ENCODING} style={style.missingDataEncodingCell} />
            </tr>
        )
    }
}

class TD_Component extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <td style={this.props.style}>
                {this.props.value}
            </td>
        )
    }
}

export default App;