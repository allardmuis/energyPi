import React from 'react';
import ReactDOM from 'react-dom';
import TimeControl from './TimeControl';
import Graph from './Graph';
import SensorList from './SensorList';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSensors: [0, 1, 2],
            data: [],
            zoom: 0,
            end: 'now',
            period: 60,
            loading: true,
        };
        this.sensors = [
            {
                id: 0,
                name: 'sensor 0',
            }, {
                id: 1,
                name: 'sensor 1',
            }, {
                id: 2,
                name: 'sensor 2',
            }
        ];
        for (var i = 0; i < this.sensors.length; i++) {
            this.sensors[i].colors = {
                temperature: 'rgba(' + (255 - (100/(this.sensors.length-1))*i) + ', ' + ((70/(this.sensors.length-1))*i) + ', 0, 0.6)',
                humidity: 'rgba(0, ' + ((70/(this.sensors.length-1))*i) + ', ' + (255 - (100/(this.sensors.length-1))*i) + ', 0.6)',
            };
        }
        this.activateSensor = this.activateSensor.bind(this);
        this.deactivateSensor = this.deactivateSensor.bind(this);
        this.setTimeData = this.setTimeData.bind(this);
    
    }
    
    componentDidMount() {
        this.updateData();
        this.setTimer(60);
    }
    
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    
    setTimer(seconds) {
        if (this.timerID) {
            clearInterval(this.timerID);
        }
        this.timerID = setInterval(() => {if (this.state.end == 'now') {this.updateData(false);}}, seconds * 1000);
    }
    
    updateData(loading = true) {
        if (loading) {
            this.setState({loading: true});
        }
        this.fetchData(this.state.selectedSensors, this.getStart(), this.getEnd(), this.state.zoom).then((sensorData) => {
            this.setState({data: sensorData, loading: false});
        });
    }
    
    fetchSingleSensor(id) {
        this.setState({loading: true});
        this.fetchData([id], this.getStart(), this.getEnd(), this.state.zoom).then((sensorData) => {
            if (sensorData.length) {
                sensorData = sensorData.pop();
                if (sensorData.sensor == id) {
                    const data = this.state.data;
                    data.push(sensorData);
                    this.setState({data: data, loading: false});
                }
            }
        });
    }
    
    getStart() {
        var start;
        if (this.state.end == 'now') {
            start = new Date();
        } else {
            start = new Date(this.state.end.getTime());
        }
        start.setMinutes(start.getMinutes() - this.state.period);
        return start;
    }
    
    getEnd() {
        if (this.state.end == 'now') {
            return new Date();
        }
        
        return this.state.end;
    }
    
    fetchData(sensors, start, end, zoom) {
        const url = 'http://nuclearpi/api?start=' + this.formatDateForApi(start) + '&end=' + this.formatDateForApi(end) + '&zoom='+ zoom + '&sensors=' + sensors.join(',');
        return fetch(url).then((response) => response.json());
    }
    
    formatDateForApi(date) {
        return date.getFullYear() + '-'  +
               (date.getMonth() < 9 ? '0' : '') + (date.getMonth()+1) + '-'  +
               (date.getDate() < 10 ? '0' : '') + date.getDate() + '%20' +
               (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + 
               (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    }
    
    setTimeData(end, period, zoom) {
        this.setState({
            end: end,
            period: period,
            zoom: zoom,
        }, this.updateData);
    }
    
    activateSensor(id) {
        const selected = this.state.selectedSensors.slice();
        selected.push(id);
        this.setState({'selectedSensors': selected});
        
        const dataIds = this.state.data.map((d) => d.sensor);
        if (!dataIds.includes(id)) {
            this.fetchSingleSensor(id);
        }
    }
    
    deactivateSensor(id) {
        const selected = this.state.selectedSensors.slice();
        const index = selected.indexOf(id);
        selected.splice(index, 1);
        this.setState({selectedSensors: selected});
    }
    
    render() {
        return (
            <div>
				<TimeControl end={this.state.end} period={this.state.period} zoom={this.state.zoom} setTimeData={this.setTimeData} loading={this.state.loading} />
                <Graph sensors={this.sensors} data={this.state.data} selected={this.state.selectedSensors} />
                <SensorList sensors={this.sensors}
                            selected={this.state.selectedSensors}
                            activateSensor={this.activateSensor}
                            deactivateSensor={this.deactivateSensor}
                />
            </div>
        );
    }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
