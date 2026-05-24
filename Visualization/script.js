let graphData = {};
let graphInstance = null;

function trimString(inputString, targetString) {
  let index = inputString.indexOf(targetString);
  if (index !== -1) {
    return inputString.substring(0, index);
  } else {
    return inputString;
  }
}

async function fetchData() {
  const select = document.getElementById("algorithm-select");
  const selectedAlgorithm = select.value;
  let endpoint;
  let scale;

  if (selectedAlgorithm === "umap") {
    endpoint = "http://127.0.0.1:8000/my-umap";
    scale = 100;
  } else if (selectedAlgorithm === "tsne") {
    endpoint = "http://127.0.0.1:8000/my-tsne";
    scale = 15;
  } else if (selectedAlgorithm === "pca") {
    endpoint = "http://127.0.0.1:8000/my-pca";
    scale = 1;
  }
  const loader = document.getElementById("loader");
  loader.style.display = "block";

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);

    const N = data.data.length;
    console.log(N);

    document.getElementById("time-taken").value = data.performance.time;
    document.getElementById("silhouette-score").value =
      data.performance.silhouette;
    document.getElementById("memory-used").value = data.performance.memory;

    graphData = {
      nodes: data.data.map((d, idx) => ({
        id: idx,
        fx: d.x * scale,
        fy: d.y * scale,
        fz: d.z * scale,
        src: trimString(d.filename, "_cropped"),
        label: d.label,
      })),
    };

    updateGraph();
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
  } finally {
    loader.style.display = "none";
  }
}

function linkWithDistance(nodes, N, distanceThreshold = 300) {
  console.log(distanceThreshold);
  const maxLinksPerNode = 3; // Limit the number of links per node
  const links = [];
  const linksCount = Array(N).fill(0); // Array to track the number of links for each node

  for (let i = 1; i < N; i++) {
    for (let j = 0; j < i; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];
      const distance = calcDistance(nodeA, nodeB);

      if (distance <= distanceThreshold) {
        // Only add the link if both nodes have less than maxLinksPerNode links
        if (
          linksCount[i] < maxLinksPerNode &&
          linksCount[j] < maxLinksPerNode
        ) {
          links.push({ source: j, target: i });
          linksCount[i]++;
          linksCount[j]++;
        }
      }
    }
  }
  return links;
}

function clusterNodes(nodes, distanceThreshold) {
  const clusters = [];
  let clusterId = 0;

  nodes.forEach((node, idx) => {
    let foundCluster = false;
    for (let i = 0; i < clusters.length; i++) {
      if (isWithinDistance(nodes[clusters[i][0]], node, distanceThreshold)) {
        clusters[i].push(idx);
        foundCluster = true;
        break;
      }
    }
    if (!foundCluster) {
      clusters.push([idx]);
      clusterId++;
    }
  });

  const nodeClusterMap = {};
  clusters.forEach((cluster, id) => {
    cluster.forEach((nodeIdx) => {
      nodeClusterMap[nodeIdx] = id;
    });
  });

  return nodeClusterMap;
}

function calcDistance(nodeA, nodeB) {
  const dx = nodeA.fx - nodeB.fx;
  const dy = nodeA.fy - nodeB.fy;
  const dz = nodeA.fz - nodeB.fz;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function isWithinDistance(nodeA, nodeB, threshold) {
  const distance = calcDistance(nodeA, nodeB);
  return distance <= threshold;
}

function updateThreshold(value) {
  document.getElementById("threshold-value").textContent = value;
  updateGraph(parseInt(value));
}

function updateGraph(distanceThreshold = 250) {
  const N = graphData.nodes.length;
  graphData.links = linkWithDistance(graphData.nodes, N, distanceThreshold);

  // Simple clustering based on distance
  const clusters = clusterNodes(graphData.nodes, distanceThreshold);

  // Assign colors based on clusters
  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "cyan",
    "magenta",
  ];
  graphData.nodes.forEach((node) => {
    node.color = colors[clusters[node.id] % colors.length];
  });

  if (graphInstance) {
    graphInstance.graphData(graphData);
  } else {
    graphInstance = ForceGraph3D()(document.getElementById("3d-graph"))
      .graphData(graphData)
      .enableNodeDrag(false)
      .nodeRelSize(4)
      .enableNavigationControls(true)
      .nodeColor((node) => node.color)
      .onNodeHover((node, prevNode) => {
        const popup = document.getElementById("popup");
        const popupImg = document.getElementById("popup-img");
        if (node) {
          popupImg.src = `all_images/${node.src}.JPG`;
          console.log(node);
          console.log(popup);
          popup.style.display = "block";
        } else {
          // Hide the popup when not hovering
          popup.style.display = "none";
        }
      });

    graphInstance.cameraPosition({ x: 1000, y: 1000, z: 2000 });
  }
}

// Fetch data when the page loads
window.onload = function () {
  fetchData();
};
