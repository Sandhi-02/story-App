import { showFormattedDate } from './utils';

export function generateAuthenticatedNavigationListTemplate() {
  return `
      <li id="push-notification-tools" class="push-notification-tools"></li>
      <li><a id="new-story-button" class="btn new-story-button" href="#/new">Buat Story <i class="fas fa-plus"></i></a></li>
      <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
    `;
}

export function generateMainNavigationListTemplate() {
  return `
      <li><a id="story-list-button" class="story-list-button" href="#/">Daftar Story</a></li>
      <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark">Story Tersimpan</a></li>
    `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateStorysListEmptyTemplate() {
  return `
    <div id="storys-list-empty" class="storys-list__empty">
      <h2>Tidak ada story yang tersedia</h2>
      <p>Saat ini, tidak ada story yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateStorysListErrorTemplate(message) {
  return `
    <div id="storys-list-error" class="storys-list__error">
      <h2>Terjadi kesalahan pengambilan daftar story</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateStoryItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
}) {
  return `
    <div tabindex="0" class="story-item" data-reportid="${id}">
      <img class="story-item__image" src="${photoUrl}" alt="${name}">
      <div class="story-item__body">
        <div class="story-item__main">
          <h2 id="story-title" class="story-item__title">${name}</h2>
          <div class="story-item__more-info">
            <div class="story-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'id-ID')}
            </div>
            <div class="story-item__location">
              <i class="fas fa-map"></i> ${lat}, ${lon}
            </div>
          </div>
        </div>
        <div id="story-description" class="story-item__description">
          ${description}
        </div>
        <div class="story-item__more-info">
          <div class="story-item__author">
            Dibuat oleh: ${name}
          </div>
        </div>
        <a class="btn story-item__read-more" href="#/detail/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

export function generateRemoveStoryButtonTemplate() {
  return `
    <button id="story-detail-remove" class="btn btn-transparent">
      Buang story <i class="fas fa-bookmark"></i>
    </button>
  `;
}

export function generateStoryDetailImageTemplate(imageUrl = null, alt = '') {
  if (!imageUrl) {
    return `
      <img class="story-detail__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="story-detail__image" src="${imageUrl}" alt="${alt}">
  `;
}

export function generateStoryDetailErrorTemplate(message) {
  return `
    <div id="storys-detail-error" class="storys-detail__error">
      <h2>Terjadi kesalahan pengambilan detail laporan</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateStoryDetailTemplate({ name, description, photoUrl, createdAt, lat, lon }) {
  const createdAtFormatted = showFormattedDate(createdAt, 'id-ID');
  const imagesHtml = Array.isArray(photoUrl)
    ? photoUrl.reduce(
        (accumulator, url) => accumulator.concat(generateStoryDetailImageTemplate(url, name)),
        '',
      )
    : generateStoryDetailImageTemplate(photoUrl, name);

  return `
    <div class="story-detail__header">
      <h1 id="title" class="story-detail__title">${name}</h1>

      <div class="story-detail__more-info">
        <div class="story-detail__more-info__inline">
          <div id="createdat" class="story-detail__createdat" data-value="${createdAtFormatted}">
            <i class="fas fa-calendar-alt"></i>
          </div>
        </div>
        <div class="story-detail__more-info__inline">
          <div id="location-latitude" class="story-detail__location__latitude" data-value="${lat}">Latitude:</div>
          <div id="location-longitude" class="story-detail__location__longitude" data-value="${lon}">Longitude:</div>
        </div>
        <div id="author" class="story-detail__author" data-value="${name}">Dibuat oleh:</div>
      </div>
    </div>

    <div class="container">
      <div class="story-detail__images__container">
        <div id="images" class="story-detail__images">${imagesHtml}</div>
      </div>
    </div>

    <div class="container">
      <div class="story-detail__body">
        <div class="story-detail__body__description__container">
          <h2 class="story-detail__description__title">Informasi Lengkap</h2>
          <div id="description" class="story-detail__description__body">
            ${description}
          </div>
        </div>
        <div class="story-detail__body__map__container">
          <h2 class="story-detail__map__title">Peta Lokasi</h2>
          <div class="story-detail__map__container">
            <div id="map" class="story-detail__map"></div>
            <div id="map-loading-container"></div>
          </div>
        </div>

        <hr>

        <div class="story-detail__body__actions__container">
          <h2>Aksi</h2>
          <div class="story-detail__actions__buttons">
            <div id="save-actions-container"></div>
            <div id="notify-me-actions-container">
              <button id="story-detail-notify-me" class="btn btn-transparent">
                Try Notify Me <i class="far fa-bell"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function generateSaveStoryButtonTemplate() {
  return `
    <button id="story-detail-save" class="btn btn-transparent">
      Simpan story <i class="far fa-bookmark"></i>
    </button>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}
