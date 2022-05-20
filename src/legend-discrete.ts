import L from "leaflet";

type Props = {
	title: string;
	items: Item[];
	options?: L.ControlOptions;
}

type Item = {
	name: string;
	color?: string;
	icon?: string;
};


export default class DiscreteLegend extends L.Control {
	title: string;
	items: Item[];

	constructor(props: Props) {
		super(props.options)
		this.title = (props.title != null ? props.title : "Title");
		this.items = (props.items != null ? props.items : []);
	}

	onAdd(map: L.Map): HTMLElement {
		const legendContent = L.DomUtil.create("div", "leaflet-legend-discrete");

		const titleElt = L.DomUtil.create("h4");
		titleElt.innerHTML = this.title;
		legendContent.appendChild(titleElt);

		const itemsElt = L.DomUtil.create("div","leaflet-legend-discrete-items");
		this.items.forEach(item => {
			const itemElt = L.DomUtil.create("div","leaflet-legend-discrete-item");
			if (item.color != null && item.icon != null) {itemElt.innerHTML = `<i style="background-color: ${item.color}"><img src="${item.icon}"></img></i><span>${item.name}</span>`;}
			else if (item.icon != null) {itemElt.innerHTML = `<img src="${item.icon}"></img><span>${item.name}</span>`;}
			else if (item.color != null) {itemElt.innerHTML = `<i style="background-color: ${item.color}"></i><span>${item.name}</span>`;}
			itemsElt.appendChild(itemElt);
		});
		legendContent.appendChild(itemsElt);
		return legendContent;
	}

	onRemove(): void {}

	setTitle(newTitle: string) {
		const content = this.getContainer();
		if (content == null) {return this;}
		const h4elt = content.querySelector("h4");
		if (h4elt != null ) {h4elt.innerHTML = newTitle;}
		return this;
	}

	getTitle(): string {
		return this.title;
	}

	setItems(newItems: Item[]) {
		const content = this.getContainer();
		if (content == null) {return this;}

		const itemsElt = document.querySelector(".leaflet-legend-discrete-items");
		if (itemsElt == null) {return this;}
		while (itemsElt.lastChild) {itemsElt.removeChild(itemsElt.lastChild);}

		this.items = newItems;
		for (const item of this.items) {
			const itemElt = L.DomUtil.create("div","leaflet-legend-discrete-item");
			if (item.color != null && item.icon != null) {itemElt.innerHTML = `<i style="background-color: ${item.color}"><img src="${item.icon}"></img></i><span>${item.name}</span>`;}
			else if (item.icon != null) {itemElt.innerHTML = `<img src="${item.icon}"></img><span>${item.name}</span>`;}
			else if (item.color != null) {itemElt.innerHTML = `<i style="background-color: ${item.color}"></i><span>${item.name}</span>`;}
			itemsElt.appendChild(itemElt);
		}
		return this;
	}

	getItems(): Item[] {
		return this.items;
	}
};

