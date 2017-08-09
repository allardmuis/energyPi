import React from 'react';

export default class SensorList extends React.Component {
    render() {
        return (
            <ul className="sensor-list">
                {this.props.sensors.map((sensor) => 
                    <Sensor key={sensor.id}
                            id={sensor.id}
                            name={sensor.name}
                            colors={sensor.colors}
                            selected={this.props.selected.includes(sensor.id)} 
                            activateSensor={this.props.activateSensor}
                            deactivateSensor={this.props.deactivateSensor}
                    />
                )}
            </ul>
        );
    }
}

class Sensor extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e) {
        if (this.props.selected) {
            this.props.deactivateSensor(this.props.id);
        } else {
            this.props.activateSensor(this.props.id);
        }
    }
    
    render() {
        return (
            <li className={'sensor sensor'+this.props.id}>
                <style type="text/css">{'.sensor'+this.props.id + ' label::before {border-top-color: ' + this.props.colors.temperature + '; border-right-color: ' + this.props.colors.humidity + ';}'}</style>
                <label>
                    <input type="checkbox" checked={this.props.selected} onChange={this.handleChange} />
                    {this.props.name}
                </label>
            </li>
        );
    }
}