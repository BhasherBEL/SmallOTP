<script lang="ts">
	export let itinerary: any;
	
	let startTime = new Date(itinerary.startTime);
	let endTime = new Date(itinerary.endTime);
	let duration = Math.max(Math.round(itinerary.duration / 60), 1);
	let legs = itinerary.legs;
	let legsType = legs.map(leg => leg.mode);
	let strDuration = duration > 60 ? `${Math.floor(duration / 60)} h ${duration % 60} min.` : `${duration} min.`;
</script>

<div class="flex border-gray-800">
		<div class="grow">
			{#each legsType as lt}
				{#if lt === 'WALK'}
					<img src="/icons/directions_walk.svg" alt="Walk" class="w-8 h-8 filter invert-[0.5]" />
				{:else if lt === 'BICYCLE'}
					<img src="/icons/directions_bike.svg" alt="Bike" class="w-8 h-8 filter invert-[0.5]" />
				{:else if lt === 'TRANSIT'}
					<img src="/icons/directions_bus.svg" alt="Bus" class="w-8 h-8 filter invert-[0.5]" />
				{:else}
					??
				{/if}
			{/each}
		</div>
		<div class="text-right">
			<div>
			{startTime.getHours()}:{startTime.getMinutes()} - {endTime.getHours()}:{endTime.getMinutes()}
			</div>
			<div>
				{strDuration}
			</div>
		</div>
</div>
