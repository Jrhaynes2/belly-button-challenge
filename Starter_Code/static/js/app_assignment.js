// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filter_meta = metadata.filter(sample1 => sample1.id == sample);
    let meta_result = filter_meta[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel_meta = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel_meta.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(meta_result).forEach(([key, value]) => {
        panel_meta.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filter_samples = samples.filter(sample1 => sample1.id == sample);
    let sample_result = filter_samples[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample_result.otu_ids;
    let otu_labels = sample_result.otu_labels;
    let sample_values = sample_result.sample_values;

    // Build a Bubble Chart
    let bubble_chart = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "solar"
        }
      }];
  
      let bubble_chart_layout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: { title: 'OTU ID' },
        margin: { t: 30 }
      };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubble_chart, bubble_chart_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [{
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
      }];

      let barLayout = {
        title: 'Top 10 Bacteria Cultures Found',
        margin: { t: 30, l: 150 }
      };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names_field = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names_field.forEach((sample) => {
        dropdown.append("option").text(sample).property("value", sample);
      });

    // Get the first sample from the list
    let first_sample = names_field[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(first_sample);
    buildCharts(first_sample);
  });
}

// Function for event listener
function optionChanged(new_sample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(new_sample);
  buildCharts(new_sample);
}

// Initialize the dashboard
init();
