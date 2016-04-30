function stackedGraphChart() {
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 1350 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;
    
    var timeFormat = d3.time.format('%Y-%m-%d');
    
    var xScale = d3.time.scale();
    
    var yScale = d3.scale.linear();
    
    var colorScale = d3.scale.category20c();
    
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .ticks(d3.time.years);
    
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');
    
    var stack = d3.layout.stack()
        .offset('zero')
        .order('reverse')
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date; })
        .y(function(d) { return d.value; });
    
    var nest = d3.nest()
        .key(function(d) { return d.genre; });
    
    var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { 
            return xScale(d.date); })
        .y0(function(d) { 
            return yScale(d.y0); 
        })
        .y1(function(d) { 
            return yScale(d.y0 + d.y); });
    
    function chart(selection) {
        selection.each(function(data) {
            var layers = stack(nest.entries(data));
            
            xScale.domain(d3.extent(data, function(d) { return d.date; }))
                .range([0, width]);
            yScale.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })])
                .range([height, 0]);

            var svg = d3.select(this).selectAll('svg')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            
            svg.selectAll('.layer')
                .data(layers)
                .enter()
                .append('path')
                .attr('class', 'layer')
                .attr('d', function(d) { return area(d.values); })
                .style('fill', function(d, i) { return z(i); })
                .attr('id', function(d) {
                    return d.key;
                })
                .on('mouseover', function(d, i) {
                    $('#genre').text(d.key);
                    d3.select(this).style('opacity', 0.5);
                ; })
                .on('mouseout', function(d, i) { 
                    $('#genre').text('Select a genre!');
                    d3.select(this).style('opacity', 1);
                });
            
            svg.append('g')
                .attr('class', 'x axis')
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);  
        });
        
        
        
        
    }
    
      // The x-accessor for the path generator; xScale ∘ xValue.
    function x(d) {
        return xScale(d.date);
    }

    // The x-accessor for the path generator; yScale ∘ yValue.
    function y(d) {
        return yScale(d.value);
    }

    chart.margin = function(v) {
        if (!arguments.length) return margin;
        margin = v;
    return chart;
    };

    chart.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return chart;
    };

    chart.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return chart;
    };

    chart.x = function(v) {
        if (!arguments.length) return xValue;
        xValue = v;
        return chart;
    };

    chart.y = function(v) {
        if (!arguments.length) return yValue;
        yValue = v;
        return chart;
    };
    
    return chart;
}