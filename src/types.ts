export type Data = {
	[key: string]: {
		events: Event[],
		routes: Route[],
		nbHoursMin: number,
		nbHoursMax: number
	}
};

export type Event = {
	acType: string;
	tailNr: string;
	alt: number;
	lat: number;
	lon: number;
	machMax: number;
};

export type Route = {
	lat: number;
	lon: number;
	nbHours: number;
};
