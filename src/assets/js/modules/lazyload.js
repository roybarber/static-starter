import lozad from "lozad";

const observerImages = lozad("[data-lazyload]", {
	loaded: function (el) {
		el.classList.add("loaded");
	},
});
observerImages.observe();
