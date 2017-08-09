'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _TimeControl = require('./TimeControl');

var _TimeControl2 = _interopRequireDefault(_TimeControl);

var _Graph = require('./Graph');

var _Graph2 = _interopRequireDefault(_Graph);

var _SensorList = require('./SensorList');

var _SensorList2 = _interopRequireDefault(_SensorList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            selectedSensors: [0, 1, 2],
            data: [],
            zoom: 0,
            end: 'now',
            period: 60,
            loading: true
        };
        _this.sensors = [{
            id: 0,
            name: 'sensor 0'
        }, {
            id: 1,
            name: 'sensor 1'
        }, {
            id: 2,
            name: 'sensor 2'
        }];
        for (var i = 0; i < _this.sensors.length; i++) {
            _this.sensors[i].colors = {
                temperature: 'rgba(' + (255 - 100 / (_this.sensors.length - 1) * i) + ', ' + 70 / (_this.sensors.length - 1) * i + ', 0, 0.6)',
                humidity: 'rgba(0, ' + 70 / (_this.sensors.length - 1) * i + ', ' + (255 - 100 / (_this.sensors.length - 1) * i) + ', 0.6)'
            };
        }
        _this.activateSensor = _this.activateSensor.bind(_this);
        _this.deactivateSensor = _this.deactivateSensor.bind(_this);
        _this.setTimeData = _this.setTimeData.bind(_this);

        return _this;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.updateData();
            this.setTimer(60);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearInterval(this.timerID);
        }
    }, {
        key: 'setTimer',
        value: function setTimer(seconds) {
            var _this2 = this;

            if (this.timerID) {
                clearInterval(this.timerID);
            }
            this.timerID = setInterval(function () {
                if (_this2.state.end == 'now') {
                    _this2.updateData(false);
                }
            }, seconds * 1000);
        }
    }, {
        key: 'updateData',
        value: function updateData() {
            var _this3 = this;

            var loading = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (loading) {
                this.setState({ loading: true });
            }
            this.fetchData(this.state.selectedSensors, this.getStart(), this.getEnd(), this.state.zoom).then(function (sensorData) {
                _this3.setState({ data: sensorData, loading: false });
            });
        }
    }, {
        key: 'fetchSingleSensor',
        value: function fetchSingleSensor(id) {
            var _this4 = this;

            this.setState({ loading: true });
            this.fetchData([id], this.getStart(), this.getEnd(), this.state.zoom).then(function (sensorData) {
                if (sensorData.length) {
                    sensorData = sensorData.pop();
                    if (sensorData.sensor == id) {
                        var data = _this4.state.data;
                        data.push(sensorData);
                        _this4.setState({ data: data, loading: false });
                    }
                }
            });
        }
    }, {
        key: 'getStart',
        value: function getStart() {
            var start;
            if (this.state.end == 'now') {
                start = new Date();
            } else {
                start = new Date(this.state.end.getTime());
            }
            start.setMinutes(start.getMinutes() - this.state.period);
            return start;
        }
    }, {
        key: 'getEnd',
        value: function getEnd() {
            if (this.state.end == 'now') {
                return new Date();
            }

            return this.state.end;
        }
    }, {
        key: 'fetchData',
        value: function fetchData(sensors, start, end, zoom) {
            var url = 'http://nuclearpi/api?start=' + this.formatDateForApi(start) + '&end=' + this.formatDateForApi(end) + '&zoom=' + zoom + '&sensors=' + sensors.join(',');
            return fetch(url).then(function (response) {
                return response.json();
            });
        }
    }, {
        key: 'formatDateForApi',
        value: function formatDateForApi(date) {
            return date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate() + '%20' + (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        }
    }, {
        key: 'setTimeData',
        value: function setTimeData(end, period, zoom) {
            this.setState({
                end: end,
                period: period,
                zoom: zoom
            }, this.updateData);
        }
    }, {
        key: 'activateSensor',
        value: function activateSensor(id) {
            var selected = this.state.selectedSensors.slice();
            selected.push(id);
            this.setState({ 'selectedSensors': selected });

            var dataIds = this.state.data.map(function (d) {
                return d.sensor;
            });
            if (!dataIds.includes(id)) {
                this.fetchSingleSensor(id);
            }
        }
    }, {
        key: 'deactivateSensor',
        value: function deactivateSensor(id) {
            var selected = this.state.selectedSensors.slice();
            var index = selected.indexOf(id);
            selected.splice(index, 1);
            this.setState({ selectedSensors: selected });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_TimeControl2.default, { end: this.state.end, period: this.state.period, zoom: this.state.zoom, setTimeData: this.setTimeData, loading: this.state.loading }),
                _react2.default.createElement(_Graph2.default, { sensors: this.sensors, data: this.state.data, selected: this.state.selectedSensors }),
                _react2.default.createElement(_SensorList2.default, { sensors: this.sensors,
                    selected: this.state.selectedSensors,
                    activateSensor: this.activateSensor,
                    deactivateSensor: this.deactivateSensor
                })
            );
        }
    }]);

    return App;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('root'));