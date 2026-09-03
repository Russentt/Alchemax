async function initMap() {
  const storeLocation = { lat: -33.5975, lng: -70.5742 };

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const map = new Map(document.getElementById("map"), {
    zoom: 15,
    center: storeLocation,
    mapId: "DEMO_MAP_ID",
  });

  const marker = new AdvancedMarkerElement({
    map: map,
    position: storeLocation,
    title: "Alchemax Storefront",
  });
}

initMap();
