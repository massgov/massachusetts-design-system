//Accessible code from Alexa on the Access team
document.addEventListener('DOMContentLoaded', function() {
    const trigger = document.querySelector('.mds-state-banner__container');
    const triggerChevron = document.querySelector('.mds-state-banner__caret');

    if (!trigger || !triggerChevron) {
        return;
    }
    trigger.addEventListener('click', function() {
        const content = this.nextElementSibling; // Get the next sibling (the content div)
        
        if (content.style.display=="flex") {
        // Content is currently expanded, so collapse it
        
        content.style.display = "none";
        trigger.setAttribute("aria-expanded", "false");
        triggerChevron.classList.remove("mds-state-banner__caret--expanded");
        } else {
        // Content is currently collapsed, so expand it

        content.style.display = "flex"; // show the hidden content
        trigger.setAttribute("aria-expanded", "true");
        triggerChevron.classList.add("mds-state-banner__caret--expanded");
        } 
    });
});