<script lang="ts">
	import { Icon, MapPin } from 'svelte-hero-icons';

  const nominatimUrl = 'https://nominatim.openstreetmap.org/search.php?format=jsonv2&countrycodes=be&q=';

	interface Result {
    display_name: string;
    [key: string]: any;
  }

  export let placeholder: string;
	export let value: [number, number] | undefined;
  let results: Result[] = [ ];
  let showDropdown = false;
  let input = value ? value[0] + ', ' + value[1] : '';
  export let callback: (selected: Result) => void = () => { };
	let timeout: number;

  function searchNominatim(query: string) {
    fetch(nominatimUrl + query)
      .then(response => response.json())
      .then(data => {
        results = data;
				console.log(results);
        showDropdown = true;
      });
  }

  function handleInput(event: Event) {
    input = event.target.value;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (input.length > 2) searchNominatim(input);
			else showDropdown = false;
		}, 500);
  }

	function handleBlur(event: Event) {
		input = event.target.value;
		showDropdown = false;
		if (timeout) clearTimeout(timeout);
		if (input.length > 2) {
			fetch(nominatimUrl + input)
				.then(response => response.json())
				.then(data => {
					results = data;
					if (results.length > 0) {
						input = results[0].display_name;
						if (callback) callback(results[0]);
					}
				});
		}
	}

  function handleSelect(result: Result) {
    input = result.display_name;
    showDropdown = false;
    if (callback) callback(result);
  }
</script>

<label class="input input-bordered flex items-center gap-2 relative">
	<Icon src="{MapPin}" size="20" />
	<input type="text" bind:value={input} {placeholder} class="grow" on:input={handleInput}
	on:blur={handleBlur}
	/>
</label>
{#if showDropdown && results.length > 0}
	<ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full absolute z-[1000] w-fit min-w-48">
		{#each results as result}
			<li class="p-2 hover:bg-primary hover:text-primary-content cursor-pointer" on:click={() => handleSelect(result)}>
				{result.display_name}
			</li>
		{/each}
	</ul>
{/if}
