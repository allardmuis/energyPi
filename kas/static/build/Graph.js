'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Graph = function (_React$Component) {
    _inherits(Graph, _React$Component);

    function Graph() {
        _classCallCheck(this, Graph);

        return _possibleConstructorReturn(this, (Graph.__proto__ || Object.getPrototypeOf(Graph)).apply(this, arguments));
    }

    _createClass(Graph, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var canvas = document.getElementById('myChart');
            canvas.height = window.innerHeight - 60;
            canvas.width = window.innerWidth - 20;

            this.renderGraph(this.props.data, this.props.selected);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
            this.renderGraph(newProps.data, newProps.selected);
        }
    }, {
        key: 'renderGraph',
        value: function renderGraph(data, selected) {
            if (this.chart) {
                this.chart.destroy();
            }

            var datasets = [];
            var color = 0;
            var minTemp = 1000;
            var maxTemp = -1000;
            var minHumidity = 1000;
            var maxHumidity = -1000;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var sensorData = _step.value;

                    if (selected.includes(sensorData.sensor)) {
                        var tempData = [];
                        var humidityData = [];
                        var colors;
                        for (var i = 0; i < this.props.sensors.length; i++) {
                            if (this.props.sensors[i].id === sensorData.sensor) {
                                colors = this.props.sensors[i].colors;
                            }
                        }

                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = sensorData.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var point = _step2.value;

                                minTemp = Math.min(minTemp, point.temperature);
                                maxTemp = Math.max(maxTemp, point.temperature);
                                minHumidity = Math.min(minHumidity, point.humidity);
                                maxHumidity = Math.max(maxHumidity, point.humidity);

                                tempData.push({
                                    x: point.datetime,
                                    y: point.temperature
                                });
                                humidityData.push({
                                    x: point.datetime,
                                    y: point.humidity
                                });
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        datasets.push({
                            label: 'Temperature Sensor ' + sensorData.sensor,
                            fill: false,
                            spanGaps: false,
                            yAxisID: 'temperature',
                            data: tempData,
                            borderColor: colors.temperature,
                            pointRadius: 0
                        });
                        datasets.push({
                            label: 'Humidity Sensor ' + sensorData.sensor,
                            fill: false,
                            spanGaps: false,
                            yAxisID: 'humidity',
                            data: humidityData,
                            borderColor: colors.humidity,
                            pointRadius: 0
                        });
                    }
                    color += 50;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (datasets.length) {
                var ctx = document.getElementById('myChart').getContext('2d');
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: datasets
                    },
                    options: {
                        responsive: false,
                        animation: {
                            duration: 0
                        },
                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                ticks: {
                                    maxRotation: 0
                                },
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Date'
                                }
                            }],
                            yAxes: [{
                                display: true,
                                id: 'temperature',
                                scaleLabel: {
                                    display: true,
                                    labelString: 'temperature'
                                },
                                gridLines: {
                                    color: 'rgba(255, 0, 0, 0.2)'
                                },
                                ticks: {
                                    suggestedMax: Math.ceil(maxTemp) + 0.5,
                                    suggestedMin: Math.floor(minTemp) - 0.5
                                }
                            }, {
                                display: true,
                                id: 'humidity',
                                position: 'right',
                                scaleLabel: {
                                    display: true,
                                    labelString: 'humidity'
                                },
                                gridLines: {
                                    color: 'rgba(0, 0, 255, 0.2)'
                                },
                                ticks: {
                                    suggestedMax: maxHumidity + 2,
                                    suggestedMin: minHumidity - 2
                                }
                            }]
                        }
                    }
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                { id: 'canvas-container' },
                _react2.default.createElement('canvas', { id: 'myChart', width: '400', height: '400' })
            );
        }
    }]);

    return Graph;
}(_react2.default.Component);

exports.default = Graph;