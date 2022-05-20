!function(e,l){"object"==typeof exports&&"object"==typeof module?module.exports=l():"function"==typeof define&&define.amd?define([],l):"object"==typeof exports?exports.data=l():e.data=l()}(self,(()=>(()=>{"use strict";var e={d:(l,n)=>{for(var d in n)e.o(n,d)&&!e.o(l,d)&&Object.defineProperty(l,d,{enumerable:!0,get:n[d]})},o:(e,l)=>Object.prototype.hasOwnProperty.call(e,l),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},l={};e.r(l),e.d(l,{default:()=>n});

const events = [
	{
		acType: "350-941",
		tailNr: "F-WWW1",
		alt: 30005,
		lat: 43.2,
		lon: 2.5,
		machMax: 0.9
	},
	{
		acType: "320-211",
		tailNr: "F-WWW2",
		alt: 35017,
		lat: 42.9,
		lon: 1.5,
		machMax: 0.906
	},
	{
		acType: "380-841",
		tailNr: "F-WWW3",
		alt: 32987,
		lat: 43.2,
		lon: 1.3,
		machMax: 0.901
	}
];

const routes_A350 = [
	{
		lat: 45.5,
		lon: -1.5,
		nbHours: 678
	},
	{
		lat: 45.5,
		lon: -0.5,
		nbHours: 34
	},
	{
		lat: 45.5,
		lon: 0.5,
		nbHours: 243
	},
	{
		lat: 45.5,
		lon: 1.5,
		nbHours: 514
	}
];

const routes_A380 = [
	{
		lat: 42.5,
		lon: -1.5,
		nbHours: 600
	},
	{
		lat: 42.5,
		lon: -0.5,
		nbHours: 34
	},
	{
		lat: 42.5,
		lon: 0.5,
		nbHours: 243
	},
	{
		lat: 42.5,
		lon: 1.5,
		nbHours: 514
	}
];

const routes_both = [
	{
		lat: 43.5,
		lon: 1.5,
		nbHours: 678
	},
	{
		lat: 43.5,
		lon: 2.5,
		nbHours: 34
	},
	{
		lat: 44.5,
		lon: 2.5,
		nbHours: 243
	},
	{
		lat: 44.5,
		lon: 1.5,
		nbHours: 514
	}
];


const n = {
	a350: {
		events: events.filter(event => event.acType.startsWith("350")),
		routes: routes_A350,
		nbHoursMin: routes_A350.reduce((acc,route) => Math.min(acc,route.nbHours),routes_A350[0].nbHours),
		nbHoursMax: routes_A350.reduce((acc,route) => Math.max(acc,route.nbHours),routes_A350[0].nbHours)
	},
	a380: {
		events: events.filter(event => event.acType.startsWith("380")),
		routes: routes_A380,
		nbHoursMin: routes_A380.reduce((acc,route) => Math.min(acc,route.nbHours),routes_A380[0].nbHours),
		nbHoursMax: routes_A380.reduce((acc,route) => Math.max(acc,route.nbHours),routes_A380[0].nbHours)
	},
	both: {
		events: events,
		routes: routes_both,
		nbHoursMin: routes_both.reduce((acc,route) => Math.min(acc,route.nbHours),routes_both[0].nbHours),
		nbHoursMax: routes_both.reduce((acc,route) => Math.max(acc,route.nbHours),routes_both[0].nbHours)
	}
};

return l})()));

