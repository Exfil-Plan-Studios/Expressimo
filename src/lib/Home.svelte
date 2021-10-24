<script>


  import { user, username } from "../user";
  import SearchItems from "./SearchItems.svelte";
  import { storeResults } from "../store";
  import routes from "../apiRoutes";

  let searchText = "";
  let resultContainer;
  let thumbnail = "https://via.placeholder.com/150";
  let musicTitle = "";
  let musicSrc = "";

  // Default List if empty
  $storeResults = [{ id: 0, title: "No Data" }];

  function logout() {
    user.leave();
    username.set("");
  }

  async function search() {
    $storeResults = [{ id: 0, title: "Loading..." }];
    const response = await routes.search(searchText);
    let results = response.items.slice(0, 10);
    $storeResults = [];
    console.log(results);
    let l = $storeResults.length;
    for (let item of results) {
      l++;
      $storeResults[l - 1] = {
        id: item.id,
        title: item.title,
        url: item.url,
        thumbs: item.bestThumbnail.url,
      };
    }
  }

  function play(data) {
    const audio = document.getElementById('media');
    thumbnail = data.thumbs;
    musicTitle = data.title;
    musicSrc = `http://localhost:8001/api/play/${data.id}`;
    // @ts-ignore
    audio.load();
    return data;
  }

  
</script>

<main>
  <div class="window">
    <div class="title-bar">
      <div class="title-bar-text">Stream</div>
      <div class="title-bar-controls">
        <button aria-label="Close" on:click={logout} />
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
            <input
              id="search"
              type="text"
              bind:value={searchText}
              style="border: 1px solid #7f9db9; width: 20em;"
            />
            <button on:click={search}>Search Music</button>
          </div>

          <legend>Your saved music</legend>
          <ul class="tree-view" bind:this={resultContainer}>
            {#each $storeResults as item}
              <!-- svelte-ignore a11y-invalid-attribute -->
              <li>
                <a href="#" on:click={play(item)}
                  ><svelte:component this={SearchItems} objAttr={item} /></a
                >
              </li>
            {/each}
          </ul>
        </fieldset>
        <fieldset>
          <legend>Currently Playing</legend>
          <center>
            <img src={thumbnail} alt="poster" width="180" />
            <p>{musicTitle}</p>
            <div class="field-row" style="width: 300px">
              <label for="range26">0:00</label>
              <input id="range26" type="range" min="1" max="2000" value="5" />
              <label for="range27">3:26</label>
            </div>
            <div class="field-row" style="width: 300px">
              <audio autoplay controls id="media">
                <source src={musicSrc} id="audioSrc" type="audio/webm">
            </audio>
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
