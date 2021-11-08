import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { CovidCaseService } from '../services/CovidCaseService';
import { MapUtil } from '../utils/MapUtil';
import CaseCard from './CaseCard';

/*
Map is from npm: https://www.npmjs.com/package/google-map-react
1. 記得要換 function name to Map 跟file name 一致
2. center change to default in US: lat:42, lng: -74
3. 定義State: covidPoints, zoomLevel, boundry
4. 加上 Google API Key
5. onGoogleApiLoaded-連接setCovidPoints.bind：
6. onChange-連接setState 用於減少block的情況，zoom多少給多少數據
7. renderPoints function
8. setCovidPoints function- 連接CovidCaseService

 */


const AnyReactComponent = ({ text }) => <div>{text}</div>;

class Map extends Component {
    //移到美國位置
    static defaultProps = {
        center: {
            lat: 42,
            lng: -74
        },
        zoom: 11
    };
    //state: 連結covid Points, zoom level, boundry
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
                    //onGoogleApiLoaded 連接setCovidPoints
                    onGoogleApiLoaded={this.setCovidPoints.bind(this)}
                    //on change 減少block的情況，要設立boundry就不會一直load全部數據
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
        const usToRender = this.country.covidPoints[this.country.zoomLevel];
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
        } else if (pointsToRender.type === 'state') { // Render state points
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
        //todo
        if (!usToRender) {
            return result;
        }

        // Render country points
        if (Array.isArray(usToRender)) {
            for (const point of usToRender) {
                if (!MapUtil.inBoundary(this.country.boundry, point.coordinates)) {
                    continue;
                }
                result.push(<CaseCard firstTitle={point.country}
                                      confirmed={point.stats.confirmed}
                                      death={point.stats.deaths}
                                      lat={point.coordinates.latitude}
                                      lng={point.coordinates.longitude}
                />)
            }
        } else if (usToRender.type === 'country') { // Render state points

            for (const country in usToRender) {
                if (usToRender[country] === 'country') {
                    continue;
                }
                for (const country in usToRender[country]) {
                    const point = usToRender[country];
                    if (!MapUtil.inBoundary(this.country.boundry, point.coordinates)) {
                        continue;
                    }
                    result.push(<CaseCard
                                          secondTitle={country}
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