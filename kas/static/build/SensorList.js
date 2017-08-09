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

var SensorList = function (_React$Component) {
    _inherits(SensorList, _React$Component);

    function SensorList() {
        _classCallCheck(this, SensorList);

        return _possibleConstructorReturn(this, (SensorList.__proto__ || Object.getPrototypeOf(SensorList)).apply(this, arguments));
    }

    _createClass(SensorList, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'ul',
                { className: 'sensor-list' },
                this.props.sensors.map(function (sensor) {
                    return _react2.default.createElement(Sensor, { key: sensor.id,
                        id: sensor.id,
                        name: sensor.name,
                        colors: sensor.colors,
                        selected: _this2.props.selected.includes(sensor.id),
                        activateSensor: _this2.props.activateSensor,
                        deactivateSensor: _this2.props.deactivateSensor
                    });
                })
            );
        }
    }]);

    return SensorList;
}(_react2.default.Component);

exports.default = SensorList;

var Sensor = function (_React$Component2) {
    _inherits(Sensor, _React$Component2);

    function Sensor(props) {
        _classCallCheck(this, Sensor);

        var _this3 = _possibleConstructorReturn(this, (Sensor.__proto__ || Object.getPrototypeOf(Sensor)).call(this, props));

        _this3.handleChange = _this3.handleChange.bind(_this3);
        return _this3;
    }

    _createClass(Sensor, [{
        key: 'handleChange',
        value: function handleChange(e) {
            if (this.props.selected) {
                this.props.deactivateSensor(this.props.id);
            } else {
                this.props.activateSensor(this.props.id);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'li',
                { className: 'sensor sensor' + this.props.id },
                _react2.default.createElement(
                    'style',
                    { type: 'text/css' },
                    '.sensor' + this.props.id + ' label::before {border-top-color: ' + this.props.colors.temperature + '; border-right-color: ' + this.props.colors.humidity + ';}'
                ),
                _react2.default.createElement(
                    'label',
                    null,
                    _react2.default.createElement('input', { type: 'checkbox', checked: this.props.selected, onChange: this.handleChange }),
                    this.props.name
                )
            );
        }
    }]);

    return Sensor;
}(_react2.default.Component);