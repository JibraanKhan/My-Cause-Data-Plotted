var rowConverter = function(data){
  return {
    Rank: parseInt(data.Rank),
    Name: data.Name,
    Global_Sales: data.Global_Sales
  }
}
var csvData = d3.csv('vgsales.csv', rowConverter);

csvData.then(function(gamedata){
  var w = 1500;
  var h = 800;
  var padding = 15;
  var quantifier = 6;
  var svg = d3.select('body').append('svg')
                             .attr('width', w)
                             .attr('height', h);

  var ScaleR = d3.scaleSqrt()
                 .domain([0, d3.max(gamedata, function(d){ return d.Rank; })])
                 .range([20, 30]);

  var ScaleX = d3.scaleLinear()
                 .domain([0, d3.max(gamedata, function(d){ return d.Rank; })])
                 .range([padding + d3.max(gamedata, function(d){ return ScaleR(d.Rank); }), (w - padding * quantifier) - d3.max(gamedata, function(d){ return ScaleR(d.Rank); })]);

  var ScaleY = d3.scaleLinear()
                 .domain([0, d3.max(gamedata, function(d){ return d.Global_Sales; })])
                 .range([(h - padding * quantifier) - d3.max(gamedata, function(d){ return ScaleR(d.Rank); }), (padding * quantifier) + d3.max(gamedata, function(d){ return ScaleR(d.Rank); })]);

  var ScaleColor = d3.scaleLinear()
                 .domain([0, d3.max(gamedata, function(d){ return d.Rank; })])
                 .range([255, 20]);

  var ScaleColor_Reverse = d3.scaleLinear()
                     .domain([0, d3.max(gamedata, function(d){ return d.Rank; })])
                     .range([20, 255]);

  var ScaleFont = d3.scaleLinear()
                    .domain([d3.min(gamedata, function(d){ return d.Name.length; }), d3.max(gamedata, function(d){ return d.Name.length; })])
                    .range([7, 4]);

  var xAxis = d3.axisBottom(ScaleX)
                .ticks(d3.max(gamedata, function(d){ return d.Rank; }))

  var yAxis = d3.axisRight(ScaleY)
                .ticks(5);

  svg.selectAll('circle')
    .data(gamedata)
    .enter()
    .append('circle')
    .attr('cx', function(d){
      return ScaleX(d.Rank);
    })
    .attr('cy', function(d){
      return ScaleY(d.Global_Sales);
    })
    .attr('r', function(d){
      return ScaleR(d.Rank);
    })
    .style('fill', function(d){
      return 'rgb(0,' + ScaleColor(d.Rank) + ', 0)';
    });


 svg.selectAll('text')
    .data(gamedata)
    .enter()
    .append('text')
    .attr('x', function(d){
      return ScaleX(d.Rank);
    })
    .attr('y', function(d){
      return ScaleY(d.Global_Sales);
    })
    .text(function(d){
      return d.Name;
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', function(d){
      console.log(ScaleFont(d.Name.length));
      return ScaleFont(d.Name.length);
    })
    .style('stroke', function(d){
      return 'rgb(' + ScaleColor_Reverse(d.Rank) + ', 0, 0)'
    })
    .style('fill', function(d){
      return 'rgb(' + ScaleColor_Reverse(d.Rank) + ', 0, 0)'
    })
    .style('font-family', 'sans-serif');

  svg.append('g')
     .attr('class', 'axis')
     .attr('transform', 'translate(0,' + (padding + 15) + ')')
     .call(xAxis);

  svg.append('g')
     .attr('class', 'axis')
     .attr('transform', 'translate(0,' + (padding) + ')')
     .call(yAxis);

  svg.append('text')
     .attr('x', w/2)
     .attr('y', padding + 10)
     .text('Rank')
     .style('font-size', '24px')
     .attr('stroke', 'violet')
     .attr('fill', 'purple');

  svg.append('text')
     .attr('x', 0)
     .attr('y', padding + 100)
     .text('Global Sales')
     .style('font-size', '16px')
     .attr('stroke', 'violet')
     .attr('fill', 'purple');

}, function(error){
  console.log(error);
})
