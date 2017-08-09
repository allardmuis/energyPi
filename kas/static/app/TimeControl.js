import React from 'react';

const MAX_ZOOM = 44640;

export default class TimeControl extends React.Component {
    
    constructor(props) {
        super(props);
        this.back = this.back.bind(this);
        this.forward = this.forward.bind(this);
        this.zoomout = this.zoomout.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.outsideMouseUp = this.outsideMouseUp.bind(this);
        this.state = {
            zoomInActive: false,
            zoomInStart: 0,
            zoomInEnd: 0,
        };
    }
    
    componentDidMount() {
        document.onmouseup = this.outsideMouseUp;
    }
    
    back(e) {
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
    
    forward(e) {
        if (this.props.end == 'now') {
            return;
        }
        
        var newEnd = new Date(this.props.end);
        var diff = Math.max(Math.round(this.props.period / 2), 1);
        newEnd.setMinutes(newEnd.getMinutes() + diff);
        if ((new Date()).getTime() < newEnd.getTime() + 0.05 * this.props.period * 60 * 1000) {
            newEnd = 'now';
        }
        this.props.setTimeData(newEnd, this.props.period, this.props.zoom);
    }
    
    zoomout(e) {
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
    
    getZoomOutPeriod(currentPeriod) {
        var periods = [30, 60, 240, 720, 1440, 4320, 10080];
        for (var period of periods) {
            if (currentPeriod < (0.85 * period)) {
                return period;
            }
        }
        
        return MAX_ZOOM;
    }
    
    periodToZoom(period) {
        var zoomLevels = [
            [301, 0], [901, 1], [1801, 2], [4400, 3],
        ];
        for (var zoomLevel of zoomLevels) {
            if (period < zoomLevel[0]) {
                return zoomLevel[1];
            }
        }
        
        return 4;
    }
    
    mouseDown(e) {
        if (e.button == 0) {
            this.setState({
                zoomInActive: true,
                zoomInStart: e.clientX,
                zoomInEnd: e.clientX,
            });
            this.lastMoveUpdate = -1;
        }
    }
    
    mouseMove(e) {
        if (this.state.zoomInActive) {
            this.setState({
                zoomInEnd: e.clientX,
            });
        }
    }
    
    mouseUp(e) {
        if (this.state.zoomInActive) {
            this.calculateZoomPeriod();
            this.setState({
                zoomInActive: false,
                zoomInStart: 0,
                zoomInEnd: 0,
            });
        }
    }
    
    outsideMouseUp(e) {
        if (this.state.zoomInActive && e.target.id != 'zoomin' && (!e.target.parentElement || e.target.parentElement.id != 'zoomin')) {
            this.setState({
                zoomInActive: false,
                zoomInStart: 0,
                zoomInEnd: 0,
            });
        }
    }
    
    getZoomInLeft() {
        return Math.min(this.state.zoomInStart, this.state.zoomInEnd) - document.getElementById('zoomin').getBoundingClientRect().left + 'px';
    }
    
    getZoomInWidth() {
        return Math.abs(this.state.zoomInEnd - this.state.zoomInStart) + 'px';
    }
    
    calculateZoomPeriod() {
        var area = document.getElementById('zoomin').getBoundingClientRect();
        var right = (Math.max(this.state.zoomInStart, this.state.zoomInEnd) - area.left) / (area.right - area.left);
        var width = Math.abs(this.state.zoomInEnd - this.state.zoomInStart) / (area.right - area.left);
        var newPeriod = width * this.props.period;
        var newEnd = this.props.end == 'now' ? new Date() : new Date(this.props.end);
        newEnd.setMinutes(newEnd.getMinutes() - (1 - right) * this.props.period);
        if ((new Date()).getTime() < newEnd.getTime() + 0.05 * newPeriod * 60 * 1000) {
            newEnd = 'now';
        }
        var newZoom = this.periodToZoom(newPeriod);
        this.props.setTimeData(newEnd, newPeriod, newZoom);
    }
    
    render() {
        return (
            <div id="time-control" className={this.props.loading ? 'loading' : ''}>
                {this.props.loading && <div className="glyphicon loading"></div>}
                <a id="back"
                   className="glyphicon"
                   onClick={this.back}
                   onMouseMove={this.mouseMove}
                   onMouseUp={this.mouseUp}>
                </a>
                {this.props.end != 'now' && <a id="forward"
                                               className="glyphicon"
                                               onClick={this.forward}
                                               onMouseMove={this.mouseMove}
                                               onMouseUp={this.mouseUp}>
                                            </a>}
                {this.props.period < MAX_ZOOM && <a id="zoomout" className="glyphicon" onClick={this.zoomout}></a>}
                <div id="zoomin"
                     onMouseDown={this.mouseDown}
                     onMouseMove={this.mouseMove}
                     onMouseUp={this.mouseUp}>
                    {this.state.zoomInActive && <div id="zoom-period" style={{left: this.getZoomInLeft(), width: this.getZoomInWidth()}}></div>}
                </div>
            </div>
        );
    }
}