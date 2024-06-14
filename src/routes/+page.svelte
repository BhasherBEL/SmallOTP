<script lang="ts">
    import { LeafletMap, Marker, TileLayer, Icon as MarkerIcon } from "svelte-leafletjs";
		import 'leaflet/dist/leaflet.css';
    import VerbatimInput from "$lib/components/verbatimInput.svelte";
    import { Icon, MagnifyingGlass } from "svelte-hero-icons";
    import { onMount } from "svelte";
		import { fetchRoutesAPI } from "$lib/api/opentripplanner";
    import Itinary from "$lib/components/itinerary.svelte";

    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

		const mapOptions = {
        center: [50.8466, 4.3514],
        zoom: 13,
    };

    const tileLayerOptions = {
        minZoom: 5,
        maxZoom: 20,
        maxNativeZoom: 19,
        attribution: "© OpenStreetMap contributors",
    };

		let from = undefined as [number, number] | undefined;
		let to = undefined as [number, number] | undefined;
		let leafletMap: LeafletMap;
		let mode: string;
		let itineraries = [];

		function setFrom(lat: number, lon: number) {
			from = [lat, lon];
			buildHash();
		}

		function setTo(lat: number, lon: number) {
			to = [lat, lon];
			buildHash();
		}

		function setMode(m: string) {
			mode = m;
			buildHash();
		}

		function buildHash() {
			const parts = [];
			if (from) parts.push(`from=${from[0]},${from[1]}`);
			if (to) parts.push(`to=${to[0]},${to[1]}`);
			if (mode) parts.push(`mode=${mode}`);
			document.location.hash = parts.join('&');
		}

		function readFromHash() {
			const hash = document.location.hash.slice(1);
			const parts = hash.split('&');
			for (const part of parts) {
				if (!part.includes('=')) continue;
				const [key, value] = part.split('=');
				const [lat, lon] = value.split(',').map(Number);
				if (key === 'from') from = [lat, lon];
				else if (key === 'to') to = [lat, lon];
				else if (key === 'mode') mode = value;
			}
		}

		async function onTrip() {
			if (!from || !to || !mode) return;
			const result = await fetchRoutesAPI(from, to, mode, new Date());
			if(result && result.plan && result.plan.itineraries) {
				itineraries = result.plan.itineraries;
			}
		}

		readFromHash();

		onMount(() => {
			const map = leafletMap.getMap();
			if(!map) return;

			if (from && to) map.fitBounds([from, to]);
			else if (from) map.setView(from, 13);
			else if (to) map.setView(to, 13);
		})

</script>

<div class="w-screen h-screen flex z-0">
	<div class="w-[500px]">
		<div class="mx-4 my-2 space-y-2">
			<h2 class="text-2xl font-bold">Trip planner</h2>
			<VerbatimInput value={from} placeholder="From" callback={(f) => setFrom(f.lat, f.lon)} />
			<VerbatimInput value={to} placeholder="To" callback={(t) => setTo(t.lat, t.lon)} />
			<div class="join w-full">
				<button class="join-item btn grow" class:btn-primary={mode === 'BICYCLE'} on:click={() => setMode('BICYCLE')}>
					<img src="/icons/directions_bike.svg" alt="Bike" class="w-8 h-8 filter invert" />
				</button>
				<button class="join-item btn grow" class:btn-primary={mode === 'WALK'} on:click={() => setMode('WALK')}>
					<img src="/icons/directions_walk.svg" alt="Walk" class="w-8 h-8 filter invert" />
				</button>
				<button class="join-item btn grow" class:btn-primary={mode === 'TRANSIT'} on:click={() => setMode('TRANSIT')}>
					<img src="/icons/directions_bus.svg" alt="Transports" class="w-8 h-8 filter invert" />
				</button>
			</div>
			<button class="btn btn-primary w-full" on:click={onTrip}>
				<Icon src="{MagnifyingGlass}" size="20" />
			</button>
		</div>
		{#if itineraries.length > 0}
			<div class="mx-4 my-2 space-y-2">
				<h2 class="text-2xl font-bold">Itineraries</h2>
				{#each itineraries as itinerary}
					<Itinary {itinerary} />
				{/each}
				</div>
		{/if}
	</div>
	<LeafletMap bind:this={leafletMap} options={mapOptions}>
			<TileLayer url={tileUrl} options={tileLayerOptions}/>
			{#if from}
				<Marker latLng={from}>
					<MarkerIcon iconUrl="/marker-green.png" />
				</Marker>
			{/if}
			{#if to}
				<Marker latLng={to}>
					<MarkerIcon iconUrl="/marker-red.png" />
				</Marker>
			{/if}
	</LeafletMap>
</div>

