export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;

    console.log(this.#view.showMapLoading());
  }

  async showStoryListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoryListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showStoryListMap();

      const response = await this.#model.getAllStorys();
      console.log(response);

      if (!response.ok) {
        console.error('initialGalleryAndMap: response:', response);
        this.#view.populateStorysListError(response.message);
        return;
      }

      this.#view.populateStorysList(response.message, response.listStory);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateStorysListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
