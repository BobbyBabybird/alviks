import {AnimateCurve} from "./ux/animate";
import {AnimateJumbotron} from "./ux/animate";
import {Navbar} from "./ux/navbar";
import "./custom/search";
import makeSliders from "./custom/slider";
import "./custom/menus";

// JS Goes here - ES6 supported
if (window.netlifyIdentity) {
	window.netlifyIdentity.on("init", user => {
		if (!user) {
		window.netlifyIdentity.on("login", () => {
			document.location.href = "/admin/";
		});
		}
	});
}

const animateCurve = new AnimateCurve();
const animateJumbotron = new AnimateJumbotron();
const navbar = new Navbar();

makeSliders();
