$(function() {
    var dataDirectory = '/data/test.csv'
    
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 1350 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

    var timeFormat = d3.time.format('%Y-%m-%d');
    
    var x = d3.time.scale()
        .range([0, width]);
    
    var y = d3.scale.linear()
        .range([height, 0]);
    
    var z = d3.scale.category20c();
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(d3.time.months);
    
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');
    
    var stack = d3.layout.stack()
        .offset('zero')
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date; })
        .y(function(d) { return d.value; });
    
    var nest = d3.nest()
        .key(function(d) { return d.genre; });
    
    var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { 
            console.log('x works');
            return x(d.date); })
        .y0(function(d) { 
            console.log('hi');
            return y(d.y0); 
        })
        .y(function(d) { 
            console.log('y works');
            return y(d.y0 + d.y); });
    
    var svg = d3.select('body').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.csv(dataDirectory, function(error, data) {
        if (error) throw error;

        data.forEach(function(d) {
            d.date = timeFormat.parse(d.date);
            d.value = +d.value;
        });
        
        var layers = stack(nest.entries(data));
        
        // console.log('layers: ');
        // console.log(layers);
        
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

        svg.selectAll('.layer')
            .data(layers)
            .enter()
            .append('path')
            .attr('class', 'layer')
            .attr('d', function(d) { return area(d.values); })
            .style('fill', function(d, i) { return z(i); })
            .text(function(d) { return d.genre; });

        svg.append('g')
            .attr('class', 'x axis')
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    });
    

});