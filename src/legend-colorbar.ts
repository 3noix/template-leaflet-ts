import L from "leaflet";

type Props = {
	title?: string;
	range?: [number,number];
	getColor?: (x: number) => string;
	breaks?: number[];
	nbPixels?: number;
	orientation?: "horizontal" | "vertical";
	transform?: (x: number) => number;
	options?: L.ControlOptions;
};


export default class ColorbarLegend extends L.Control {
	title: string;
	range: [number,number];
	getColor: (x: number) => string;
	breaks: number[];
	nbPixels: number;
	orientation: "horizontal" | "vertical";
	transform: (x: number) => number;
	hBarMargin: number;
	vBarMargin: number;

	constructor(props: Props) {
		super(props.options);
		this.title = (props.title != null ? props.title : "Title");
		this.range = (props.range != null ? props.range : [0,100]);
		this.getColor = (props.getColor != null ? props.getColor : x => "black");
		this.breaks = (props.breaks != null ? props.breaks : [0,50,100]);
		this.nbPixels = (props.nbPixels != null ? props.nbPixels : 100);
		this.orientation = (props.orientation != null ? props.orientation : "horizontal");
		this.transform = (props.transform != null ? props.transform : x => x);
		this.vBarMargin = 5;
		this.hBarMargin = 10;
	}

	onAdd(map: L.Map): HTMLElement {
		const width = (this.orientation === "horizontal" ? this.nbPixels+2*this.hBarMargin : 60);
		const height = (this.orientation === "horizontal" ? 35 : this.nbPixels+2*this.vBarMargin);

		const legendContent = L.DomUtil.create("div", "leaflet-legend-colorbar");

		const titleElt = L.DomUtil.create("h4");
		titleElt.innerHTML = this.title;
		legendContent.appendChild(titleElt);

		const canvasElt = L.DomUtil.create("canvas");
		canvasElt.id = "canvas";
		canvasElt.width = width;
		canvasElt.height = height;
		legendContent.appendChild(canvasElt);

		setTimeout(() => {
			const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
			if (canvas == null) {return;}
			const context = canvas.getContext("2d");
			if (context == null) {return;}
			context.font = "10px serif";
			const min = Math.min(this.range[0],this.range[1]);
			const max = Math.max(this.range[0],this.range[1]);

			// color the rectangle
			for (let i=0; i<this.nbPixels; i++) {
				const ki2 = 1 - i / (this.nbPixels-1);
				const ki1 = evaluateInverseFor(this.transform,ki2);
				const xi = min + ki1 * (max-min);
				context.fillStyle = this.getColor(xi);
				if (this.orientation === "horizontal") {
					context.fillRect(i+this.hBarMargin,0,1,20);
				} else {
					context.fillRect(0,i+this.vBarMargin,20,1);
				}
			}

			// add the bar on the whole length (base for ticks)
			context.fillStyle = "#777";
			if (this.orientation === "horizontal") {
				context.fillRect(this.hBarMargin,20,this.nbPixels,1);
				context.textAlign = "center";
			} else {
				context.fillRect(20,this.vBarMargin,1,this.nbPixels);
				context.textAlign = "left";
			}

			// draw the ticks and their labels
			for (const brk of this.breaks) {
				const ki1 = (brk-min) / (max-min);
				const ki2 = this.transform(ki1);
				const i = (1-ki2) * (this.nbPixels-1);
				if (this.orientation === "horizontal") {
					context.fillRect(i+this.hBarMargin,15,1,5);
					context.fillText(brk.toString(),i+this.hBarMargin,32);
				} else {
					context.fillRect(15,i+this.vBarMargin,5,1);
					context.fillText(brk.toString(),25,i+this.vBarMargin+4);
				}
			}
		});
		return legendContent;
	}

	onRemove(): void {}

	updateColorbar(newProps: Props) {
		const content = this.getContainer();
		if (content == null) {return this;}

		const oldCanvasElt = document.querySelector(".leaflet-legend-colorbar canvas");
		if (oldCanvasElt) {oldCanvasElt.remove();}

		if (newProps.range != null) {this.range = newProps.range;}
		if (newProps.getColor != null) {this.getColor = newProps.getColor;}
		if (newProps.breaks != null) {this.breaks = newProps.breaks;}
		if (newProps.nbPixels != null) {this.nbPixels = newProps.nbPixels;}
		if (newProps.orientation != null) {this.orientation = newProps.orientation;}
		if (newProps.transform != null) {this.transform = newProps.transform;}

		const width = (this.orientation === "horizontal" ? this.nbPixels+2*this.hBarMargin : 60);
		const height = (this.orientation === "horizontal" ? 35 : this.nbPixels+2*this.vBarMargin);

		const canvasElt = L.DomUtil.create("canvas");
		canvasElt.id = "canvas";
		canvasElt.width = width;
		canvasElt.height = height;
		content.appendChild(canvasElt);

		const context = canvasElt.getContext("2d");
		if (context == null) {return;}
		context.font = "10px serif";
		const min = Math.min(this.range[0],this.range[1]);
		const max = Math.max(this.range[0],this.range[1]);

		// color the rectangle
		for (let i=0; i<this.nbPixels; i++) {
			const ki2 = 1 - i / (this.nbPixels-1);
			const ki1 = evaluateInverseFor(this.transform,ki2);
			const xi = min + ki1 * (max-min);
			context.fillStyle = this.getColor(xi);
			if (this.orientation === "horizontal") {
				context.fillRect(i+this.hBarMargin,0,1,20);
			} else {
				context.fillRect(0,i+this.vBarMargin,20,1);
			}
		}

		// add the bar on the whole length (base for ticks)
		context.fillStyle = "#777";
		if (this.orientation === "horizontal") {
			context.fillRect(this.hBarMargin,20,this.nbPixels,1);
			context.textAlign = "center";
		} else {
			context.fillRect(20,this.vBarMargin,1,this.nbPixels);
			context.textAlign = "left";
		}

		// draw the ticks and their labels
		for (const brk of this.breaks) {
			const ki1 = (brk-min) / (max-min);
			const ki2 = this.transform(ki1);
			const i = (1-ki2) * (this.nbPixels-1);
			if (this.orientation === "horizontal") {
				context.fillRect(i+this.hBarMargin,15,1,5);
				context.fillText(brk.toString(),i+this.hBarMargin,32);
			} else {
				context.fillRect(15,i+this.vBarMargin,5,1);
				context.fillText(brk.toString(),25,i+this.vBarMargin+4);
			}
		}
	}

	setTitle(newTitle: string) {
		const content = this.getContainer();
		if (content == null) {return this;}
		const h4elt = content.querySelector("h4");
		if (h4elt != null) {h4elt.innerHTML = newTitle;}
		return this;
	}

	getTitle(): string {
		return this.title;
	}
}


function evaluateInverseFor(fct: (x: number) => number, input: number): number {
	if (input === 0) {return 0;}
	if (input === 1) {return 1;}

	let min = 0;
	let max = 1;
	let current = 0.5;
	const nbIterations = 15;

	for (let i=0; i<nbIterations; i++) {
		current = 0.5 * (min+max);
		let fOfCurrent = fct(current);
		if (fOfCurrent < input) {
			min = current;
		}
		else {
			max = current;
		}
	}

	return current;
}

