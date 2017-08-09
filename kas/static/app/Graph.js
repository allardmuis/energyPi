import React from 'react';

export default class Graph extends React.Component {
    
    componentDidMount() {
        var canvas = document.getElementById('myChart');
        canvas.height = window.innerHeight - 60;
        canvas.width = window.innerWidth - 20;
        
        this.renderGraph(this.props.data, this.props.selected);
    }
    
    componentWillReceiveProps(newProps) {
        this.renderGraph(newProps.data, newProps.selected);
    }
    
    renderGraph(data, selected) {
        if (this.chart) {
            this.chart.destroy();
        }
        
        var datasets = [];
        var color = 0;
        var minTemp = 1000;
        var maxTemp = -1000;
        var minHumidity = 1000;
        var maxHumidity = -1000;
        
        for (var sensorData of data) {
            if (selected.includes(sensorData.sensor)) {
                var tempData = [];
                var humidityData = [];
                var colors;
                for (var i = 0; i < this.props.sensors.length; i++) {
                    if (this.props.sensors[i].id === sensorData.sensor) {
                        colors = this.props.sensors[i].colors;
                    }
                }
                
                for (var point of sensorData.data) {
                    minTemp = Math.min(minTemp, point.temperature);
                    maxTemp = Math.max(maxTemp, point.temperature);
                    minHumidity = Math.min(minHumidity, point.humidity);
                    maxHumidity = Math.max(maxHumidity, point.humidity);
                    
                    tempData.push({
                        x: point.datetime,
                        y: point.temperature,
                    });
                    humidityData.push({
                        x: point.datetime,
                        y: point.humidity,
                    });
                }
                
                datasets.push({
                    label: 'Temperature Sensor ' + sensorData.sensor,
                    fill: false,
                    spanGaps: false,
                    yAxisID: 'temperature',
                    data: tempData,
                    borderColor: colors.temperature,
                    pointRadius: 0,
                });
                datasets.push({
                    label: 'Humidity Sensor ' + sensorData.sensor,
                    fill: false,
                    spanGaps: false,
                    yAxisID: 'humidity',
                    data: humidityData,
                    borderColor: colors.humidity,
                    pointRadius: 0,
                });
            }
            color += 50;
        }
        
        if (datasets.length) {
            var ctx = document.getElementById('myChart').getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: datasets,
                },
                options: {
                    responsive: false,
                    animation: {
                        duration: 0,
                    },
                    legend: {
                        display: false,
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            ticks: {
                                maxRotation: 0,
                            },
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            },
                        }],
                        yAxes: [{
                            display: true,
                            id: 'temperature',
                            scaleLabel: {
                                display: true,
                                labelString: 'temperature'
                            },
                            gridLines: {
                                color: 'rgba(255, 0, 0, 0.2)',
                            },
                            ticks: {
                                suggestedMax: Math.ceil(maxTemp) + 0.5,
                                suggestedMin: Math.floor(minTemp) - 0.5,
                            },
                        }, {
                            display: true,
                            id: 'humidity',
                            position: 'right',
                            scaleLabel: {
                                display: true,
                                labelString: 'humidity'
                            },
                            gridLines: {
                                color: 'rgba(0, 0, 255, 0.2)',
                            },
                            ticks: {
                                suggestedMax: maxHumidity + 2,
                                suggestedMin: minHumidity - 2,
                            },
                        }],
                    },
                },
            });
        }
    }
    
    render() {
        
        return (
            <div id="canvas-container">
                <canvas id="myChart" width="400" height="400"></canvas>
            </div>
        );
    }
}