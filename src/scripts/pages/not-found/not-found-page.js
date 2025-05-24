export default class NotFoundPage {
  async render() {
    return `
    <section class="not-found">
      <h1>404</h1>
      <p>Maaf, Halaman yang anda cari tidak ditemukan. Silahkan periksa alamat anda lalu coba lagi!</p>
    </section>
    
    `;
  }

  afterRender() {
    //
  }
}
