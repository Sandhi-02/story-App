import { map, tileLayer, Icon, icon, marker, popup, latLng } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import { MAP_SERVICE_API_KEY } from '../config.js';

export default class Map {
  #zoom = 5;
  #map = null;

  //   // kode sementara
  //  static async getPlaceNameByCoordinate(latitude, longitude) {
  //     try {
  //       const url = new URL(`https://api.maptiler.com/geocoding/${longitude},${latitude}.json`);
  //       url.searchParams.set('key', MAP_SERVICE_API_KEY);
  //       url.searchParams.set('language', 'id');
  //       url.searchParams.set('limit', '1');
  //       const response = await fetch(url);
  //       const json = await response.json();
  //       const place = json.features[0].place_name.split(', ');
  //       console.log([place.at(-2), place.at(-1)].map((name) => name).join(', '), 'alpwlp');

  //       return [place.at(-2), place.at(-1)].map((name) => name).join(', ');
  //     } catch (error) {
  //       console.error('getPlaceNameByCoordinate: error:', error);
  //       return `${latitude}, ${longitude}`;
  //     }
  //   }
  //   // akhir kode sementara

  static isGeolocationAvalable() {
    return 'geolocation' in navigator;
  }

  static getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!Map.isGeolocationAvalable()) {
        reject('Geolocation API unsupported');
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  static async build(selector, options = {}) {
    if ('center' in options && options.center) {
      return new Map(selector, options);
    }

    const majeneCoordinate = [-6.2, 106.816666];

    if ('locate' in options && options.locate) {
      try {
        const position = await Map.getCurrentPosition();
        const coordinate = [position.coords.latitude, position.coords.longitude];
        // console.log(coordinate);

        return new Map(selector, {
          ...options,
          center: coordinate,
        });
      } catch (error) {
        console.error('build: error:', error);

        return new Map(selector, {
          ...options,
          center: majeneCoordinate,
        });
      }
    }

    return new Map(selector, {
      ...options,
      center: majeneCoordinate,
    });
  }

  constructor(selector, options = {}) {
    this.#zoom = options.zoom ?? this.#zoom;

    const tileOsm = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    });

    // console.log(tileOsm);

    this.#map = map(document.querySelector(selector), {
      zoom: this.#zoom,
      scrollWheelZoom: false,
      layers: [tileOsm],
      ...options,
    });
  }

  changeCamera(coordinate, zoomLevel = null) {
    if (!zoomLevel) {
      this.#map.setView(latLng(coordinate), this.#zoom);
      return;
    }

    this.#map.setView(latLng(coordinate), zoomLevel);
  }

  getCenter() {
    const { lat, lng } = this.#map.getCenter();
    return {
      latitude: lat,
      longitude: lng,
    };
  }

  createIcon(options = {}) {
    return icon({
      ...Icon.Default.prototype.options,
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      ...options,
    });
  }

  addMarker(coordinatesItem, markerOptions = {}, popupOptions = null) {
    // if (typeof markerOptions !== "object") {
    if (typeof markerOptions !== 'object') {
      throw new Error('markerOptions must be an object');
    }

    const newMarker = marker(coordinatesItem, {
      icon: this.createIcon(),
      ...markerOptions,
    });

    // console.log(markerOptions);

    if (popupOptions) {
      if (typeof popupOptions !== 'object') {
        throw new Error('popupOptions must be an object');
      }

      if (!('content' in popupOptions)) {
        throw new Error('popupOptions must include `content` property.');
      }

      // const newPopup = popup(coordinatesItem, popupOptions);
      const newPopup = popup(popupOptions);
      // const newPopup = popup({ lat: coordinatesItem[0], lng: coordinatesItem[1] }, popupOptions);

      newMarker.bindPopup(newPopup);
    }

    newMarker.addTo(this.#map);

    return newMarker;
  }

  addMapEventListener(eventName, callback) {
    this.#map.addEventListener(eventName, callback);
  }
}
