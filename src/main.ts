import data from "data";
import "./styles.scss"
import type {Event, Route} from "./types";
import L from "leaflet";
import chroma from "chroma-js";
import DiscreteLegend from "./legend-discrete";
import ColorbarLegend from "./legend-colorbar";
import * as modif from "./modify-leaflet-layers-controls";


const map = L.map("root").setView([43.5,1.4], 7);


// @1: markers and colors
const markerIcon350   = L.icon({iconUrl: "./images/map-marker-orange.svg", iconSize: [25,25]});
const markerIcon380   = L.icon({iconUrl: "./images/map-marker-green.svg",  iconSize: [25,25]});
const markerIconOther = L.icon({iconUrl: "./images/map-marker-black.svg",  iconSize: [25,25]});

function getMarkerIcon(event: Event): L.Icon<L.IconOptions> {
	if (event.acType.startsWith("350")) {return markerIcon350;}
	if (event.acType.startsWith("380")) {return markerIcon380;}
	return markerIconOther;
}

const curvColor = 0;
const curvScale = 0;

function myexp(x: number, min: number, max: number, a: number): number {
	let k = (x-min) / (max-min);
	if (a != null && a !== 0) {k = (Math.exp(a*k)-1) / (Math.exp(a)-1);}
	return k;
}

function getColor(x: number, min: number, max: number, a: number): string {
	const k = myexp(x, min, max, a);
	// return chroma.scale("YlOrRd")(k).hex();
	return chroma.scale("Spectral")(1-k).hex();
	// return chroma.scale("RdYlBu")(1-k).hex();
}


// @1: tile layers
const tile_openStreetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const tile_stamenTerrain = L.tileLayer("https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg", {
	attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
});

const tile_openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

const tile_cyclosm = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// @1: overlay layers
function routeToRectangle(route: Route, fillColorFct: (nbHours: number) => string): L.Rectangle {
	return L.rectangle([[route.lat-0.5,route.lon-0.5],[route.lat+0.5,route.lon+0.5]], {
		fillColor: fillColorFct(route.nbHours),
		fillOpacity: 0.5,
		stroke: false,
		interactive: false
	});
}

const rectangles_A350 = data.a350.routes.map(route => routeToRectangle(route, hours => getColor(100*hours/data.a350.nbHoursMax,0,100,curvColor)));
const rectangles_A380 = data.a380.routes.map(route => routeToRectangle(route, hours => getColor(100*hours/data.a380.nbHoursMax,0,100,curvColor)));
const rectangles_both = data.both.routes.map(route => routeToRectangle(route, hours => getColor(100*hours/data.both.nbHoursMax,0,100,curvColor)));

function computePopupContent(event: Event): HTMLDivElement {
	const popupContent = L.DomUtil.create("div", "leaflet-mypopup");
	popupContent.innerHTML += '<div><b>AcType</b>: ' + event.acType + '</div>';
	popupContent.innerHTML += '<div style="margin-bottom: 5px;"><b>TailNr</b>: ' + event.tailNr + '</div>';
	popupContent.innerHTML += '<div><b>Altitude</b>: ' + event.alt + '</div>';
	popupContent.innerHTML += '<div><b>Mach max</b>: ' + event.machMax + '</div>';
	return popupContent;
}

function computeMarkerWithPopup(event: Event): L.Marker {
	const m = L.marker([event.lat, event.lon], {icon: getMarkerIcon(event)});
	m.bindPopup(computePopupContent(event));
	return m;
}

const markers_A350 = data.a350.events.map(computeMarkerWithPopup);
const markers_A380 = data.a380.events.map(computeMarkerWithPopup);
const markers_both = data.both.events.map(computeMarkerWithPopup);

const overlay_A350  = L.layerGroup([...rectangles_A350,...markers_A350]);
const overlay_A380  = L.layerGroup([...rectangles_A380,...markers_A380]);
const overlay_both1 = L.layerGroup([...rectangles_both,...markers_both]).addTo(map);
const overlay_both2 = L.layerGroup([...markers_both]);


// @1: legends
const discreteLegend = new DiscreteLegend({
	title: "Categories",
	items: [
		{name: "Cat 1", color: "green"},
		{name: "Cat 2", color: "orange"},
		{name: "Cat 3", color: "red"}
	],
	options: {
		position: "bottomleft"
	}
}).addTo(map);

const colorbarLegend = new ColorbarLegend({
	title: "Temp.<br/>(°C)",
	range: [0,90],
	getColor: x => getColor(x,0,90,curvColor),
	breaks: [0,20,40,60,75,90],
	nbPixels: 120,
	orientation: "vertical",
	transform: x => myexp(x,0,1,curvScale),
	options: {
		position: "bottomleft"
	}
}).addTo(map);


// @1: layers control
L.control.layers({
	"OpenStreetMap": tile_openStreetMap,
	"Stamen Terrain": tile_stamenTerrain,
	"OpenTopoMap": tile_openTopoMap,
	"Cyclo OSM": tile_cyclosm
}, {
	"A350": overlay_A350,
	"A380": overlay_A380,
	"Both": overlay_both1,
	"Both (markers only)": overlay_both2
}).addTo(map);


function onOverlayClick(overlayName: string) {
	discreteLegend.setTitle(overlayName);
	discreteLegend.setItems([
		{name: "Cat 1", color: "green"},
		{name: "Cat 2", color: "orange"}
	]);

	colorbarLegend.setTitle(overlayName);
	colorbarLegend.updateColorbar({
		range: [0,100],
		breaks: [0,20,40,60,80,100],
		getColor: x => getColor(x,0,90,2),
		transform: x => myexp(x,0,1,2)
	});
}

modif.transformOverlaysControlsIntoRadio(["A350","A380","Both","Both (markers only)"],"aircraft",onOverlayClick);
modif.addOverlayGroupLabelBefore("A350","Aircrafts");

