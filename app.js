// ------------------------------- Populates the metadata -------------------------------
function demoInfo(sample)
{
    // Load the data from the .json
    d3.json("samples.json").then((data) => {
        // Get the metadata
        let metadataData = data.metadata;

        // Filter the value of the sample
        let result = metadataData.filter(sampleResult => sampleResult.id == sample);

        // Get index 0 from the array that was just created
        let resultSample = result[0];

        // Clear the log
        d3.select("#sample-metadata").html("");

        // Get the key value pairs
        Object.entries(resultSample).forEach(([key, value]) => {
            // Add to the sample data
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });
}

//  --------------------------  Builds the bar chart -------------------------------
function buildBarChart(sample)
{
    d3.json("samples.json").then((data) => {
        // Get the sample data
        let sampleData = data.samples;
        
        // Filter the value of the sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        
        // Get index 0 from the array that was just created
        let resultSample = result[0];

        // Get IDs
        let otu_ids = resultSample.otu_ids;
        let otu_labels = resultSample.otu_labels;
        let sample_values = resultSample.sample_values;

        // Build bar chart
        let yTicks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0, 10);
        let textLabels = otu_labels.slice(0,10);

        let barChart = {
            y: yTicks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);
    });

}

// ------------------------------- Builds the bubble chart -------------------------------
function buildBubbleChart(sample)
{
    d3.json("samples.json").then((data) => {
        // Get the sample data
        let sampleData = data.samples;
        
        // Filter the value of the sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        
        // Get index 0 from the array that was just created
        let resultSample = result[0];

        // Get IDs
        let otu_ids = resultSample.otu_ids;
        let otu_labels = resultSample.otu_labels;
        let sample_values = resultSample.sample_values;

        // Build bubble chart
        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        let layout = {
            title: "Bacteria Cultures per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);
    });
}

// ------------------------------- Initializes the dashboard -------------------------------
function initialize()
{
    // Access the dropdown selector from the index
    var select = d3.select("#selDataset");

    // Get the data
    // Load the data from the .json
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;

        // Create option to get each sample
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });

        // First sample
        let firstSample = sampleNames[0];

        // Build metadata
        demoInfo(firstSample);

        // Build the bar chart
        buildBarChart(firstSample);

        // Build bubble chart
        buildBubbleChart(firstSample);

    });
}

// ------------------------------- Update the dashboard -------------------------------
function optionChanged(item)
{
    // Update metadata
    demoInfo(item);

    // Update the bar chart
    buildBarChart(item);

    // Build bubble chart
    buildBubbleChart(item);


}
// Call the initializing function
initialize();