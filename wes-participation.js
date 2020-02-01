function generateMinistriesChart(ministries)
{
    xAxis = new Array();
    dataset = new Array();
    ministries.forEach(function(ministry){
        xAxis.push(ministry.title);
        dataset.push(ministry.percentage);
    });
    //We can adjust the scaling by adding a 0 value to the series to show 0-100
    //dataset.push(0);
    generateChartGraphic(xAxis, dataset);
};

function generatePSAChart(ministries)
{
    var psa = ministries[3] //MAGIC NUMBER, index of the PSA
    xAxis = new Array();
    dataset = new Array();
    psa.divisions.forEach(function(division){
        xAxis.push(division.title);
        dataset.push(division.percentage)
    });
    
    //We can adjust the scaling by adding a 0 value to the series to show 0-100
    //dataset.push(0);
    generateChartGraphic(xAxis, dataset);
}

function generateChartGraphic(xAxis, dataset) {
    var ctx = document.getElementById('wesChart').getContext('2d');
    var myChart = new Chart(document.getElementById("wesChart"), {
        type: 'horizontalBar',
        data: {
          labels: xAxis,
          datasets: [
            {
              label: "Participation (percentage)",

              backgroundColor: ["#966b9d", "#b6cB9e","#c98686","#f2b880", "#D1f0b1","#e7cfbc","#c45850", "#EF798A"],
              data: dataset
            }
          ]
        },
        options: {
          scales: {
              xAxes:{
                 offset: true, 
              }
          },
          responseive: true,  
          legend: { display: false },
          title: {
            display: true,
            text: 'Response rates for WES 2020'
          }
        }
    });
}

function parseData() {
//Load and parse CSV File
const wesdata = Papa.parse('https://bcpsa.gww.gov.bc.ca/sites/default/files/wes/responseRate.csv', {
    download: true,
    dynamicTyping: true,
    complete: function(results) {
      //Remove aggregate total
      results.data = results.data.reverse();
      var aggregateResponseRate = results.data.pop();
      results.data = results.data.reverse();

      //Segment data per ministry
      var ministries = new Array();
      var mindex = -1;
      var dindex = 0;

      results.data.forEach(function(row){
        var ministry = new Object();
        ministry.divisions = new Array();
        //Is this a ministry or division ?
        if (row[1] == null) { //it's a ministry
             ministry.title = row[0];
             ministry.respondents = row[2];
             ministry.population = row[3];
             ministry.percentage = row[4];
             mindex++;
             ministries[mindex] = ministry; 
             dindex = 0;
        } else { //it's a division
            var division = new Object;
            division.title = row[1];
            division.respondents = row[2];
            division.population = row[3];
            division.percentage = row[4];
            ministries[mindex].divisions[dindex] = division;
            dindex++;
        };
      });
      ministries.pop(); //Turf weird null ministry on list. 
      
      if (chartScope == 'psa') {
          generatePSAChart(ministries);
      } else {
          generateMinistriesChart(ministries)
      }
    }
    
});

}

parseData();