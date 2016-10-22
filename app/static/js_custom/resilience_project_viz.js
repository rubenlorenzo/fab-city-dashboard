function resilience_project_viz(id) {
    // Load both regions and countries
    d3.queue()
        .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/city_gdp.csv")
        .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/city_pop.csv")
        .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/city_surf.csv")
        .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/region_gdp.csv")
        .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/region_pop.csv")
        .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/region_surf.csv")
        .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/country_gdp.csv")
        .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/country_pop.csv")
        .defer(d3.csv, "../../../static/data_custom/json_stats/WB/country_surf.csv")
        .await(function(error, city_gdp, city_pop, city_surf, region_gdp, region_pop, region_surf, country_gdp, country_pop, country_surf) {
            if (error) {
                console.error('An error loading data: ' + error);
            } else {

                // Colors for the resilience metrics
                var resilience_colors = {
                    "Housing": "#16785D",
                    "Income": "#22357C",
                    "Jobs": "#1A5774",
                    "Community": "#67A61E",
                    "Environment": "#1A9022",
                    "Education": "#551C7B",
                    "Civic engagement": "#7A1676",
                    "Work life balance": "#A81E3E",
                    "Life satisfaction": "#E62339",
                    "Safety": "#B78621",
                    "Health": "#B74021",
                    "Accessibility to services": "#B7B721"
                };

                var gdp = [{
                    "City GDP": city_gdp[69]["2012"]
                }, {
                    "Region GDP": region_gdp[848]["2012"]
                }, {
                    "Country GDP": country_gdp[24]["2015"]
                }];
                var pop = [{
                    "City population": city_pop[69]["2014"]
                }, {
                    "Region population": region_pop[1495]["2014"]
                }, {
                    "Country population": country_pop[28]["2011"]
                }];
                var surf = [{
                    "City surface": city_surf[69]["2014"]
                }, {
                    "Region surface": region_surf[1457]["2014"]
                }, {
                    "Country surface": country_surf[178]["2015"]
                }];

                // variables
                var zerox = 0;
                var zeroy = 5;
                var zeroy2 = 10;
                var width = 300;
                var barHeight = 13;
                var space_between_bars = barHeight * 2;
                var space_between_groups = 20;
                var legend_width = 120;

                // Linear scale for gdp
                var gdpScale = d3.scaleLinear()
                    .domain([0, country_gdp[24]["2015"]])
                    .range([0, width]);

                var popScale = d3.scaleLinear()
                    .domain([0, country_pop[28]["2011"]])
                    .range([0, width]);

                var surfScale = d3.scaleLinear()
                    .domain([0, country_surf[178]["2015"]])
                    .range([0, width]);

                // Access svg area
                var svg = d3.select(id)
                    .append("svg")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 600 200")
                    .classed("svg-content", true);

                // Rounded bars
                var gdp_g = svg.append("g");
                var pop_g = svg.append("g");
                var surf_g = svg.append("g");

                var barg = gdp_g.selectAll("g")
                    .data(gdp)
                    .enter()
                    .append("g")
                    .attr("transform", "translate(0, " + zeroy + ")");

                var barp = pop_g.selectAll("g")
                    .data(pop)
                    .enter()
                    .append("g")
                    .attr("transform", "translate(0, " + (zeroy + 60) + ")");

                var bars = surf_g.selectAll("g")
                    .data(surf)
                    .enter()
                    .append("g")
                    .attr("transform", "translate(0, " + (zeroy + 120) + ")");

                // Scale line: gdp
                barg.append("line")
                    .style("stroke", "#b3b3b3")
                    .attr("x1", zerox + legend_width)
                    .attr("y1", function(d, i) {
                        return zeroy + i * barHeight;
                    })
                    .attr("x2", zerox + legend_width + width)
                    .attr("y2", function(d, i) {
                        return zeroy + i * barHeight;
                    });

                // The legend labels: gdp
                barg.append("text")
                    .attr("x", zerox)
                    .attr("y", function(d, i) {
                        return zeroy + i * barHeight;
                    })
                    .attr("dy", ".35em")
                    .text(function(d) {
                        for (property in d) {
                            var label_text = property;
                        }
                        return label_text + " ";
                    });

                // The value labels: gdp
                barg.append("text")
                    .attr("class", function(d) {
                        for (property in d) {
                            var the_class = property;
                        }
                        return "city " + property.toLowerCase() + " value";
                    })
                    .text(function(d) {
                        for (property in d) {
                            var label_value = d[property];
                        }
                        return Intl.NumberFormat().format(Math.round(label_value * 10) / 10) + " $ (millions)";
                    })
                    .attr("x", zerox + legend_width + width + zerox + zeroy2)
                    .attr("y", function(d, i) {
                        return zeroy + i * barHeight + 6;
                    });

                // The bars: gdp
                barg.append("rect")
                    .style("opacity", 0.4)
                    .attr("class", function(d) {
                        for (property in d) {
                            var the_class = property;
                        }
                        return "city " + property.toLowerCase() + " bar";
                    })
                    .attr("x", zerox + legend_width)
                    .attr("y", function(d, i) {
                        return zeroy - barHeight / 2 + i * barHeight;
                    })
                    .attr("width", function(d) {
                        for (property in d) {
                            return gdpScale(d[property]);
                        }
                    })
                    .attr("height", barHeight)
                    .attr("rx", 6)
                    .attr("ry", 6)
                    .attr("fill", "#000");


                // Population

                // Scale line
                barp.append("line")
                    .style("stroke", "#b3b3b3")
                    .attr("x1", zerox + legend_width)
                    .attr("y1", function(d, i) {
                        return zeroy + i * barHeight;
                    })
                    .attr("x2", zerox + legend_width + width)
                    .attr("y2", function(d, i) {
                        return zeroy + i * barHeight;
                    });

                // The legend labels
                barp.append("text")
                    .attr("x", zerox)
                    .attr("y", function(d, i) {
                        return zeroy + i * barHeight;
                    })
                    .attr("dy", ".35em")
                    .text(function(d) {
                        for (property in d) {
                            var label_text = property;
                        }
                        return label_text + " ";
                    });

                // The value labels
                barp.append("text")
                    .attr("class", function(d) {
                        for (property in d) {
                            var the_class = property;
                        }
                        return "city " + property.toLowerCase() + " value";
                    })
                    .text(function(d) {
                        for (property in d) {
                            var label_value = d[property];
                        }
                        return Intl.NumberFormat().format(Math.round(label_value * 10) / 10) + " persons";
                    })
                    .attr("x", zerox + legend_width + width + zerox + zeroy2)
                    .attr("y", function(d, i) {
                        return zeroy + i * barHeight + 6;
                    });

                // The bars
                barp.append("rect")
                    .style("opacity", 0.4)
                    .attr("class", function(d) {
                        for (property in d) {
                            var the_class = property;
                        }
                        return "city " + property.toLowerCase() + " bar";
                    })
                    .attr("x", zerox + legend_width)
                    .attr("y", function(d, i) {
                        return zeroy - barHeight / 2 + i * barHeight;
                    })
                    .attr("width", function(d) {
                        for (property in d) {
                            return popScale(d[property]);
                        }
                    })
                    .attr("height", barHeight)
                    .attr("rx", 6)
                    .attr("ry", 6)
                    .attr("fill", "#000");

                // Surface

                // Scale line
                bars.append("line")
                    .style("stroke", "#b3b3b3")
                    .attr("x1", zerox + legend_width)
                    .attr("y1", function(d, i) {
                        return zeroy + i * barHeight;
                    })
                    .attr("x2", zerox + legend_width + width)
                    .attr("y2", function(d, i) {
                        return zeroy + i * barHeight;
                    });

                // The legend labels
                bars.append("text")
                    .attr("x", zerox)
                    .attr("y", function(d, i) {
                        return zeroy + i * barHeight;
                    })
                    .attr("dy", ".35em")
                    .text(function(d) {
                        for (property in d) {
                            var label_text = property;
                        }
                        return label_text + " ";
                    });

                // The value labels
                bars.append("text")
                    .attr("class", function(d) {
                        for (property in d) {
                            var the_class = property;
                        }
                        return "city " + property.toLowerCase() + " value";
                    })
                    .text(function(d) {
                        for (property in d) {
                            var label_value = d[property];
                        }
                        return Intl.NumberFormat().format(Math.round(label_value * 10) / 10) + " Km2";
                    })
                    .attr("x", zerox + legend_width + width + zerox + zeroy2)
                    .attr("y", function(d, i) {
                        return zeroy + i * barHeight + 6;
                    });

                // The bars
                bars.append("rect")
                    .style("opacity", 0.4)
                    .attr("class", function(d) {
                        for (property in d) {
                            var the_class = property;
                        }
                        return "city " + property.toLowerCase() + " bar";
                    })
                    .attr("x", zerox + legend_width)
                    .attr("y", function(d, i) {
                        return zeroy - barHeight / 2 + i * barHeight;
                    })
                    .attr("width", function(d) {
                        for (property in d) {
                            return surfScale(d[property]);
                        }
                    })
                    .attr("height", barHeight)
                    .attr("rx", 6)
                    .attr("ry", 6)
                    .attr("fill", "#000");

            }
        });
}

// Slider
// Adapted from https://bl.ocks.org/mbostock/6452972

// Load both regions and countries
d3.queue()
    .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/national.csv")
    .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/regional.csv")
    .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/city_gdp.csv")
    .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/city_pop.csv")
    .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/city_surf.csv")
    .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/region_gdp.csv")
    .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/region_pop.csv")
    .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/region_surf.csv")
    .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/country_gdp.csv")
    .defer(d3.csv, "../../../static/data_custom/json_stats/OECD/country_pop.csv")
    .defer(d3.csv, "../../../static/data_custom/json_stats/WB/country_surf.csv")
    .await(function(error, countries_wellbeing, regions_wellbeing, city_gdp, city_pop, city_surf, region_gdp, region_pop, region_surf, country_gdp, country_pop, country_surf) {
        if (error) {
            console.error('An error loading data: ' + error);
        } else {


            // Calculate ratio base on GDP / Population
            ratio1 = city_gdp[69]["2012"] / region_gdp[848]["2012"];
            ratio2 = city_pop[69]["2014"] / region_pop[1495]["2014"];
            cire_ratio = (ratio1 + ratio2) / 2;

            // Clean data
            var region_array = [];
            for (var property in regions_wellbeing[283]) {
                if (property != "Region" && property != "Region Code" && property != "Country") {
                    //region_object[property] = parseFloat(region_data[property]);
                    test = {}
                    test[property] = parseFloat(regions_wellbeing[283][property]);
                    region_array.push(test);
                }
            }

            var country_array = [];
            for (var property in countries_wellbeing[28]) {
                if (property != "Country") {
                    //region_object[property] = parseFloat(region_data[property]);
                    test = {}
                    test[property] = parseFloat(countries_wellbeing[28][property]);
                    country_array.push(test);
                }
            }

            // Calculte the city resilience, in our way
            var city_array = JSON.parse(JSON.stringify(region_array));
            for (property in region_array) {
                //city_array[property] = region_array[property];
                for (subproperty in city_array[property]) {
                    city_array[property][subproperty] = city_array[property][subproperty] * cire_ratio;
                }
            }
            var city_wellbeing = {};
            for (property in city_array) {
                //city_array[property] = region_array[property];
                for (subproperty in city_array[property]) {
                    city_wellbeing[subproperty] = city_array[property][subproperty];
                }
            }

            var width = 300;
            var zerox = 10;
            var zeroy = 10;

            var x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, width])
                .clamp(true);

            // Linear scale for scaling the graph
            var linearScale = d3.scaleLinear()
                .domain([0, 10.0])
                .range([0, width]);

            // Access svg area
            var svg = d3.select("div#project-sliders")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 400 400")
                .classed("svg-content", true);

            // Select the other svg to be modified
            var otro = d3.select("div#resilience-container2");

            // Slider 1
            var slider1 = svg.append("g")
                .attr("transform", "translate(" + zerox + ", " + (zeroy + 0) + ")");

            slider1.append("text")
                .text("What would happen with more active installation of the projects in the city?");

            var slider1_s = slider1.append("g")
                .attr("class", "slider")
                .attr("transform", "translate(0, " + (zeroy + 10) + ")");

            slider1_s.append("line")
                .attr("class", "track")
                .attr("x1", x.range()[0])
                .attr("x2", x.range()[1])
                .select(function() {
                    return this.parentNode.appendChild(this.cloneNode(true));
                })
                .attr("class", "track-inset")
                .select(function() {
                    return this.parentNode.appendChild(this.cloneNode(true));
                })
                .attr("class", "track-overlay")
                .call(d3.drag()
                    .on("start.interrupt", function() {
                        slider1_s.interrupt();
                    })
                    .on("start drag", function() {
                        hue1(x.invert(d3.event.x));
                    }));

            slider1_s.insert("g", ".track-overlay")
                .attr("class", "ticks")
                .attr("transform", "translate(0," + 18 + ")")
                .selectAll("text")
                .data(x.ticks(10))
                .enter().append("text")
                .attr("x", x)
                .attr("y", 0)
                .attr("text-anchor", "middle")
                .text(function(d) {
                    return d;
                });

            var handle1 = slider1_s.insert("rect", ".track-overlay")
                .attr("class", "handle")
                .attr("width", 6)
                .attr("height", 20)
                .attr("y", -10)
                .attr("rx", 3)
                .attr("ry", 3);

            // Slider 2
            var slider2 = svg.append("g")
                .attr("transform", "translate(" + zerox + ", " + (zeroy + 70) + ")");

            slider2.append("text")
                .text("What would happen if the project had more budget?");

            var slider2_s = slider2.append("g")
                .attr("class", "slider")
                .attr("transform", "translate(0, " + (zeroy + 10) + ")");

            slider2_s.append("line")
                .attr("class", "track")
                .attr("x1", x.range()[0])
                .attr("x2", x.range()[1])
                .select(function() {
                    return this.parentNode.appendChild(this.cloneNode(true));
                })
                .attr("class", "track-inset")
                .select(function() {
                    return this.parentNode.appendChild(this.cloneNode(true));
                })
                .attr("class", "track-overlay")
                .call(d3.drag()
                    .on("start.interrupt", function() {
                        slider2_s.interrupt();
                    })
                    .on("start drag", function() {
                        hue2(x.invert(d3.event.x));
                    }));

            slider2_s.insert("g", ".track-overlay")
                .attr("class", "ticks")
                .attr("transform", "translate(0," + 18 + ")")
                .selectAll("text")
                .data(x.ticks(10))
                .enter().append("text")
                .attr("x", x)
                .attr("y", 0)
                .attr("text-anchor", "middle")
                .text(function(d) {
                    return d + "K €";
                });

            var handle2 = slider2_s.insert("rect", ".track-overlay")
                .attr("class", "handle")
                .attr("width", 6)
                .attr("height", 20)
                .attr("y", -10)
                .attr("rx", 3)
                .attr("ry", 3);

            // Slider 3
            var slider3 = svg.append("g")
                .attr("transform", "translate(" + zerox + ", " + (zeroy + 150) + ")");

            slider3.append("text")
                .text("What would happen if the project had more participants?");

            var slider3_s = slider3.append("g")
                .attr("class", "slider")
                .attr("transform", "translate(0, " + (zeroy + 10) + ")");

            slider3_s.append("line")
                .attr("class", "track")
                .attr("x1", x.range()[0])
                .attr("x2", x.range()[1])
                .select(function() {
                    return this.parentNode.appendChild(this.cloneNode(true));
                })
                .attr("class", "track-inset")
                .select(function() {
                    return this.parentNode.appendChild(this.cloneNode(true));
                })
                .attr("class", "track-overlay")
                .call(d3.drag()
                    .on("start.interrupt", function() {
                        slider3_s.interrupt();
                    })
                    .on("start drag", function() {
                        hue3(x.invert(d3.event.x));
                    }));

            slider3_s.insert("g", ".track-overlay")
                .attr("class", "ticks")
                .attr("transform", "translate(0," + 18 + ")")
                .selectAll("text")
                .data(x.ticks(10))
                .enter().append("text")
                .attr("x", x)
                .attr("y", 0)
                .attr("text-anchor", "middle")
                .text(function(d) {
                    return d;
                });

            var handle3 = slider3_s.insert("rect", ".track-overlay")
                .attr("class", "handle")
                .attr("width", 6)
                .attr("height", 20)
                .attr("y", -10)
                .attr("rx", 3)
                .attr("ry", 3);

            var project_impact = {
                "Education": 0.02,
                "Jobs": 0.3,
                "Income": 0.4,
                "Safety": 0.01,
                "Health": 0.1,
                "Environment": 0.6,
                "Civic engagement": 0.4,
                "Accessibility to services": 0.02,
                "Housing": 0.02,
                "Community": 0.7,
                "Life satisfaction": 0.2
            };

            var money_impact = 4;
            var community_impact = 3;

            //data/
            //regions_wellbeing[283]
            //countries_wellbeing[28]
            //city_wellbeing

            // ---
            function hue1(h) {
                handle1.attr("x", x(h));
                // Education
                otro.select(".city.education.bar").attr("width", linearScale(city_wellbeing["Education"]) + linearScale((h / 10) * (project_impact["Education"])));
                otro.select(".city.education.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.education.bar").attr("width", linearScale(regions_wellbeing[283]["Education"]) + linearScale((h / 10) * (project_impact["Education"] * (ratio1))));
                otro.select(".region.education.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.education.bar").attr("width", linearScale(countries_wellbeing[28]["Education"]) + linearScale((h / 10) * (project_impact["Education"] * (ratio1 * ratio2))));
                otro.select(".country.education.value").text(Math.round(h) / 10 + "/10");
                // Jobs
                otro.select(".city.jobs.bar").attr("width", linearScale(city_wellbeing["Jobs"]) + linearScale((h / 10) * (project_impact["Jobs"])));
                otro.select(".city.jobs.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.jobs.bar").attr("width", linearScale(regions_wellbeing[283]["Jobs"]) + linearScale((h / 10) * (project_impact["Jobs"] * (ratio1))));
                otro.select(".region.jobs.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.jobs.bar").attr("width", linearScale(countries_wellbeing[28]["Jobs"]) + linearScale((h / 10) * (project_impact["Jobs"] * (ratio1 * ratio2))));
                otro.select(".country.jobs.value").text(Math.round(h) / 10 + "/10");
                // Income
                otro.select(".city.income.bar").attr("width", linearScale(city_wellbeing["Income"]) + linearScale((h / 10) * (project_impact["Income"])));
                otro.select(".city.income.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.income.bar").attr("width", linearScale(regions_wellbeing[283]["Income"]) + linearScale((h / 10) * (project_impact["Income"] * (ratio1))));
                otro.select(".region.income.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.income.bar").attr("width", linearScale(countries_wellbeing[28]["Income"]) + linearScale((h / 10) * (project_impact["Income"] * (ratio1 * ratio2))));
                otro.select(".country.income.value").text(Math.round(h) / 10 + "/10");
                // Safety
                otro.select(".city.safety.bar").attr("width", linearScale(city_wellbeing["Safety"]) + linearScale((h / 10) * (project_impact["Safety"])));
                otro.select(".city.safety.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.safety.bar").attr("width", linearScale(regions_wellbeing[283]["Safety"]) + linearScale((h / 10) * (project_impact["Safety"] * (ratio1))));
                otro.select(".region.safety.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.safety.bar").attr("width", linearScale(countries_wellbeing[28]["Safety"]) + linearScale((h / 10) * (project_impact["Safety"] * (ratio1 * ratio2))));
                otro.select(".country.safety.value").text(Math.round(h) / 10 + "/10");
                // Health
                otro.select(".city.health.bar").attr("width", linearScale(city_wellbeing["Health"]) + linearScale((h / 10) * (project_impact["Health"])));
                otro.select(".city.health.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.health.bar").attr("width", linearScale(regions_wellbeing[283]["Health"]) + linearScale((h / 10) * (project_impact["Health"] * (ratio1))));
                otro.select(".region.health.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.health.bar").attr("width", linearScale(countries_wellbeing[28]["Health"]) + linearScale((h / 10) * (project_impact["Health"] * (ratio1 * ratio2))));
                otro.select(".country.health.value").text(Math.round(h) / 10 + "/10");
                // Environment
                otro.select(".city.environment.bar").attr("width", linearScale(city_wellbeing["Environment"]) + linearScale((h / 10) * (project_impact["Environment"])));
                otro.select(".city.environment.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.environment.bar").attr("width", linearScale(regions_wellbeing[283]["Environment"]) + linearScale((h / 10) * (project_impact["Environment"] * (ratio1))));
                otro.select(".region.environment.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.environment.bar").attr("width", linearScale(countries_wellbeing[28]["Environment"]) + linearScale((h / 10) * (project_impact["Environment"] * (ratio1 * ratio2))));
                otro.select(".country.environment.value").text(Math.round(h) / 10 + "/10");
                // Civic engagement
                otro.select(".city.civic.bar").attr("width", linearScale(city_wellbeing["Civic engagement"]) + linearScale((h / 10) * (project_impact["Civic engagement"])));
                otro.select(".city.civic.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.civic.bar").attr("width", linearScale(regions_wellbeing[283]["Civic engagement"]) + linearScale((h / 10) * (project_impact["Civic engagement"] * (ratio1))));
                otro.select(".region.civic.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.civic.bar").attr("width", linearScale(countries_wellbeing[28]["Civic engagement"]) + linearScale((h / 10) * (project_impact["Civic engagement"] * (ratio1 * ratio2))));
                otro.select(".country.civic.value").text(Math.round(h) / 10 + "/10");
                // Accessibility to services
                otro.select(".city.accessibility.to.services.bar").attr("width", linearScale(city_wellbeing["Accessibility to services"]) + linearScale((h / 10) * (project_impact["Accessibility to services"])));
                otro.select(".city.accessibility.to.services.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.accessibility.to.services.bar").attr("width", linearScale(regions_wellbeing[283]["Accessibility to services"]) + linearScale((h / 10) * (project_impact["Accessibility to services"] * (ratio1))));
                otro.select(".region.accessibility.to.services.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.accessibility.to.services.bar").attr("width", linearScale(countries_wellbeing[28]["Accessibility to services"]) + linearScale((h / 10) * (project_impact["Accessibility to services"] * (ratio1 *
                    ratio2))));
                otro.select(".country.accessibility.to.services.value").text(Math.round(h) / 10 + "/10");
                // Housing
                otro.select(".city.housing.bar").attr("width", linearScale(city_wellbeing["Housing"]) + linearScale((h / 10) * (project_impact["Housing"])));
                otro.select(".city.housing.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.housing.bar").attr("width", linearScale(regions_wellbeing[283]["Housing"]) + linearScale((h / 10) * (project_impact["Housing"] * (ratio1))));
                otro.select(".region.housing.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.housing.bar").attr("width", linearScale(countries_wellbeing[28]["Housing"]) + linearScale((h / 10) * (project_impact["Housing"] * (ratio1 * ratio2))));
                otro.select(".country.housing.value").text(Math.round(h) / 10 + "/10");
                // Community
                otro.select(".city.community.bar").attr("width", linearScale(city_wellbeing["Community"]) + linearScale((h / 10) * (project_impact["Community"])));
                otro.select(".city.community.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.community.bar").attr("width", linearScale(regions_wellbeing[283]["Community"]) + linearScale((h / 10) * (project_impact["Community"] * (ratio1))));
                otro.select(".region.community.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.community.bar").attr("width", linearScale(countries_wellbeing[28]["Community"]) + linearScale((h / 10) * (project_impact["Community"] * (ratio1 * ratio2))));
                otro.select(".country.community.value").text(Math.round(h) / 10 + "/10");
                // Life satisfaction
                otro.select(".city.life.satisfaction.bar").attr("width", linearScale(city_wellbeing["Life satisfaction"]) + linearScale((h / 10) * (project_impact["Education"])));
                otro.select(".city.life.satisfaction.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.life.satisfaction.bar").attr("width", linearScale(regions_wellbeing[283]["Life satisfaction"]) + linearScale((h / 10) * (project_impact["Life satisfaction"] * (ratio1))));
                otro.select(".region.life.satio.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.life.satisfaction.bar").attr("width", linearScale(countries_wellbeing[28]["Life satisfaction"]) + linearScale((h / 10) * (project_impact["Life satisfaction"] * (ratio1 * ratio2))));
                otro.select(".country.life.satisfaction.value").text(Math.round(h) / 10 + "/10");
            }

            // ---
            function hue2(h) {
                handle2.attr("x", x(h));
                // Education
                otro.select(".city.education.bar").attr("width", linearScale(city_wellbeing["Education"]) + linearScale((h / 10) * money_impact * (project_impact["Education"])));
                otro.select(".city.education.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.education.bar").attr("width", linearScale(regions_wellbeing[283]["Education"]) + linearScale((h / 10) * money_impact * (project_impact["Education"] * (ratio1))));
                otro.select(".region.education.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.education.bar").attr("width", linearScale(countries_wellbeing[28]["Education"]) + linearScale((h / 10) * money_impact * (project_impact["Education"] * (ratio1 * ratio2))));
                otro.select(".country.education.value").text(Math.round(h) / 10 + "/10");
                // Jobs
                otro.select(".city.jobs.bar").attr("width", linearScale(city_wellbeing["Jobs"]) + linearScale((h / 10) * money_impact * (project_impact["Jobs"])));
                otro.select(".city.jobs.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.jobs.bar").attr("width", linearScale(regions_wellbeing[283]["Jobs"]) + linearScale((h / 10) * money_impact * (project_impact["Jobs"] * (ratio1))));
                otro.select(".region.jobs.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.jobs.bar").attr("width", linearScale(countries_wellbeing[28]["Jobs"]) + linearScale((h / 10) * money_impact * (project_impact["Jobs"] * (ratio1 * ratio2))));
                otro.select(".country.jobs.value").text(Math.round(h) / 10 + "/10");
                // Income
                otro.select(".city.income.bar").attr("width", linearScale(city_wellbeing["Income"]) + linearScale((h / 10) * money_impact * (project_impact["Income"])));
                otro.select(".city.income.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.income.bar").attr("width", linearScale(regions_wellbeing[283]["Income"]) + linearScale((h / 10) * money_impact * (project_impact["Income"] * (ratio1))));
                otro.select(".region.income.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.income.bar").attr("width", linearScale(countries_wellbeing[28]["Income"]) + linearScale((h / 10) * money_impact * (project_impact["Income"] * (ratio1 * ratio2))));
                otro.select(".country.income.value").text(Math.round(h) / 10 + "/10");
                // Safety
                otro.select(".city.safety.bar").attr("width", linearScale(city_wellbeing["Safety"]) + linearScale((h / 10) * money_impact * (project_impact["Safety"])));
                otro.select(".city.safety.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.safety.bar").attr("width", linearScale(regions_wellbeing[283]["Safety"]) + linearScale((h / 10) * money_impact * (project_impact["Safety"] * (ratio1))));
                otro.select(".region.safety.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.safety.bar").attr("width", linearScale(countries_wellbeing[28]["Safety"]) + linearScale((h / 10) * money_impact * (project_impact["Safety"] * (ratio1 * ratio2))));
                otro.select(".country.safety.value").text(Math.round(h) / 10 + "/10");
                // Health
                otro.select(".city.health.bar").attr("width", linearScale(city_wellbeing["Health"]) + linearScale((h / 10) * money_impact * (project_impact["Health"])));
                otro.select(".city.health.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.health.bar").attr("width", linearScale(regions_wellbeing[283]["Health"]) + linearScale((h / 10) * money_impact * (project_impact["Health"] * (ratio1))));
                otro.select(".region.health.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.health.bar").attr("width", linearScale(countries_wellbeing[28]["Health"]) + linearScale((h / 10) * money_impact * (project_impact["Health"] * (ratio1 * ratio2))));
                otro.select(".country.health.value").text(Math.round(h) / 10 + "/10");
                // Environment
                otro.select(".city.environment.bar").attr("width", linearScale(city_wellbeing["Environment"]) + linearScale((h / 10) * money_impact * (project_impact["Environment"])));
                otro.select(".city.environment.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.environment.bar").attr("width", linearScale(regions_wellbeing[283]["Environment"]) + linearScale((h / 10) * money_impact * (project_impact["Environment"] * (ratio1))));
                otro.select(".region.environment.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.environment.bar").attr("width", linearScale(countries_wellbeing[28]["Environment"]) + linearScale((h / 10) * money_impact * (project_impact["Environment"] * (ratio1 * ratio2))));
                otro.select(".country.environment.value").text(Math.round(h) / 10 + "/10");
                // Civic engagement
                otro.select(".city.civic.bar").attr("width", linearScale(city_wellbeing["Civic engagement"]) + linearScale((h / 10) * money_impact * (project_impact["Civic engagement"])));
                otro.select(".city.civic.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.civic.bar").attr("width", linearScale(regions_wellbeing[283]["Civic engagement"]) + linearScale((h / 10) * money_impact * (project_impact["Civic engagement"] * (ratio1))));
                otro.select(".region.civic.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.civic.bar").attr("width", linearScale(countries_wellbeing[28]["Civic engagement"]) + linearScale((h / 10) * money_impact * (project_impact["Civic engagement"] * (ratio1 * ratio2))));
                otro.select(".country.civic.value").text(Math.round(h) / 10 + "/10");
                // Accessibility to services
                otro.select(".city.accessibility.to.services.bar").attr("width", linearScale(city_wellbeing["Accessibility to services"]) + linearScale((h / 10) * money_impact * (project_impact["Accessibility to services"])));
                otro.select(".city.accessibility.to.services.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.accessibility.to.services.bar").attr("width", linearScale(regions_wellbeing[283]["Accessibility to services"]) + linearScale((h / 10) * money_impact * (project_impact["Accessibility to services"] * (
                    ratio1))));
                otro.select(".region.accessibility.to.services.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.accessibility.to.services.bar").attr("width", linearScale(countries_wellbeing[28]["Accessibility to services"]) + linearScale((h / 10) * money_impact * (project_impact["Accessibility to services"] *
                    (ratio1 *
                        ratio2))));
                otro.select(".country.accessibility.to.services.value").text(Math.round(h) / 10 + "/10");
                // Housing
                otro.select(".city.housing.bar").attr("width", linearScale(city_wellbeing["Housing"]) + linearScale((h / 10) * money_impact * (project_impact["Housing"])));
                otro.select(".city.housing.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.housing.bar").attr("width", linearScale(regions_wellbeing[283]["Housing"]) + linearScale((h / 10) * money_impact * (project_impact["Housing"] * (ratio1))));
                otro.select(".region.housing.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.housing.bar").attr("width", linearScale(countries_wellbeing[28]["Housing"]) + linearScale((h / 10) * money_impact * (project_impact["Housing"] * (ratio1 * ratio2))));
                otro.select(".country.housing.value").text(Math.round(h) / 10 + "/10");
                // Community
                otro.select(".city.community.bar").attr("width", linearScale(city_wellbeing["Community"]) + linearScale((h / 10) * money_impact * (project_impact["Community"])));
                otro.select(".city.community.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.community.bar").attr("width", linearScale(regions_wellbeing[283]["Community"]) + linearScale((h / 10) * money_impact * (project_impact["Community"] * (ratio1))));
                otro.select(".region.community.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.community.bar").attr("width", linearScale(countries_wellbeing[28]["Community"]) + linearScale((h / 10) * money_impact * (project_impact["Community"] * (ratio1 * ratio2))));
                otro.select(".country.community.value").text(Math.round(h) / 10 + "/10");
                // Life satisfaction
                otro.select(".city.life.satisfaction.bar").attr("width", linearScale(city_wellbeing["Life satisfaction"]) + linearScale((h / 10) * money_impact * (project_impact["Education"])));
                otro.select(".city.life.satisfaction.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.life.satisfaction.bar").attr("width", linearScale(regions_wellbeing[283]["Life satisfaction"]) + linearScale((h / 10) * money_impact * (project_impact["Life satisfaction"] * (ratio1))));
                otro.select(".region.life.satio.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.life.satisfaction.bar").attr("width", linearScale(countries_wellbeing[28]["Life satisfaction"]) + linearScale((h / 10) * money_impact * (project_impact["Life satisfaction"] * (ratio1 * ratio2))));
                otro.select(".country.life.satisfaction.value").text(Math.round(h) / 10 + "/10");
            }

            // ---
            function hue3(h) {
                handle3.attr("x", x(h));
                // Education
                otro.select(".city.education.bar").attr("width", linearScale(city_wellbeing["Education"]) + linearScale((h / 10) * community_impact * (project_impact["Education"])));
                otro.select(".city.education.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.education.bar").attr("width", linearScale(regions_wellbeing[283]["Education"]) + linearScale((h / 10) * community_impact * (project_impact["Education"] * (ratio1))));
                otro.select(".region.education.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.education.bar").attr("width", linearScale(countries_wellbeing[28]["Education"]) + linearScale((h / 10) * community_impact * (project_impact["Education"] * (ratio1 *
                    ratio2))));
                otro.select(".country.education.value").text(Math.round(h) / 10 + "/10");
                // Jobs
                otro.select(".city.jobs.bar").attr("width", linearScale(city_wellbeing["Jobs"]) + linearScale((h / 10) * community_impact * (project_impact["Jobs"])));
                otro.select(".city.jobs.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.jobs.bar").attr("width", linearScale(regions_wellbeing[283]["Jobs"]) + linearScale((h / 10) * community_impact * (project_impact["Jobs"] * (ratio1))));
                otro.select(".region.jobs.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.jobs.bar").attr("width", linearScale(countries_wellbeing[28]["Jobs"]) + linearScale((h / 10) * community_impact * (project_impact["Jobs"] * (ratio1 * ratio2))));
                otro.select(".country.jobs.value").text(Math.round(h) / 10 + "/10");
                // Income
                otro.select(".city.income.bar").attr("width", linearScale(city_wellbeing["Income"]) + linearScale((h / 10) * community_impact * (project_impact["Income"])));
                otro.select(".city.income.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.income.bar").attr("width", linearScale(regions_wellbeing[283]["Income"]) + linearScale((h / 10) * community_impact * (project_impact["Income"] * (ratio1))));
                otro.select(".region.income.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.income.bar").attr("width", linearScale(countries_wellbeing[28]["Income"]) + linearScale((h / 10) * community_impact * (project_impact["Income"] * (ratio1 * ratio2))));
                otro.select(".country.income.value").text(Math.round(h) / 10 + "/10");
                // Safety
                otro.select(".city.safety.bar").attr("width", linearScale(city_wellbeing["Safety"]) + linearScale((h / 10) * community_impact * (project_impact["Safety"])));
                otro.select(".city.safety.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.safety.bar").attr("width", linearScale(regions_wellbeing[283]["Safety"]) + linearScale((h / 10) * community_impact * (project_impact["Safety"] * (ratio1))));
                otro.select(".region.safety.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.safety.bar").attr("width", linearScale(countries_wellbeing[28]["Safety"]) + linearScale((h / 10) * community_impact * (project_impact["Safety"] * (ratio1 * ratio2))));
                otro.select(".country.safety.value").text(Math.round(h) / 10 + "/10");
                // Health
                otro.select(".city.health.bar").attr("width", linearScale(city_wellbeing["Health"]) + linearScale((h / 10) * community_impact * (project_impact["Health"])));
                otro.select(".city.health.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.health.bar").attr("width", linearScale(regions_wellbeing[283]["Health"]) + linearScale((h / 10) * money_impact * (project_impact["Health"] * (ratio1))));
                otro.select(".region.health.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.health.bar").attr("width", linearScale(countries_wellbeing[28]["Health"]) + linearScale((h / 10) * community_impact * (project_impact["Health"] * (ratio1 * ratio2))));
                otro.select(".country.health.value").text(Math.round(h) / 10 + "/10");
                // Environment
                otro.select(".city.environment.bar").attr("width", linearScale(city_wellbeing["Environment"]) + linearScale((h / 10) * community_impact * (project_impact["Environment"])));
                otro.select(".city.environment.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.environment.bar").attr("width", linearScale(regions_wellbeing[283]["Environment"]) + linearScale((h / 10) * community_impact * (project_impact["Environment"] * (
                    ratio1))));
                otro.select(".region.environment.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.environment.bar").attr("width", linearScale(countries_wellbeing[28]["Environment"]) + linearScale((h / 10) * community_impact * (project_impact["Environment"] * (
                    ratio1 * ratio2))));
                otro.select(".country.environment.value").text(Math.round(h) / 10 + "/10");
                // Civic engagement
                otro.select(".city.civic.bar").attr("width", linearScale(city_wellbeing["Civic engagement"]) + linearScale((h / 10) * community_impact * (project_impact["Civic engagement"])));
                otro.select(".city.civic.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.civic.bar").attr("width", linearScale(regions_wellbeing[283]["Civic engagement"]) + linearScale((h / 10) * community_impact * (project_impact["Civic engagement"] *
                    (ratio1))));
                otro.select(".region.civic.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.civic.bar").attr("width", linearScale(countries_wellbeing[28]["Civic engagement"]) + linearScale((h / 10) * community_impact * (project_impact["Civic engagement"] *
                    (ratio1 *
                        ratio2))));
                otro.select(".country.civic.value").text(Math.round(h) / 10 + "/10");
                // Accessibility to services
                otro.select(".city.accessibility.to.services.bar").attr("width", linearScale(city_wellbeing["Accessibility to services"]) + linearScale((h / 10) * community_impact * (project_impact[
                    "Accessibility to services"])));
                otro.select(".city.accessibility.to.services.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.accessibility.to.services.bar").attr("width", linearScale(regions_wellbeing[283]["Accessibility to services"]) + linearScale((h / 10) * community_impact * (
                    project_impact[
                        "Accessibility to services"] *
                    (
                        ratio1))));
                otro.select(".region.accessibility.to.services.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.accessibility.to.services.bar").attr("width", linearScale(countries_wellbeing[28]["Accessibility to services"]) + linearScale((h / 10) * community_impact * (
                    project_impact[
                        "Accessibility to services"] *
                    (ratio1 *
                        ratio2))));
                otro.select(".country.accessibility.to.services.value").text(Math.round(h) / 10 + "/10");
                // Housing
                otro.select(".city.housing.bar").attr("width", linearScale(city_wellbeing["Housing"]) + linearScale((h / 10) * community_impact * (project_impact["Housing"])));
                otro.select(".city.housing.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.housing.bar").attr("width", linearScale(regions_wellbeing[283]["Housing"]) + linearScale((h / 10) * community_impact * (project_impact["Housing"] * (ratio1))));
                otro.select(".region.housing.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.housing.bar").attr("width", linearScale(countries_wellbeing[28]["Housing"]) + linearScale((h / 10) * community_impact * (project_impact["Housing"] * (ratio1 *
                    ratio2))));
                otro.select(".country.housing.value").text(Math.round(h) / 10 + "/10");
                // Community
                otro.select(".city.community.bar").attr("width", linearScale(city_wellbeing["Community"]) + linearScale((h / 10) * community_impact * (project_impact["Community"])));
                otro.select(".city.community.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.community.bar").attr("width", linearScale(regions_wellbeing[283]["Community"]) + linearScale((h / 10) * community_impact * (project_impact["Community"] * (ratio1))));
                otro.select(".region.community.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.community.bar").attr("width", linearScale(countries_wellbeing[28]["Community"]) + linearScale((h / 10) * community_impact * (project_impact["Community"] * (ratio1 *
                    ratio2))));
                otro.select(".country.community.value").text(Math.round(h) / 10 + "/10");
                // Life satisfaction
                otro.select(".city.life.satisfaction.bar").attr("width", linearScale(city_wellbeing["Life satisfaction"]) + linearScale((h / 10) * community_impact * (project_impact["Education"])));
                otro.select(".city.life.satisfaction.value").text(Math.round(h) / 10 + "/10");
                otro.select(".region.life.satisfaction.bar").attr("width", linearScale(regions_wellbeing[283]["Life satisfaction"]) + linearScale((h / 10) * community_impact * (project_impact[
                    "Life satisfaction"] * (
                    ratio1))));
                otro.select(".region.life.satio.value").text(Math.round(h) / 10 + "/10");
                otro.select(".country.life.satisfaction.bar").attr("width", linearScale(countries_wellbeing[28]["Life satisfaction"]) + linearScale((h / 10) * community_impact * (project_impact[
                        "Life satisfaction"] *
                    (ratio1 * ratio2))));
                otro.select(".country.life.satisfaction.value").text(Math.round(h) / 10 + "/10");
            }

        }
    });
