import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStorysListEmptyTemplate,
  generateStorysListErrorTemplate,
} from '../../templates.js';
import HomePresenter from './home-presenter.js';
import Map from '../../utils/map.js';
import * as StoryAPI from '../../data/api.js';

// console.log(generateLoaderAbsoluteTemplate());
export default class HomePage {
  #presenter = null;
  #map = null;
  async render() {
    return `
     <section>
        <div class="storys-list__map__container">
          <div id="map" class="storys-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Daftar List Story</h1>

        <div class="storys-list__container">
          <div id="storys-list"></div>
          <div id="storys-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populateStorysList(message, storys) {
    if (storys.length <= 0) {
      this.populateStorysListEmpty();
      return;
    }

    const html = storys.reduce((accumulator, story) => {
      if (this.#map) {
        const coordinates = [story.lat, story.lon];
        const coordinatesItem = {
          lat: coordinates[0],
          lng: coordinates[1],
        };

        const markerOptions = { alt: story.name };
        const popupOptions = { content: story.name };

        this.#map.addMarker(coordinatesItem, markerOptions, popupOptions);
      }
      return accumulator.concat(
        generateStoryItemTemplate({
          ...story,
          storiesName: story.name,
        }),
      );
    }, '');

    document.getElementById('storys-list').innerHTML = `
      <div class="storys-list">${html}</div>
    `;
  }

  populateStorysListEmpty() {
    document.getElementById('storys-list').innerHTML = generateStorysListEmptyTemplate();
  }

  populateStorysListError(message) {
    document.getElementById('storys-list').innerHTML = generateStorysListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
    // TODO: map initialization
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('storys-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('storys-list-loading-container').innerHTML = '';
  }
}
