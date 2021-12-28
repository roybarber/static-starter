// NO JS Fallbacks for css
document.body.classList.add("js")

// Environmental
if(process.env.NODE_ENV === 'development'){
	require("./devonly/dev");
}

// Mobile menu
var openMenuButton = document.getElementById('openMobileMenu'),
	closeMenuButton = document.getElementById('closeMobileMenu'),
	mobileMenu = document.getElementById('mobileMenu')
openMenuButton.addEventListener('click', () => mobileMenu.classList.remove("hidden"))
closeMenuButton.addEventListener('click', () => mobileMenu.classList.add("hidden"))
