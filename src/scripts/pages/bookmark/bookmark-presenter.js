// import { storyMapper } from '../../data/api-mapper.js';

export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStorysListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStorysListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showStorysListLoading();

    try {
      await this.showStorysListMap();

      const listOfStorys = await this.#model.getAllStorys();
      const storys = await Promise.all(listOfStorys.map((listOfStory) => listOfStory));
      // const storys = await Promise.all(listOfStorys.map(storyMapper));

      const message = 'Berhasil mendapatkan daftar laporan tersimpan.';
      this.#view.populateBookmarkedStorys(message, storys);
      // this.#view.populateBookmarkedStorys(message, storys);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateBookmarkedStorysError(error.message);
    } finally {
      this.#view.hideStorysListLoading();
    }
  }
}
