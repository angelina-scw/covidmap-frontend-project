import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { CovidCaseService } from '../services/CovidCaseService';
import { MapUtil } from '../utils/MapUtil';
import CaseCard from './CaseCard';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class Map extends Component {
    //change to US lat & lng
    static defaultProps = {
        center: {
            lat: 42,
            lng: -74
        },
        zoom: 11
    };
    state = {
        covidPoints: {},
        zoomLevel: 11,
        boundry: {}
    };

    country = {
        covidPoints: {},
        zoomLevel: 11,
        boundry: {}
    };

    render() {
        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    //key is Google API key
                    bootstrapURLKeys={{ key: "AIzaSyDja8xqZfvREWTKv5lsAi_MEaFQzH57Zys" }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    onGoogleApiLoaded={this.setCovidPoints.bind(this)}
                    onChange={({ zoom, bounds }) => {
                        this.setState({
                            zoomLevel: zoom,
                            boundry: bounds
                        })

                    }}
                >
                    {this.renderPoints()}
                </GoogleMapReact>
            </div>
        );
    }

    renderPoints() {
        const pointsToRender = this.state.covidPoints[this.state.zoomLevel];
        const result = [];

        if (!pointsToRender) {
            return result;
        }

        // Render county points
        if (Array.isArray(pointsToRender)) {
            for (const point of pointsToRender) {
                if (!MapUtil.inBoundary(this.state.boundry, point.coordinates)) {
                    continue;
                }
                result.push(<CaseCard firstTitle={point.province}
                    secondTitle={point.county}
                    confirmed={point.stats.confirmed}
                    death={point.stats.deaths}
                    lat={point.coordinates.latitude}
                    lng={point.coordinates.longitude}
                />)
            }
            // Render state points
        } else if (pointsToRender.type === 'state') {
            // {country: {state: {
            //     confirmed,
            //     death,
            //     coordinates,
            // }}}
            for (const country in pointsToRender) {
                if (pointsToRender[country] === 'state') {
                    continue;
                }
                for (const state in pointsToRender[country]) {
                    const point = pointsToRender[country][state];
                    if (!MapUtil.inBoundary(this.state.boundry, point.coordinates)) {
                        continue;
                    }
                    result.push(<CaseCard firstTitle={country}
                        secondTitle={state}
                        confirmed={point.confirmed}
                        death={point.death}
                        lat={point.coordinates.latitude}
                        lng={point.coordinates.longitude}
                    />)
                }
            }
        }

        return result;
    }

    setCovidPoints() {
        CovidCaseService.getAllCases() // Promise
            .then(response => {
                // expect cases are fetched from response.data
                this.setState({
                    covidPoints: MapUtil.covertCovidPoints(response.data)
                });
            })
    }
}

export default Map;