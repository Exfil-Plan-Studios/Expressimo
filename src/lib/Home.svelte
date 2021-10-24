<script>
  import {user, username} from '../user';
  import SearchItems from './SearchItems.svelte';
  import {storeResults} from '../store';
  import routes from '../apiRoutes';

  let searchText = "";
  let resultContainer;

  // Default List if empty
  $storeResults = [
    {id: 0, title: "No Data"}
  ]


  function logout(){
    user.leave();
    username.set('');
  }

  async function search(){
    $storeResults = [];
    const response = await routes.search(searchText);
    let results = response.items.slice(0, 10);
    console.log(results);
    let l = $storeResults.length;
    for(let item of results){
      l++;
      $storeResults[l - 1] = {id: item.id, title: item.title};
      
    }
  }
</script>

<main>
  <div class="window">
    <div class="title-bar">
      <div class="title-bar-text">Stream</div>
      <div class="title-bar-controls">
        <button aria-label="Close" on:click={logout}></button>
      </div>
    </div>

    <div class="window-body">
      <menu role="tablist">
        <button aria-selected="true" aria-controls="music">Music</button>
        <button aria-controls="dogs">Settings</button>
        <button aria-controls="food">Peer Servers</button>
      </menu>

      <article role="tabpanel" id="music" class="container">
        <fieldset>
          <div class="field-row" style="margin-bottom: 2em;">
            <label for="search">Search</label>
            <input id="search" type="text" bind:value={searchText} style="border: 1px solid #7f9db9; width: 20em;"/>
            <button on:click={search}>Search Music</button>
          </div>
          
          <legend>Your saved music</legend>
          <ul class="tree-view" bind:this={resultContainer}>
            {#each $storeResults as item}
              <li><svelte:component this={SearchItems} objAttr={item}/></li>
            {/each}
          </ul>

          
        </fieldset>
        <fieldset>
          <legend>Currently Playing</legend>
          <center>
            <img
              src="https://www.lyrical-nonsense.com/wp-content/uploads/2021/07/YOASOBI-Monster-English-Version.jpg"
              alt="poster"
              width="120"
            />
            <p>YOASOBI - 怪物</p>
            <div class="field-row" style="width: 300px">
                <label for="range26">0:42</label>
                <input id="range26" type="range" min="1" max="2000" value="5" />
                <label for="range27">3:26</label>
              </div>
              
          </center>
          
        </fieldset>
      </article>
    </div>
  </div>
</main>

<style>
  .container {
    display: grid;
    grid-auto-columns: 1fr;
    grid-template-columns: 1fr 1fr;
    gap: 2em 2em;
  }
</style>
