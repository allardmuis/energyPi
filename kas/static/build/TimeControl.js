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

var MAX_ZOOM = 44640;

var TimeControl = function (_React$Component) {
    _inherits(TimeControl, _React$Component);

    function TimeControl(props) {
        _classCallCheck(this, TimeControl);

        var _this = _possibleConstructorReturn(this, (TimeControl.__proto__ || Object.getPrototypeOf(TimeControl)).call(this, props));

        _this.back = _this.back.bind(_this);
        _this.forward = _this.forward.bind(_this);
        _this.zoomout = _this.zoomout.bind(_this);
        _this.mouseUp = _this.mouseUp.bind(_this);
        _this.mouseDown = _this.mouseDown.bind(_this);
        _this.mouseMove = _this.mouseMove.bind(_this);
        _this.outsideMouseUp = _this.outsideMouseUp.bind(_this);
        _this.state = {
            zoomInActive: false,
            zoomInStart: 0,
            zoomInEnd: 0
        };
        return _this;
    }

    _createClass(TimeControl, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            document.onmouseup = this.outsideMouseUp;
        }
    }, {
        key: 'back',
        value: function back(e) {
            var newEnd;
            if (this.props.end == 'now') {
                newEnd = new Date();
            } else {
                newEnd = new Date(this.props.end);
            }
            var diff = Math.max(Math.round(this.props.period / 2), 1);
            newEnd.setMinutes(newEnd.getMinutes() - diff);
            this.props.setTimeData(newEnd, this.props.period, this.props.zoom);
        }
    }, {
        key: 'forward',
        value: function forward(e) {
            if (this.props.end == 'now') {
                return;
            }

            var newEnd = new Date(this.props.end);
            var diff = Math.max(Math.round(this.props.period / 2), 1);
            newEnd.setMinutes(newEnd.getMinutes() + diff);
            if (new Date().getTime() < newEnd.getTime() + 0.05 * this.props.period * 60 * 1000) {
                newEnd = 'now';
            }
            this.props.setTimeData(newEnd, this.props.period, this.props.zoom);
        }
    }, {
        key: 'zoomout',
        value: function zoomout(e) {
            var newPeriod = this.getZoomOutPeriod(this.props.period);
            var newZoom = this.periodToZoom(newPeriod);
            var newEnd;
            if (this.props.end == 'now') {
                newEnd = 'now';
            } else {
                newEnd = new Date(this.props.end);
                var diff = Math.round((newPeriod - this.props.period) / 2);
                newEnd.setMinutes(newEnd.getMinutes() + diff);
                if (newEnd.getTime() > this.props.end.getTime()) {
                    newEnd = 'now';
                }
            }

            this.props.setTimeData(newEnd, newPeriod, newZoom);
        }
    }, {
        key: 'getZoomOutPeriod',
        value: function getZoomOutPeriod(currentPeriod) {
            var periods = [30, 60, 240, 720, 1440, 4320, 10080];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = periods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var period = _step.value;

                    if (currentPeriod < 0.85 * period) {
                        return period;
                    }
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

            return MAX_ZOOM;
        }
    }, {
        key: 'periodToZoom',
        value: function periodToZoom(period) {
            var zoomLevels = [[301, 0], [901, 1], [1801, 2], [4400, 3]];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = zoomLevels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var zoomLevel = _step2.value;

                    if (period < zoomLevel[0]) {
                        return zoomLevel[1];
                    }
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

            return 4;
        }
    }, {
        key: 'mouseDown',
        value: function mouseDown(e) {
            if (e.button == 0) {
                this.setState({
                    zoomInActive: true,
                    zoomInStart: e.clientX,
                    zoomInEnd: e.clientX
                });
                this.lastMoveUpdate = -1;
            }
        }
    }, {
        key: 'mouseMove',
        value: function mouseMove(e) {
            if (this.state.zoomInActive) {
                this.setState({
                    zoomInEnd: e.clientX
                });
            }
        }
    }, {
        key: 'mouseUp',
        value: function mouseUp(e) {
            if (this.state.zoomInActive) {
                this.calculateZoomPeriod();
                this.setState({
                    zoomInActive: false,
                    zoomInStart: 0,
                    zoomInEnd: 0
                });
            }
        }
    }, {
        key: 'outsideMouseUp',
        value: function outsideMouseUp(e) {
            if (this.state.zoomInActive && e.target.id != 'zoomin' && (!e.target.parentElement || e.target.parentElement.id != 'zoomin')) {
                this.setState({
                    zoomInActive: false,
                    zoomInStart: 0,
                    zoomInEnd: 0
                });
            }
        }
    }, {
        key: 'getZoomInLeft',
        value: function getZoomInLeft() {
            return Math.min(this.state.zoomInStart, this.state.zoomInEnd) - document.getElementById('zoomin').getBoundingClientRect().left + 'px';
        }
    }, {
        key: 'getZoomInWidth',
        value: function getZoomInWidth() {
            return Math.abs(this.state.zoomInEnd - this.state.zoomInStart) + 'px';
        }
    }, {
        key: 'calculateZoomPeriod',
        value: function calculateZoomPeriod() {
            var area = document.getElementById('zoomin').getBoundingClientRect();
            var right = (Math.max(this.state.zoomInStart, this.state.zoomInEnd) - area.left) / (area.right - area.left);
            var width = Math.abs(this.state.zoomInEnd - this.state.zoomInStart) / (area.right - area.left);
            var newPeriod = width * this.props.period;
            var newEnd = this.props.end == 'now' ? new Date() : new Date(this.props.end);
            newEnd.setMinutes(newEnd.getMinutes() - (1 - right) * this.props.period);
            if (new Date().getTime() < newEnd.getTime() + 0.05 * newPeriod * 60 * 1000) {
                newEnd = 'now';
            }
            var newZoom = this.periodToZoom(newPeriod);
            this.props.setTimeData(newEnd, newPeriod, newZoom);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: 'time-control', className: this.props.loading ? 'loading' : '' },
                this.props.loading && _react2.default.createElement('div', { className: 'glyphicon loading' }),
                _react2.default.createElement('a', { id: 'back',
                    className: 'glyphicon',
                    onClick: this.back,
                    onMouseMove: this.mouseMove,
                    onMouseUp: this.mouseUp }),
                this.props.end != 'now' && _react2.default.createElement('a', { id: 'forward',
                    className: 'glyphicon',
                    onClick: this.forward,
                    onMouseMove: this.mouseMove,
                    onMouseUp: this.mouseUp }),
                this.props.period < MAX_ZOOM && _react2.default.createElement('a', { id: 'zoomout', className: 'glyphicon', onClick: this.zoomout }),
                _react2.default.createElement(
                    'div',
                    { id: 'zoomin',
                        onMouseDown: this.mouseDown,
                        onMouseMove: this.mouseMove,
                        onMouseUp: this.mouseUp },
                    this.state.zoomInActive && _react2.default.createElement('div', { id: 'zoom-period', style: { left: this.getZoomInLeft(), width: this.getZoomInWidth() } })
                )
            );
        }
    }]);

    return TimeControl;
}(_react2.default.Component);

exports.default = TimeControl;