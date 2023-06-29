mapboxgl.accessToken =
  "pk.eyJ1IjoibmF1c2hhZGlhIiwiYSI6ImNsZ296eXA3NDBiOWkzaG1ybWoxM3dmNWcifQ.bB-kCl0347BPsc_q-7GIOg";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v12",
  center: [76.710986, 30.700877],
  zoom: 13,
});

var directions = new MapboxDirections({
  accessToken: mapboxgl.accessToken,
});

map.addControl(directions, "top-right");

directions.on("route", async () => {
  var originCoordinates = directions.getOrigin().geometry.coordinates;
  var destinationCoordinates = directions.getDestination().geometry.coordinates;
  var route = await directions.getRoute();
  var duration = route.routes[0].duration;
  console.log('Duration:', duration);

  let response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${originCoordinates[0]},${originCoordinates[1]}.json?access_token=${mapboxgl.accessToken}`
  );
  let originData = await response.json();
  originData.originAddress = originData.features[0].place_name;

  response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${destinationCoordinates[0]},${destinationCoordinates[1]}.json?access_token=${mapboxgl.accessToken}`
  );
  let destinationData = await response.json();
  destinationData.destinationAddress = destinationData.features[0].place_name;
  var OrderId = Math.random();
  OrderId = OrderId * 100000000;
  OrderId = parseInt(OrderId);

  response = await fetch("http://localhost:3000/addtask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      // origin: directions.getOrigin(),
      // destination: directions.getDestination(),
      origin: originCoordinates,
      destination: destinationCoordinates,
      destinationAddress: destinationData.destinationAddress,
      originAddress: originData.originAddress,
      Task_details: 1,
      Instruction: "Handle with care",
      status: 0,
      time: duration,
      OrderId
    }),
  });
});
