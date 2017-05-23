
//set up variables as pointers to elements
var showStatButton = document.getElementById("show-button");
var rbnButtonsSalesView = document.getElementsByName('salesView');
var yearChooserMonthly = document.getElementById("year-chooser-monthly");
var yearChooserWeekly = document.getElementById("year-chooser-weekly");
var currentRbnSelected;

/*SALES STAT CHART*/
var salesCanvasChart = document.getElementById("salesChart");
var salesLineChart;
var salesLineChartData;
var requestedSales = false; //when show stat button clicked
var requestedOrder = false; //when order stat buttons are clicked

/*ORDER STAT CHART*/
var orderCanvasChart = document.getElementById("orderChart");

var orderLineChart;
var orderLineChartData;

/*ITEM STAT CHART*/
var itemMainCanvasChart = document.getElementById("itemMainChart");
var itemSideCanvasChart = document.getElementById("itemSideChart");
var itemBeverageCanvasChart = document.getElementById("itemBeverageChart");

var itemMainBarChart;
var itemMainBarChartData;

var itemSideBarChart;
var itemSideBarChartData;

var itemBeverageBarChart;
var itemBeverageBarChartData;

var MONTHS = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September','October',
    'November', 'December'
];

var WEEKS_IN_YEAR = 52;
var CURRENT_YEAR = new Date().getFullYear();

var SALES = "sales";
var DISCARDS = "discards";

function executeScript() {
    //save the previous selected button so we can hide
    //its options
    //by default, select the first one
    currentRbnSelected = rbnButtonsSalesView[0];

    //add event listeners to radio buttons when selected
    //the view for the sales statistics
    for(let x = 0 ; x < rbnButtonsSalesView.length ; x++) {
        rbnButtonsSalesView[x].addEventListener("change", handleRadioButtonEventChange);
    }

    //create dyanmic options for year choosers
    populateYearOptions(yearChooserMonthly);
    populateYearOptions(yearChooserWeekly);

    //initialize the data sets
    salesLineChartData = {};
    salesLineChart = initLineChartData(salesLineChartData, salesCanvasChart, "Total");

     //initialize order chart
    orderLineChartData = {};
    orderLineChart = initLineChartData(orderLineChartData, orderCanvasChart, "Count");

    //initialize item chart
    //main items
    itemMainBarChartData = {};
    itemMainBarChart = initBarChartData(itemMainBarChartData, itemMainCanvasChart, "Quantity");

    itemSideBarChartData = {};
    itemSideBarChart = initBarChartData(itemSideBarChartData, itemSideCanvasChart, "Quantity");

    itemBeverageBarChartData = {};
    itemBeverageBarChart = initBarChartData(itemBeverageBarChartData, itemBeverageCanvasChart, "Quantity");
}

function populateYearOptions(selectObject) {

    let currentYear = parseInt(CURRENT_YEAR);
    let offset = 5; //from 5 years before

    for(let x = currentYear - offset ; x <= currentYear ; x++) {
        let selectItem = document.createElement("option");
        selectItem.value = x;
        selectItem.innerHTML = x;
        selectObject.appendChild(selectItem);
        if(x === currentYear) {
            selectObject.selectedIndex = offset;
        }
    }
}
function initLineChartData(chartData, canvas, yAxesLabel) {
    chartData.labels = [];
    chartData.datasets = [];

    var chart = new Chart(canvas, {
        type: "line",
        data: chartData,
        options: {
            legend: {
                display: true
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: yAxesLabel
                    }
                }]
            },
            responsive:true,
            maintainAspectRatio: true
        }
    });

    return chart;
}

function initBarChartData(chartData, canvas, yAxesLabel) {

    chartData.labels = [];
    chartData.datasets = [];

    var chart = new Chart(canvas, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: yAxesLabel
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false
                    }
                }]
            }
        }
    });

    return chart;
}
function handleRadioButtonEventChange(event) {
    let target = event.target;
    let sibling = target.nextElementSibling;

    //if it has a sibling, which is the options div
    if(sibling) {
        if(target.checked) {
            sibling.style.display = "inline-block";
        } else {
            sibling.style.display = "none";
        }
    }

    //hide the sibling of the previous selected
    //radio button, if it has one
    if(currentRbnSelected && currentRbnSelected.nextElementSibling) {
        currentRbnSelected.nextElementSibling.style.display = "none"
    }

    currentRbnSelected = target;
}

showStatButton.addEventListener("click", function (event) {
    //prevRbnSelected currently points to the
    //current selected radio button
    switch(currentRbnSelected.value) {
        case 'yearly':
            requestedSales = true;
            sendRequestForStatData(currentRbnSelected.value, SALES);
            sendRequestForStatData(currentRbnSelected.value, DISCARDS);
            break;
        case 'monthly':
            console.log(typeof(yearChooserMonthly.value));
            if(yearChooserMonthly.value === "") {
                //show modal
                showModal("Error", "Please select a valid year");
                return false;
            }
            requestedSales = true;
            sendRequestForStatData(currentRbnSelected.value, SALES, yearChooserMonthly.value);
            sendRequestForStatData(currentRbnSelected.value, DISCARDS, yearChooserMonthly.value);

            break;
        case 'weekly':

            if(yearChooserWeekly.value === "") {
                showModal("Error", "Please select a month");
                return false;
            }
            requestedSales = true;
            sendRequestForStatData(currentRbnSelected.value, SALES, yearChooserWeekly.value);
            sendRequestForStatData(currentRbnSelected.value, DISCARDS, yearChooserWeekly.value);

            break;
    }

});

function sendRequestForStatData(category, type, year) {

    $.ajax({
        url: "/admin/getStatData",
        type: "post",
        data: {
            category: category,
            year: year,
            type: type
        },
        success: function (resp) {
            console.log(resp.data);

            if(resp.status === "success") {

                if(requestedSales) {
                    clear(salesLineChart,salesLineChartData);
                    requestedSales = false;
                }
                setData(salesLineChart, salesLineChartData, resp.category, resp.data, resp.type, resp.type);
            } else {
                //do error handling here
                console.log("something went wrong");
            }
        }
    })
}
//clear the chart so we could
//draw another one

function clear(chart, chartData) {
    chartData.labels = [];
    chartData.datasets = [];
    //chart.update();
}

function setLabels(chartData, labels){
    console.log("labels",labels);
    chartData.labels = [...labels];
}

function addDataSet(chart, chartData, dataset) {
    chartData.datasets.push(dataset);

    console.log("pushing datasets", dataset);
    console.log(chart);
    chart.update();
}

function setData(chart, chartData, category, data, type, name) {

    //destroy the chart if it exists

    //create data set object that can be used for the chart
    //let newData = new SalesBarDataSet(category, data, "Sales");
    let newDataSet = createDataSet(category, type, data, name);
    if(chartData.labels.length === 0) {
        console.log("set new labels", newDataSet.labels);
        setLabels(chartData, newDataSet.labels)
    }

    addDataSet(chart, chartData, newDataSet.dataset);
}

//function that creates line dataset
//type is either discard or sale
//discard is red, sale is blue
//data is coming from the server
function createDataSet(category, type, data, setName) {

    let dataSetInfo = new SalesBarDataSet(category, data, setName);

    let color = {
        background: "rgba(0,0,0,0)",
        border: "rgba(0,0,0,0)"
    }

    if(type === SALES) {
        color.background = "rgba(2,117,216,0.2)";
        color.border = "rgba(2,117,216,1)";
    } else if(type === DISCARDS) {
        color.background = 'rgba(255, 99, 132, 0.2)';
        color.border = 'rgba(255, 99, 132, 1)';
    } else {
        return;
    }

     return {
         dataset: {
             label: dataSetInfo.property.dataSetName,
             lineTension: 0.3,
             backgroundColor: color.background,
             borderColor: color.border,
             pointRadius: 5,
             pointBackgroundColor: color.border,
             pointBorderColor: "rgba(255,255,255,0.8)",
             pointHoverRadius: 5,
             pointHoverBackgroundColor: color.border,
             pointHitRadius: 20,
             pointBorderWidth: 2,
             data: dataSetInfo.property.data
         },
         labels: dataSetInfo.property.labels
     }
}

/*SALES STATISTICS*/
//function that creates an object that can be used
//by the chart
function SalesBarDataSet(type, data, setName) {

    this.property = {
        labels: [], //x axis labels/category
        data: [], //data for each category
        dataSetName: setName //name of the data set
    };

    if(type==="yearly") {
        dataSetYearly(this.property, data);
    } else if(type ==="monthly") {
        dataSetMonthly(this.property, data);
    } else if(type === "weekly") {
        dataSetWeekly(this.property, data);
    }
    console.log(this.property)
}

//call this when type is yearly
function dataSetYearly(property, data) {

    //populate data
    for(let x = 0 ; x < data.length ; x++) {
        property.labels.push(data[x].category);
        property.data.push(data[x].value);
    }
}

//use this when type is monthly
function dataSetMonthly(property, data) {
    //populate data
    for(let x = 0 ; x < MONTHS.length ; x++) {
        property.labels.push(MONTHS[x]);
        property.data.push(0);
    }

    for(let x = 0 ; x < data.length ; x++) {
        property.data[data[x].category-1] = data[x].value;
    }
}

function dataSetWeekly(property, data) {

    for(let x = 0 ; x < WEEKS_IN_YEAR ; x++) {
        property.labels.push("Week "+ (x+1));
        property.data.push(0);
    }
    console.log("data", data);
    for(let x = 0 ; x < data.length ; x++){
        property.data[data[x].category - 1] = data[x].value;
    }
}

/*ORDER STATISTICS*/
var totalOrderBtn = document.getElementById("totalOrder");
var avgOrderBtn = document.getElementById("avgOrder");
var totalDiscardsBtn = document.getElementById("totalDiscards");

totalOrderBtn.addEventListener("click", function (event) {
    requestedOrder = true;
    requestOrderStatForYear(CURRENT_YEAR);
});

avgOrderBtn.addEventListener("click", function (event) {
    requestedOrder = true;
    requestOrderAvgStatForYear(CURRENT_YEAR);
});

totalDiscardsBtn.addEventListener("click", function (event) {

    requestedOrder = true;
    requestDiscardStatForYear(CURRENT_YEAR);
});

function requestOrderStatForYear(year) {
    $.ajax({
        url: "/admin/getOrderStat",
        type: "post",
        data: {
            year: year
        },
        success: function (resp) {

            if(resp.status === "success") {
                if(requestedOrder) {
                    clear(orderLineChart, orderLineChartData);
                    requestedOrder = false;
                }
                setData(orderLineChart, orderLineChartData, "monthly", resp.data, SALES, "Number of Orders");
            } else {
                //do some error handling here
            }
        }
    })
}

function requestOrderAvgStatForYear(year) {
    $.ajax({
        url: "/admin/getOrderAvgStat",
        type: "post",
        data: {
            year: year
        },
        success: function (resp) {
            if(resp.status === "success") {

                if(requestedOrder) {
                    clear(orderLineChart, orderLineChartData);
                    requestedOrder = false;
                }
                setData(orderLineChart, orderLineChartData, "monthly", resp.data, SALES, "Avg Item Per Order");
            }
        }
    });
}

function requestDiscardStatForYear(year) {
    $.ajax({
        url: "/admin/getDiscardStat",
        type: "post",
        data: {
            year: year
        },
        success: function (resp) {
            if(resp.status === "success") {

                if(requestedOrder) {
                    clear(orderLineChart, orderLineChartData);
                    requestedOrder = false;
                }
                setData(orderLineChart, orderLineChartData, "weekly", resp.data, DISCARDS, "Total Discards");
            }
        }
    });
}

/* ITEM STATISTICS */
var itemStatDropDown = document.getElementById("item-stat-month");
var itemStatLinks = itemStatDropDown.children;
var selectedItemView = document.getElementById("selected-item-view");
var viewAllButton = document.getElementById("item-view-all");
var categoryNavigation = document.getElementById("categoryNav");
var categoryNavLinks = categoryNavigation.children;

//category displays
var mainItemStat = document.getElementById("mainItemStat");
var sideItemStat = document.getElementById("sideItemStat");
var bevItemStat = document.getElementById("bevItemStat");

selectedItemView.value = "None. Select View";

var currentCategory = mainItemStat;
var currentCategoryLink = categoryNavLinks[0]; //first one default one

//set each stat link value/ numeric month equiv
for (let x = 0 ; x < itemStatLinks.length; x++) {
    itemStatLinks[x].month = x+1;

    itemStatLinks[x].addEventListener("click", function (event) {
        selectedItemView.value = MONTHS[this.month-1];
        getItemStatMonth(CURRENT_YEAR, this.month, 1, itemMainBarChart, itemMainBarChartData);
        getItemStatMonth(CURRENT_YEAR, this.month, 2, itemSideBarChart, itemSideBarChartData);
        getItemStatMonth(CURRENT_YEAR, this.month, 3, itemBeverageBarChart, itemBeverageBarChartData);
    });
}

//set event listeners for category navigations
for (let x = 0 ; x < categoryNavLinks.length ; x++) {
    categoryNavLinks[x].children[0].addEventListener("click", _handleCategoryNavigation);
}

viewAllButton.addEventListener("click", function (event) {
    getItemStatAll(CURRENT_YEAR, 1, itemMainBarChart, itemMainBarChartData);
    getItemStatAll(CURRENT_YEAR, 2, itemSideBarChart, itemSideBarChartData);
    getItemStatAll(CURRENT_YEAR, 3, itemBeverageBarChart, itemBeverageBarChartData);
    selectedItemView.value = "All for " + CURRENT_YEAR;
});

function _handleCategoryNavigation(event) {
    console.log("hello");

    if(event.target === currentCategoryLink) {
        return false;
    }

    currentCategory.style.display = "none";

    if(event.target === categoryNavLinks[0].children[0]) {
        currentCategory = mainItemStat;
    } else if(event.target === categoryNavLinks[1].children[0]) {
        currentCategory = sideItemStat;
    } else if(event.target === categoryNavLinks[2].children[0]) {
        currentCategory = bevItemStat;
    } else {
        return;
    }

    currentCategory.style.display = "block";
}

function getItemStatAll(year, category, chart, chartData) {
    $.ajax({
        url: "/admin/getItemStatAll",
        type: "post",
        data: {
            year: year,
            category: category
        },
        success: function (resp) {
            if(resp.status === "success") {

                clear(chart, chartData);
                //use yearly category because it uses the default category
                //values resulted from the query
                setData(chart, chartData, "yearly", resp.data, SALES, "Quantity sold")
            } else {
                //handle error handling here
                //use modals if we can
            }
        }
    })
}

function getItemStatMonth(year, month, category, chart, chartData) {
    $.ajax({
        url: "/admin/getItemStatForMonth",
        type: "post",
        data: {
            year: year,
            month: month,
            category: category
        },
        success: function (resp) {
            if(resp.status === "success") {

                clear(chart, chartData);
                //use yearly category because it uses the default category
                //values resulted from the query
                setData(chart, chartData, "yearly", resp.data, SALES, "Quantity sold")
            } else {
                //handle error handling here
                //use modals if we can
            }
        }
    })
}

executeScript();

/* DIV SWITCHING HERE*/
var salesDiv = document.getElementById("sales");
var orderDiv = document.getElementById("order");
var itemDiv = document.getElementById("item");

var salesLink = document.getElementById("salesLink");
var orderLink = document.getElementById("orderLink");
var itemLink = document.getElementById("itemLink");

//default selected are sales link and sales div
var currentLink = salesLink;
var currentDisplay = salesDiv;

salesLink.addEventListener("click", _handleStatLinkClicked);
orderLink.addEventListener("click", _handleStatLinkClicked);
itemLink.addEventListener("click", _handleStatLinkClicked);

function _handleStatLinkClicked(event) {

    if(currentLink === event.target) {
        return;
    }

    currentLink.parentNode.classList.remove("active");
    currentDisplay.style.display = "none";

    currentLink = event.target;

    if(currentLink === salesLink) {
        currentDisplay = salesDiv;
    } else if(currentLink === orderLink) {
        currentDisplay = orderDiv;
    } else if(currentLink === itemLink) {
        currentDisplay = itemDiv;
    }

    currentLink.parentNode.classList.add("active");
    currentDisplay.style.display = "block";
}


