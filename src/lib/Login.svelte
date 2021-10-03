<script>
  import {user} from '../user';

  let username;
  let password;

  function login(){
    user.auth(username, password, ({ err }) => err && alert(err));
  }

  function signup(){
    user.create(username, password, ({err}) => {
      if(err){
        alert(err)
      }else{
        login();
      }
    })
  }

</script>
<main>
  <center>
    <div class="window" style="width: 350px">
      <div class="title-bar">
        <div class="title-bar-text">Authentication</div>
      </div>

      <div class="window-body">
        <div class="field-row" style="margin-top: 1em;">
          <label for="username">Username</label>
          <input type="text" bind:value={username} placeholder="username" id="username" />
        </div>

        <div class="field-row" style="margin-top: 1em;">
          <label for="password">Password</label>
          <input type="password" bind:value={password} placeholder="password" id="password" />
        </div>

        <div style="margin-top: 1em;">
          <button on:click={login}>Login</button>
          <button on:click={signup}>Signup</button>
        </div>
      </div>
    </div>
  </center>
</main>
