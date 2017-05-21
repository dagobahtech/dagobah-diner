
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

    //initialize the data sets
    salesLineChartData = {};
    salesLineChart = initLineChartData(salesLineChartData, salesCanvasChart, "Total");

     //initialize order chart
    orderLineChartData = {};
    orderLineChart = initLineChartData(orderLineChartData, orderCanvasChart, "Count");

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
    let newDataSet = createLineDataSet(category, type, data, name);
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
function createLineDataSet(category, type, data, setName) {

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


