<script>
  // Image Assets
  import control_pause from "../assets/control_pause.png";
  import control_play from "../assets/control_play.png";
  import control_stop from "../assets/control_stop.png";

  import { user, username } from "../user";
  import SearchItems from "./SearchItems.svelte";
  import { storeResults } from "../store";
  import routes from "../apiRoutes";
  import { onMount } from "svelte";
  let audio = null;
  let searchText = "";
  let resultContainer;
  let thumbnail = "https://via.placeholder.com/150";
  let musicTitle = "";
  let musicSrc = "";

  let audioControls = {
    playing: false,
    currentTime: 0,
    currentPos: "0",
    end: "0",
    range: 0,
    loaded: false,
  };

  // Math Utils
  function pad(num, size) {
    let s = num + "";

    while (s.length < size) {
      s = `0${s}`;
    }

    return s;
  }

  function format_duration(sec) {
    return `${Math.floor(sec / 60)}:${parseInt(pad(sec % 60, 2))}`;
  }

  onMount(() => {
    audio = document.getElementById("media");
    document.getElementById("playBTN").disabled = true;
  });

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

  function fetch(data) {
    thumbnail = data.thumbs;
    musicTitle = data.title;
    musicSrc = `http://localhost:8001/api/play/${data.id}`;
    audioControls.loaded = false;
    audioControls.playing = false;
    document.getElementById("playBTN").disabled = true;
    // @ts-ignore
    audio.load();
    audio.addEventListener("loadedmetadata", function () {
      const duration = audio.duration;
      const minutes = duration / 60;

      audioControls.end = format_duration(duration);
      audioControls.range = duration;

      audioControls.loaded = true;
      document.getElementById("playBTN").disabled = false;
    });

    return data;
  }

  function play() {
    audioControls.playing = !audioControls.playing;
    let playPromise = audio.play();
    if (audioControls.loaded) {
      if (audioControls.playing) {
        if (playPromise !== undefined) {
          playPromise.then(() => {
            audio.play();
          });
        }
      }else{
        if (playPromise !== undefined) {
          playPromise.then(() => {
            audio.pause();
          });
        }
      }
    }
  }

  function stop() {
    if (audioControls.loaded) {
      if (audioControls.playing) {
        audio.pause();
        audio.currentTime = 0;
        audioControls.playing = false;
      } else {
        audio.currentTime = 0;
        audioControls.playing = false;
      }
    }
  }

  function timeupdate() {
    audioControls.currentTime = this.currentTime;
    audioControls.currentPos = format_duration(this.currentTime);
  }

  function seek() {
    audio.currentTime = this.value;
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
                <a href="#" on:click={fetch(item)}
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
              <label for="range26"
                >{audioControls.range !== 0
                  ? audioControls.currentPos
                  : "0:00"}</label
              >
              <input
                id="range26"
                type="range"
                min="0"
                max={audioControls.range}
                value={audioControls.currentTime}
                on:change={seek}
              />
              <label for="range27"
                >{audioControls.range !== 0 ? audioControls.end : "0:00"}</label
              >
            </div>
            <div class="field-row" style="width: 150px; margin-top: 1em;">
              <button on:click={play} id="playBTN"
                ><img
                  src={audioControls.playing ? control_pause : control_play}
                  alt="play"
                /></button
              >
              <button on:click={stop}
                ><img src={control_stop} alt="stop" /></button
              >
            </div>
            <div class="field-row" style="width: 300px">
              <audio controls id="media" on:timeupdate={timeupdate} hidden>
                <source src={musicSrc} id="audioSrc" type="audio/webm" />
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
