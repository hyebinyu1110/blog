import Router from 'koa-router';
import checkLoggedIn from '../../lib/checkLoggedIn';
import * as postsCtrl from './posts.ctrl';

const posts = new Router();


posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write); 

const post = new Router(); // api/posts/:id
post.get('/', postsCtrl.read);
post.delete('/', checkLoggedIn, postsCtrl.remove);
post.patch('/', checkLoggedIn, postsCtrl.update);

posts.use('/:id', postsCtrl.checkObjectId, post.routes());

export default posts;   