<template>
<div class="app">
	<games-list></games-list>
	<ul>
		<li>
			This will be unstyled
		</li>
	</ul>
</div>
</template>

<script>
import GamesList from './GamesList.vue'

export default {
	components: {
		GamesList
	}
}
</script>
