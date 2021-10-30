<script>
  // import tabbed component items
  import PlayerTab from "./tabbed-components/Player.svelte";
  import SettingsTab from './tabbed-components/Settings.svelte';
  import { user, username } from "../user";
  let tabbedItems = [
    {
      label: "Player",
      component: PlayerTab,
    },
    {
      label: "Settings",
      component: SettingsTab,
    },
    {
      label: "Peer Server",
      component: PlayerTab,
    },
  ];

  let activeTab = 0;

  function tabbedClicked(e) {
    let tabBtns = document.getElementsByClassName("tabbedButtons");

    for (let index of tabBtns) {
      if (index.getAttribute("aria-controls") === e.target.getAttribute("aria-controls")) {
        index.setAttribute("aria-selected", 'true');
        activeTab = tabbedItems.findIndex(element => element.label == index.getAttribute('aria-controls'))
        continue;
      }
      index.setAttribute("aria-selected", "false");
      
    }
  }

  function logout() {
    user.leave();
    username.set("");
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
        {#each tabbedItems as item}
          {#if item.label === 'Player'}
            <button
              class="tabbedButtons"
              aria-selected="true"
              on:click={tabbedClicked}
              aria-controls={item.label}>{item.label}</button
            >
          {:else}
            <button
              class="tabbedButtons"
              aria-selected="false"
              on:click={tabbedClicked}
              aria-controls={item.label}>{item.label}</button
            >
          {/if}
        {/each}
      </menu>
      {#each tabbedItems as item, index}
        <article hidden={(index !== activeTab)}>
          <slot>
            <svelte:component this={item.component}></svelte:component>
          </slot>
        </article>
      {/each}
    </div>
  </div>
</main>
