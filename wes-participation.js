
function parseDataAndChart() {
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
        generatePSAChart(ministries);
      }
      
  });
  
  }

  function generatePSAChart(ministries) {
      var ctx = document.getElementById('wes-participation').getContext('2d');
      var psa = ministries[3]
      var labels = new Array();
      var data = new Array();

      labels.push('Overall Agency Response');
      labels.push('');

      data.push(ministries[3].percentage);
      data.push(0);

      psa.divisions.forEach(function(division){
          //convert labels based on names
          
          //division.title == 'Business Performance' ? labels.push('CORPORATE\nSERVICES +\nDM\'s OFFICE') : '' ;
          division.title == 'Policy, Innovation and Engagement' ? labels.push('PIE') : '';
          division.title == 'Labour and Employee Relations and Total Compensation' ? labels.push('Labour & ER and Compensation') : '';
          division.title == "Corporate Services and Deputy Minister's Office" ? labels.push('Corp. Services & DMO') : '';
          division.title == "Hiring and Service Operations" ? labels.push('Hiring & Service Ops.') : '';
          division.title == "People and Organizational Development" ? labels.push('People & Org. Dev.') : '';
          division.title == "Workplace Health and Safety" ? labels.push('Workplace H&S') : '';
          //labels.push(division.title);
          
      


          data.push(division.percentage)
      });

      var psadata = {
          labels: labels,
          datasets: [{
              backgroundColor: [
                  'rgba(31,87,146,1)',
                  'rgb(255,255,255, 0)',
                  'rgba(70, 34, 85, 1)',
                  'rgba(249, 42, 130, 1)',
                  'rgba(98, 168, 124, 1)',
                  'rgba(237, 123, 132, 1)',
                  'rgba(91, 192, 190, 1)',
                  'rgba(242, 129, 135, 1)',
              ],
              data: data,
          }]
      }






      var chart = new Chart(ctx, {
          type: 'bar',
          data: psadata,
          options: {
              textAlign: 'center',
              legend: {
                  display: false,
              },
              scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      callback: function (value, index, values) {
                          return value + ' %';
                      }
                  }
              }],
              
          }
      }
  });

  }

parseDataAndChart();
