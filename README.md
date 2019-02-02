# TTS plugin for Shower

Plugin for the [Shower](https://github.com/shower/shower/) presentation engine. See [documentation](https://github.com/shower/shower/tree/master/docs) for details. Follow [@shower_me](https://twitter.com/shower_me) for support and updates, [file an issue](https://github.com/shower/shower/issues/new) if you have any.

## Install

### For first. install plugin to your presentation.
```bash
    npm install --save shower-tts
```

### Second. Require link to your index file.
```html
	<script src="node_modules/shower-tts/shower-tts.js"></script>
	<link rel="stylesheet" href="node_modules/shower-tts/shower-tts-style.css">
```
 And add plugin's meta
 ```html
	<meta class="tts"></meta>
 ```

## Use

### Add speech text to slide

```html
    	<section class="slide">
		<h2>Some slide</h2>
		<meta class="tts shower-tts-hide">
            Hello. i am ivan. this is Text for speech!
    </meta>
	</section>

```

### Open presentation.

And when open slide press "S" key for speak and "P" for pause

## Good Luck!
