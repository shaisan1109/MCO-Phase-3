function profileTab(evt, showTab) {
	var i, navContent, navLinks;

	// Hide elements with class = "content"
	navContent = document.getElementsByClassName('folder-content');
	for(i = 0; i < navContent.length; i++) {
		navContent[i].style.display = "none";
	}

	// Without this, all contents show at once
	navLinks = document.getElementsByClassName('folder-tab');
	for(i = 0; i < navLinks.length; i++) {
		navLinks[i].className = navLinks[i].className.replace(" active", "");
	}

	document.getElementById(showTab).style.display = "block"; // Show current tab
	evt.currentTarget.className += " active"; // Button is active when content is shown (how this works is that it appends "active" in button tag)
}

document.getElementById("default-tab").click(); // "click" on one tab to open it upon starting the webpage