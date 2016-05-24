<template>
<ul>
	<li>
		Just a list item
	</li>
	<li v-for="game in games">
		{{ game.title }}
	</li>
</ul>
</template>

<style lang="sass">
	ul {
		background: blue;
	}
</style>

<script>
export default {

}
</script>
