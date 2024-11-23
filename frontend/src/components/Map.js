import React, { Component } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import TileJSON from 'ol/source/TileJSON.js';
import VectorSource from 'ol/source/Vector.js';
import Point from 'ol/geom/Point.js';
import {fromLonLat} from 'ol/proj.js';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import Feature from 'ol/Feature.js';
import {Icon, Style} from 'ol/style.js';
import {Circle, Fill, Text, Stroke} from 'ol/style';
import { Select } from 'ol/interaction';
import { pointerMove } from 'ol/events/condition';
import Overlay from 'ol/Overlay.js';
/*
import {
    DragRotateAndZoom,
    defaults as defaultInteractions,
    DragPan
  } from 'ol/interaction.js';
*/


class OpenLayersMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapRef: React.createRef(),
            map: null,
            vectorSource: new VectorSource({}),
            currentPosition: null,//This should be a feature to add to the map
            currentView: new View({
                                    center: fromLonLat([-1.890401, 52.48624299999999]),
                                    zoom: 5,
                                }),
        }
    }

    //Features to add

    //Add a marker that is blue for the current location
    //Red for a game location
    //Green for a game the user is participating in
    //Yellow for a favourite game
    //Where Yellow takes priority over Green which takes priority over Red

    //Clicking on a marker will filter the results list to just contain the game specified by the marker

    //Center the map on the user's current location,
    //defaulting to the location from the user's profile if no other location can be found
    //Add a preferred location, which would have a green colour instead


    componentDidMount() {


        const vectorLayer = new VectorLayer({
            source: this.state.vectorSource,
            style: new Style({
                image: new Circle({
                  radius: 5,
                  fill: new Fill({ color: 'rgb(255, 0, 0)' }),
                  stroke: new Stroke({ color: '#000000', width: 1.5 }),
                }),
                text: new Text({
                    text: '',//marker.get('attribute'),
                    offsetY: -15,
                    fill: new Fill({color: '#fff'}),
                    backgroundFill: new Fill({color: '#000'}),
                    padding: [3, 3, 3, 3],
                    textAlign: 'center',
                  }),
              }),
        });


        const tileLayer = new TileLayer({source: new OSM(),})

        const selectPointerMove = new Select({
            condition: pointerMove,
        });
        
        //Add the mouse hover interaction
        var self = this;
        //Only alter the first item hovered over to prevent overlapping
        selectPointerMove.on('select', function(e) {
            if (e.selected.length > 0) {
                var feature = e.selected[0];
                var attribute = feature.get('attribute');
                var type = feature.get('type');
                var selected = feature.get('selected');
        
                console.log(attribute);
                console.log("MAP: " + self.state.map);

                //If the feature is selected, only add the text and don't change the default selected style
                if (selected) {
                    
                    feature.setStyle(
                        new Style({
                            image: new Circle({
                                radius: 6,
                                fill: new Fill({ color: '#0099FF' }),
                                stroke: new Stroke({ color: '#ffffff', width: 1.5 }),
                            }),
                            text: new Text({
                                text: attribute,
                                offsetY: -15,
                                fill: new Fill({color: '#000'}),
                                backgroundFill: new Fill({color: '#fff'}),
                                padding: [3, 3, 3, 3],
                                textAlign: 'center',
                                backgroundStroke: new Stroke({
                                    color: 'black',
                                    width: 1,
                                }),
                            }),
                        }),
                    );
                    
                }
                
                else {
                    //Set the style depending on the type of feature selected
                    if (type == "Game") {
                        feature.setStyle(
                            new Style({
                                image: new Circle({
                                    radius: 5,
                                    fill: new Fill({ color: 'rgb(255, 0, 0)' }),
                                    stroke: new Stroke({ color: '#000000', width: 1.5 }),                        }),
                                text: new Text({
                                    text: attribute,
                                    offsetY: -15,
                                    fill: new Fill({color: '#000'}),
                                    backgroundFill: new Fill({color: '#fff'}),
                                    padding: [3, 3, 3, 3],
                                    textAlign: 'center',
                                    backgroundStroke: new Stroke({
                                        color: 'black',
                                        width: 1,
                                    }),
                                }),
                            }),
                        );
                    }

                    else if (type == "Location") {
                        feature.setStyle(
                            new Style({
                                image: new Circle({
                                    radius: 5,
                                    fill: new Fill({ color: 'rgb(0, 0, 255)' }),
                                    stroke: new Stroke({ color: '#000000', width: 1.5 }),                        }),
                                text: new Text({
                                    text: attribute,
                                    offsetY: -15,
                                    fill: new Fill({color: '#000'}),
                                    backgroundFill: new Fill({color: '#fff'}),
                                    padding: [3, 3, 3, 3],
                                    textAlign: 'center',
                                    backgroundStroke: new Stroke({
                                        color: 'black',
                                        width: 1,
                                    }),
                                }),
                            }),
                        );
                    }

                }
            }
        });

        //Add select interaction
        var selectClick = new Select();
        selectClick.on('select', (e) => {
            if (e.selected.length > 0) {
                var feature = e.selected[0];
                var attribute = feature.get('attribute');
                var type = feature.get('type');
        
                // Change style attribute of feature
                feature.set('selected', true);
        
        
                const selectedFeatureCoordinates = feature.getGeometry().getCoordinates();
                const lat = selectedFeatureCoordinates[1];
                const lon = selectedFeatureCoordinates[0];
                console.log(lat, lon);
              
                //Execute the handleMapChange function within the parent component
                this.props.function("Selected", lat, lon);
            }
            else {
                //Set all feature's selected status to false
                this.state.vectorSource.getFeatures().forEach(function(feature) {
                    feature.set('selected', false);
                });
            }
        });

        //Create the map
        console.log("ACTUAL VIEW!!!");
        console.log(this.state.currentView);

        this.state.map = new Map({
            target: this.state.mapRef.current,
            layers: [tileLayer, vectorLayer],
            view: this.state.currentView,
        });

        //Add all interactions
        this.state.map.addInteraction(selectPointerMove);
        this.state.map.addInteraction(selectClick);


        //Request the user's current location
        //var self = this;//Defined above
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position.coords.latitude, position.coords.longitude);
            //set the current position
            self.state.currentPosition = new Feature({
                geometry: new Point(fromLonLat([position.coords.longitude, position.coords.latitude])),
                attribute: "Current Location",
                type: "Location",
                selected: false
            });

            //Create the location feature
            self.state.currentPosition.setStyle(new Style({
                image: new Circle({
                  radius: 5,
                  fill: new Fill({ color: 'rgb(0, 0, 255)' }),
                  stroke: new Stroke({ color: '#000000', width: 1.5 }),
                }),
                text: new Text({
                  text: '',//"Current Location",
                  offsetY: -15,
                  fill: new Fill({color: '#000'}),
                  backgroundFill: new Fill({color: '#fff'}),
                  padding: [3, 3, 3, 3],
                  textAlign: 'center',
                  backgroundStroke: new Stroke({
                      color: 'black',
                      width: 1,
                  }),
                }),
            }));
            //Add the current position to the vectorlayer
            self.state.vectorSource.addFeature(self.state.currentPosition);

            //Create the new view for the map
            self.state.currentView = new View({
                center: fromLonLat([position.coords.longitude, position.coords.latitude]),
                zoom: 10,
            });
            console.log("CURRENT VIEW CHANGED!!!");
            console.log(self.state.currentView);

            //Change the current view for the map
            self.state.map.setView(self.state.currentView);

            //Execute the handleMapChange function within the parent component
            self.props.function("Current", position.coords.latitude, position.coords.longitude);
        });
        
        
        
        
        this.setState({map: this.state.map});



        //Test adding a marker feature
        //const london = [-0.1277583, 51.5073509];

        //const markertest = new Feature({
        //    geometry: new Point(fromLonLat(london)),
        //    attribute: "This is a red circle",
        //});

        //this.state.vectorSource.addFeature(markertest);


        // Add class to map container
        this.state.map.getTargetElement().classList.add('map-container');


        //Add onClick functionality
        this.state.map.on('click', (e) => {
            console.log("MAP EVENT LISTENER WORKING!!!");
            //console.log(this.state.map);

            //Find the selected location
            var position = this.state.map.getCoordinateFromPixel(e.pixel);
            //console.log(position);

            //Calculate the correct latitude and longitude format
            //This should convert from the EPSG:3857 used as default by openlayers
            //To the EPSG:4326 used by most other gps services
            const x = position[0] / 20037508.34 * 180;
            const y = position[1] / 20037508.34 * 180;
            const lat = 180/Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2);
            const lon = x;
            console.log(lat, lon);

            //Execute the handleMapChange function within the parent component
            this.props.function("Selected", lat, lon);
            //console.log(ol.proj.transform(position, 'EPSG:3857', 'EPSG:4326'));
      
          });
    }


    componentDidUpdate(prevProps, prevState) {
        //console.log(this.props.filteredGames);
        if (prevProps.filteredGames !== this.props.filteredGames) {
            //Remove all features
            this.state.vectorSource.clear();

            //Add all filtered games
            this.props.filteredGames.map((game) => {
                const marker = new Feature({
                geometry: new Point(fromLonLat([game.location_longitude, game.location_latitude])),
                attribute: game.session_title,
                type: "Game"
                });
                this.state.vectorSource.addFeature(marker);
            });

            //Add the current location if available
            if (this.state.currentPosition != null) {
                this.state.vectorSource.addFeature(this.state.currentPosition);
            }
        }
        //console.log("CURRENT POSITION: ");
        //console.log(this.state.currentPosition);
        if (prevState.currentPosition !== this.state.currentPosition) {
            //console.log("CURRENT POSITION CHANGED!!!");
            
            //Remove the previous current location marker feature
            const previousCurrentLocationMarker = this.vectorSource.getFeatures().find(feature => feature.get('type') === "Location");
            if (previousCurrentLocationMarker) {
                this.vectorSource.removeFeature(previousCurrentLocationMarker);
            }
            //Add the current location
            this.state.vectorSource.addFeature(this.state.currentPosition);
        }
    }


    componentWillUnmount() {
        this.state.map.setTarget(null);
    }

    render() {//Here, the 'info' div is used as a method of storage for a value to be displayed inside the map overlay
        return (

            <div ref={this.state.mapRef} className="map" style={{ width: '100%', height: '100%', border: '3px solid black', fontsize: '18px'}}>
            </div>

        );
    }
}

export default OpenLayersMap;