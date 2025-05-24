import HomePage from '../pages/home/home-page.js';
// import AboutPage from '../pages/about/about-page.js';
import StoryNewPage from '../pages/New-Story/new-story-page.js';
import LoginPage from '../pages/autentikasi/login/login-page.js';
import RegisterPage from '../pages/autentikasi/register/register-page.js';
import StoryDetailPage from '../pages/story-detail/story-detail-page.js';
import BookmarkPage from '../pages/bookmark/bookmark-page.js';

const routes = {
  '/login': () => new LoginPage(),
  '/register': () => new RegisterPage(),

  '/': () => new HomePage(),
  '/detail/:id': () => new StoryDetailPage(),
  '/bookmark': () => new BookmarkPage(),
  '/new': () => new StoryNewPage(),
};

export default routes;
