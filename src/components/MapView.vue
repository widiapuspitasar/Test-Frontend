<template>
  <div class="p-2 flex flex-col items-center">
    <h1 class="font-bold text-center m-8 lg:text-5xl text-3xl">INTERACTIVE MAPS</h1>

    <div class="relative w-full">
      <div ref="mapContainer" style="height: 500px; width: 100%;"></div>
    </div>
    
    <div class="mt-2 p-2 flex lg:flex-row flex-col lg:w-1/2 lg:justify-center lg:content-center gap-2">
      <div class="flex justify-end">
        <div class="content-center ml-1">
          <label class="font-bold p-1">From:</label>
          <input class="border rounded text-center" v-model="fromLocation.name" placeholder="Select From Location" readonly />
        </div>
        <div class="content-center">
          <label class="font-bold p-1">To:</label>
          <input class="border rounded text-center" v-model="toLocation.name" placeholder="Select To Location" readonly />
        </div>
      </div>
      
      <div class="flex justify-end">
        <button class="bg-[#6EACDA] rounded-md p-1 text-white font-medium w-24" @click="showTrack" v-if="!isTrackVisible">
          See Track
        </button>
        <button class="bg-[#6EACDA] rounded-md p-1 text-white font-medium w-24" @click="closeTrack" v-if="isTrackVisible">
          Close Track
        </button>
      </div>
    </div>
    
    <div v-if="isTrackVisible" class="mt-4">
      <p>Distance: {{ distance }} km</p>
      <p>Duration: {{ duration }} mins</p>
      <button class="sm:block hidden absolute top-[170px] right-[50px] bg-red-600 text-white border-none rounded-full w-[30px] h-[30px] text-[18px] cursor-pointer z-[1000]" @click="toggleSummary">
        {{ isSummaryVisible ? 'X' : 'O' }}
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, onUnmounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useLocationsStore } from '../stores/locationStore';

export default {
  setup() {
    const mapContainer = ref(null);
    const map = ref(null);
    const markers = ref([]);
    const routingControl = ref(null);
    const locationsStore = useLocationsStore();
    const duration = ref(null);
    const fromLocation = ref({ name: '', latitude: '', longitude: '' });
    const toLocation = ref({ name: '', latitude: '', longitude: '' });
    const distance = ref(null);
    const isTrackVisible = ref(false);
    const isSummaryVisible = ref(true);

    locationsStore.fetchLocations();

    onMounted(() => {
      if (mapContainer.value) {
        const indonesiaCenter = [-2.5, 117.5];
        const zoomLevel = 5;

        try {
          map.value = L.map(mapContainer.value).setView(indonesiaCenter, zoomLevel);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
          }).addTo(map.value);

          setupMarkers();

          map.value.on('popupclose', () => {
            resetMap();
          });
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      } else {
        console.error('Map container not found');
      }
    });

    const setupMarkers = () => {
      if (map.value) {
        markers.value.forEach((marker) => {
          if (map.value.hasLayer(marker)) {
            map.value.removeLayer(marker);
          }
        });
        markers.value = [];

        const customIcon = L.icon({
          iconUrl: '/iconPin.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        try {
          locationsStore.locations.forEach((location) => {
            if (location.latitude && location.longitude) {
              const marker = L.marker([location.latitude, location.longitude], { icon: customIcon })
                .addTo(map.value)
                .bindPopup(`
                  <div>
                    <strong>${location.name}</strong><br>
                    <div>
                      <button class="set-from border p-1 bg-[#EEEEEE] rounded-sm" data-lat="${location.latitude}" data-lng="${location.longitude}" data-name="${location.name}">From</button>
                      <button class="set-to border p-1 bg-[#EEEEEE] rounded-sm" data-lat="${location.latitude}" data-lng="${location.longitude}" data-name="${location.name}">To</button>
                    </div>
                  </div>`, { closeOnClick: false, autoClose: false }
                );

              markers.value.push(marker);
            }
          });

          map.value.on('popupopen', (event) => {
            const popup = event.popup;
            const container = popup.getElement();

            container.querySelectorAll('.set-from').forEach(button => {
              button.addEventListener('click', () => {
                const lat = button.getAttribute('data-lat');
                const lng = button.getAttribute('data-lng');
                const name = button.getAttribute('data-name');
                setFromLocation(lat, lng, name);
              });
            });

            container.querySelectorAll('.set-to').forEach(button => {
              button.addEventListener('click', () => {
                const lat = button.getAttribute('data-lat');
                const lng = button.getAttribute('data-lng');
                const name = button.getAttribute('data-name');
                setToLocation(lat, lng, name);
              });
            });
          });
        } catch (error) {
          console.error('Error adding markers:', error);
        }
      }
    };

    const setFromLocation = (lat, lng, name) => {
      fromLocation.value = { name, latitude: lat, longitude: lng };
    };

    const setToLocation = (lat, lng, name) => {
      toLocation.value = { name, latitude: lat, longitude: lng };
    };

    const showTrack = () => {
      if (fromLocation.value.latitude && toLocation.value.latitude) {
        if (routingControl.value) {
          map.value.removeControl(routingControl.value);
        }

        routingControl.value = L.Routing.control({
          waypoints: [
            L.latLng(fromLocation.value.latitude, fromLocation.value.longitude),
            L.latLng(toLocation.value.latitude, toLocation.value.longitude),
          ],
          createMarker: () => null,
          routeWhileDragging: true,
        }).on('routesfound', (e) => {
          const routes = e.routes;
          const summary = routes[0].summary;
          distance.value = (summary.totalDistance / 1000).toFixed(2);
          duration.value = (summary.totalTime / 60).toFixed(2);
        }).addTo(map.value);

        isTrackVisible.value = true;
        isSummaryVisible.value = true;
      } else {
        alert('Please set both from and to locations.');
      }
    };

    const toggleSummary = () => {
      if (isSummaryVisible.value) {
        isSummaryVisible.value = false;
        const summaryElement = document.querySelector('.leaflet-routing-container');
        if (summaryElement) {
          summaryElement.classList.add('hidden');
        }
      } else {
        isSummaryVisible.value = true;
        const summaryElement = document.querySelector('.leaflet-routing-container');
        if (summaryElement) {
          summaryElement.classList.remove('hidden');
        }
      }
    };

    const closeTrack = () => {
      if (routingControl.value) {
        map.value.removeControl(routingControl.value);
        routingControl.value = null;
      }
      isTrackVisible.value = false;
      fromLocation.value = { name: '', latitude: '', longitude: '' };
      toLocation.value = { name: '', latitude: '', longitude: '' };
      distance.value = null;
      duration.value = null;

      const summaryElement = document.querySelector('.leaflet-routing-container');
      if (summaryElement) {
        summaryElement.classList.remove('hidden');
      }
    };

    const resetMap = () => {
      if (map.value) {
        try {
          markers.value.forEach((marker) => {
            if (map.value.hasLayer(marker)) {
              map.value.removeLayer(marker);
            }
          });
          markers.value = [];

          const indonesiaCenter = [-2.5, 117.5];
          const zoomLevel = 5;
          map.value.setView(indonesiaCenter, zoomLevel);

          setupMarkers();
        } catch (error) {
          console.error('Error resetting map:', error);
        }
      }
    };

    watch(
      () => locationsStore.locations,
      (newLocations) => {
        if (map.value) {
          try {
            markers.value.forEach((marker) => {
              if (map.value.hasLayer(marker)) {
                map.value.removeLayer(marker);
              }
            });
            markers.value = [];

            const customIcon = L.icon({
              iconUrl: '/iconPin.png',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            });

            newLocations.forEach((location) => {
              if (location.latitude && location.longitude) {
                const marker = L.marker([location.latitude, location.longitude], { icon: customIcon })
                  .addTo(map.value)
                  .bindPopup(`
                    <div>
                      <strong>${location.name}</strong><br>
                      <div>
                        <button class="set-from border p-1 bg-[#EEEEEE] rounded-sm" data-lat="${location.latitude}" data-lng="${location.longitude}" data-name="${location.name}">From</button>
                        <button class="set-to border p-1 bg-[#EEEEEE] rounded-sm" data-lat="${location.latitude}" data-lng="${location.longitude}" data-name="${location.name}">To</button>
                      </div>
                    </div>`, { closeOnClick: false, autoClose: false }
                  );

                markers.value.push(marker);
              }
            });

            map.value.on('popupopen', (event) => {
              const popup = event.popup;
              const container = popup.getElement();

              container.querySelectorAll('.set-from').forEach(button => {
                button.addEventListener('click', () => {
                  const lat = button.getAttribute('data-lat');
                  const lng = button.getAttribute('data-lng');
                  const name = button.getAttribute('data-name');
                  setFromLocation(lat, lng, name);
                });
              });

              container.querySelectorAll('.set-to').forEach(button => {
                button.addEventListener('click', () => {
                  const lat = button.getAttribute('data-lat');
                  const lng = button.getAttribute('data-lng');
                  const name = button.getAttribute('data-name');
                  setToLocation(lat, lng, name);
                });
              });
            });
          } catch (error) {
            console.error('Error setting up markers:', error);
          }
        }
      },
      { immediate: true }
    );

    onUnmounted(() => {
      if (map.value) {
        map.value.off();
        map.value.remove();
      }
    });

    return {
      mapContainer,
      map,
      fromLocation,
      toLocation,
      duration,
      distance,
      isTrackVisible,
      isSummaryVisible,
      showTrack,
      closeTrack,
      toggleSummary,
    };
  },
};
</script>

<style scoped>

.hidden {
  display: none;
}
</style>