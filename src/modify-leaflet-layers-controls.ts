function insertAfter(newElement: HTMLElement, referenceElement: HTMLElement) {
	if (referenceElement.nextSibling) {
		referenceElement.parentElement?.insertBefore(newElement, referenceElement.nextSibling);
	} else {
		referenceElement.parentElement?.appendChild(newElement);
	}
}


export function transformOverlaysControlsIntoRadio(layersNames: string[], radioName: string, onClick: (text: string) => void) {
	const a = setInterval(() => {
		const overlaysControlElt = document.querySelector(".leaflet-control-layers-overlays");
		if (!overlaysControlElt) {return;}
		for (const span of overlaysControlElt.querySelectorAll("label span span")) {
			const spanText = span.textContent?.trim();
			if (spanText == null) {continue;}
			if (layersNames.includes(spanText)) {
				const input = span.previousElementSibling;
				input?.setAttribute("type","radio");
				input?.setAttribute("name",radioName);
				if (onClick != null) {input?.addEventListener("click", () => onClick(spanText));}
			}
		}
		clearInterval(a);
	},50);

	return a;
}


export function addSeparatorBefore(layerName: string) {
	const a = setInterval(() => {
		const overlaysControlElt = document.querySelector(".leaflet-control-layers-overlays");
		if (!overlaysControlElt) {return;}

		for (const span of overlaysControlElt.querySelectorAll("label span span")) {
			if (span.textContent?.trim() === layerName) {
				const sep = document.createElement("div");
				sep.classList.add("leaflet-control-layers-separator");
				const grandParent = span.parentElement?.parentElement;
				grandParent?.parentElement?.insertBefore(sep,grandParent);
			}
		}

		clearInterval(a);
	},50);

	return a;
}


export function addSeparatorAfter(layerName: string) {
	const a = setInterval(() => {
		const overlaysControlElt = document.querySelector(".leaflet-control-layers-overlays");
		if (!overlaysControlElt) {return;}
		
		for (const span of overlaysControlElt.querySelectorAll("label span span")) {
			if (span.textContent?.trim() === layerName) {
				const sep = document.createElement("div");
				sep.classList.add("leaflet-control-layers-separator");
				const grandParent = span.parentElement?.parentElement;
				if (grandParent != null) {insertAfter(sep, grandParent);}
			}
		}

		clearInterval(a);
	},50);

	return a;
}


export function addOverlayGroupLabelBefore(layerName: string, labelName: string) {
	const a = setInterval(() => {
		const overlaysControlElt = document.querySelector(".leaflet-control-layers-overlays");
		if (!overlaysControlElt) {return;}

		for (const span of overlaysControlElt.querySelectorAll("label span span")) {
			if (span.textContent?.trim() === layerName) {
				const labelElt = document.createElement("div");
				labelElt.classList.add("leaflet-control-layers-group-name");
				labelElt.innerText = labelName;
				const grandParent = span.parentElement?.parentElement;
				grandParent?.parentElement?.insertBefore(labelElt,grandParent);
			}
		}

		clearInterval(a);
	},50);

	return a;
}

