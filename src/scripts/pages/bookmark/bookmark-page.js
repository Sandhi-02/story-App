import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStorysListEmptyTemplate,
  generateStorysListErrorTemplate,
} from '../../templates';
import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';
import Map from '../../utils/map';

export default class BookmarkPage {
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
        <h1 class="section-title">Daftar Story Tersimpan</h1>

        <div class="storys-list__container">
          <div id="storys-list"></div>
          <div id="storys-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populateBookmarkedStorys(message, storys) {
    if (storys.length <= 0) {
      this.populateBookmarkedStorysListEmpty();
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

  populateBookmarkedStorysListEmpty() {
    document.getElementById('storys-list').innerHTML = generateStorysListEmptyTemplate();
  }

  populateBookmarkedStorysError(message) {
    document.getElementById('storys-list').innerHTML = generateStorysListErrorTemplate(message);
  }

  showStorysListLoading() {
    document.getElementById('storys-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStorysListLoading() {
    document.getElementById('storys-list-loading-container').innerHTML = '';
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }
}
