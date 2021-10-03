<script>
  import 'xp.css/dist/XP.css';
  import Router from '@easyroute/core';
  import hashMode from '@easyroute/core/hash-mode';
  import {EasyrouteProvider, RouterOutlet} from '@easyroute/svelte';
  import Login from './lib/Login.svelte';
  import Home from './lib/Home.svelte';

  import {user, username} from './user';

  const router = new Router({
    mode: hashMode,

    routes: [
      {
        path: "/",
        component: Login,
        name: "Login",
        beforeEnter: preventHistory
      },
      {
        path: "/home",
        component: Home,
        name: "Home",
        beforeEnter: checkAuth
      }
    ]
  });

 function checkAuth(to, from, next){
    username.subscribe(value => {
      if(value === ""){
        router.push('/')
      }else{
        // if logged in
        next();
      }
    })
  }

  // Prevent logged in users from going back to the login page
  function preventHistory(to, from, next){
    username.subscribe(value => {
      if(value !== ""){
        router.push('/home')
      }else{
        // if logged in
        next();
      }
    })
  }
</script>

<main>
  <EasyrouteProvider {router}>
    <RouterOutlet/>
  </EasyrouteProvider>

</main>
