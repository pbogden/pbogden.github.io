
var file1 = 'data.json',
//    file2 = '../data/TwitterPerformance_FannieMae_June15May16.csv';
    file2 = 'TwforPhilip.csv';

var my1 = chart1(),
    my2 = chart3();

d3.queue()
    .defer(d3.json, file1)
    .defer(d3.csv,  file2)
    .await(ready);

function ready(error, json, csv) {
  if (error) throw error;

  my1(json);
  my2(csv);

  d3.selectAll('.bar')
      .on('mouseover', mousedover)
      .on('mouseout', mousedout)

  function mousedover(d, i) {
    console.log('source -- mousedover', d, i)
    my1.mousedover(d, i);
    my2.mousedover(d, i);
  }

  function mousedout(d, i) {
    console.log('source -- mousedout', d, i)
    my1.mousedout(d, i);
    my2.mousedout(d, i);
  }
}
