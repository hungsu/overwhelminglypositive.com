// main.js
import Vue from 'vue'
// require a *.vue component
import App from './components/App.vue'

console.log('This will appear first')
// mount a root Vue instance
new Vue({
	el: 'body',
	components: {
		// include the required component
		// in the options
		app: App
	}
})

console.log('This will appear third')
