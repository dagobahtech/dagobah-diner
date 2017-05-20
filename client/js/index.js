$(document).ready(function () {

    let currentPage;
    //pointer to the active link so we can disable it activate the new one
    let activeItem;

    const DASHBOARD = 0,
        MENU_DATATABLE = 1,
        CREATE_ITEMS = 2,
        SETTINGS = 3,
        STATISTICS = 4;

    //name mapping to html and js files
    const NAME_MAP = ['dashboard', 'menu-datatable', 'createItems', 'settings','statistics'];

    /*5 link
     * dashboard: admin-link
     * menu-datatable: admin-menu-link
     * statistics: admin-stat-link
     * createItem: admin-create-link
     * settings: admin-settings-link*/
    let adminLink= document.getElementById("admin-link");
    let adminMenuLink = document.getElementById("admin-menu-link");
    let adminStatLink = document.getElementById("admin-stat-link");
    let adminCreateLink = document.getElementById("admin-create-link");
    let adminSettingsLink = document.getElementById("admin-settings-link");

    //where components are going to be displayed
    let display = document.getElementById("display");

    //load page function
    function loadPage(pageIndex, elemThatFired) {
        //check if pageIndex is valid
        if(pageIndex < 0 || pageIndex >= NAME_MAP.length) {
            return false;
        }

        //don't do an ajax call if we're on the same page
        if(currentPage === pageIndex) {
            return false;
        }

        $.ajax({
            url: "/admin/page/"+NAME_MAP[pageIndex],
            type: "post",
            success: function (resp) {
                display.innerHTML = resp;
                let script = document.createElement("script");
                script.setAttribute("src", "/scripts/"+NAME_MAP[pageIndex]+".js");
                display.appendChild(script);
            }

        });

        (activeItem !== undefined) && activeItem.parentNode.classList.remove("active");
        elemThatFired.parentNode.classList.add("active");

        activeItem = elemThatFired;
        currentPage = pageIndex;

        //so the href won't trigger
        return false;
    }

    //set up event listeners for each nav link
    adminLink.addEventListener("click", (event)=> {return loadPage(DASHBOARD, event.target)});
    adminMenuLink.addEventListener("click", (event)=> {return loadPage(MENU_DATATABLE, event.target)});
    adminStatLink.addEventListener("click", (event)=> {return loadPage(STATISTICS, event.target)});
    adminCreateLink.addEventListener("click", (event)=> {return loadPage(CREATE_ITEMS, event.target)});
    adminSettingsLink.addEventListener("click", (event)=> {return loadPage(SETTINGS, event.target)});

    //load dashboard as default page
    loadPage(DASHBOARD, adminLink);

});