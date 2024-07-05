skinview3d
========

[![CI Status](https://img.shields.io/github/actions/workflow/status/bs-community/skinview3d/ci.yaml?branch=master&label=CI&logo=github&style=flat-square)](https://github.com/bs-community/skinview3d/actions?query=workflow:CI)
[![NPM Package](https://img.shields.io/npm/v/skinview3d.svg?style=flat-square)](https://www.npmjs.com/package/skinview3d)
[![MIT License](https://img.shields.io/badge/license-MIT-yellowgreen.svg?style=flat-square)](https://github.com/bs-community/skinview3d/blob/master/LICENSE)
[![Gitter Chat](https://img.shields.io/gitter/room/TechnologyAdvice/Stardust.svg?style=flat-square)](https://gitter.im/skinview3d/Lobby)

Three.js powered Minecraft skin viewer.

# 기능
* 1.8 스킨들
* HD 스킨들
* 망토
* 귀
* 겉날개
* 슬림한 팔
  * 모델 자동 감지기능 (슬림 / 기본)
* FXAA (빠르고 정확한 안티앨리어싱)

# 사용
[skinview3d의 사용 예시](https://bs-community.github.io/skinview3d/)

[![CodeSandbox](https://img.shields.io/badge/Codesandbox-040404?style=for-the-badge&logo=codesandbox&logoColor=DBDBDB)](https://codesandbox.io/s/skinview3d-template-vdmuh4)

```html
<canvas id="skin_container"></canvas>
<script>
	let skinViewer = new skinview3d.SkinViewer({
		canvas: document.getElementById("skin_container"),
		width: 300,
		height: 400,
		skin: "img/skin.png"
	});

	// 뷰어의 크기 변경하기
	skinViewer.width = 600;
	skinViewer.height = 800;

	// 다른 스킨 로드하기
	skinViewer.loadSkin("img/skin2.png");

	// 망토 로드하기
	skinViewer.loadCape("img/cape.png");

	// 겉날개 로드하기 (텍스쳐에서 가져옴)
	skinViewer.loadCape("img/cape.png", { backEquipment: "elytra" });

	// 망토 로드 해제(숨김) / 겉날개
	skinViewer.loadCape(null);

	// 배경색 설정
	skinViewer.background = 0x5a76f3;

	// 기본 이미지로 배경로드
	skinViewer.loadBackground("img/background.png");

	// 배경을 파노라마로 로드하기
	skinViewer.loadPanorama("img/panorama1.png");

	// FOV 카메라 수치 변경
	skinViewer.fov = 70;

	// 줌아웃
	skinViewer.zoom = 0.5;

	// 스킨 회전
	skinViewer.autoRotate = true;

	// Apply an animation
	skinViewer.animation = new skinview3d.WalkingAnimation();

	// Set the speed of the animation
	skinViewer.animation.speed = 3;

	// Pause the animation
	skinViewer.animation.paused = true;

	// Remove the animation
	skinViewer.animation = null;
</script>
```

## Lighting
By default, there are two lights on the scene. One is an ambient light, and the other is a point light from the camera.

To change the light intensity:
```js
skinViewer.cameraLight.intensity = 0.9;
skinViewer.globalLight.intensity = 0.1;
```

Setting `globalLight.intensity` to `1.0` and `cameraLight.intensity` to `0.0`
will completely disable shadows.

## Ears
skinview3d supports two types of ear texture:
* `standalone`: 14x7 image that contains the ear ([example](https://github.com/bs-community/skinview3d/blob/master/examples/img/ears.png))
* `skin`: Skin texture that contains the ear (e.g. [deadmau5's skin](https://minecraft.fandom.com/wiki/Easter_eggs#Deadmau5.27s_ears))

Usage:
```js
// You can specify ears in the constructor:
new skinview3d.SkinViewer({
	skin: "img/deadmau5.png",

	// Use ears drawn on the current skin (img/deadmau5.png)
	ears: "current-skin",

	// Or use ears from other textures
	ears: {
		textureType: "standalone", // "standalone" or "skin"
		source: "img/ears.png"
	}
});

// Show ears when loading skins:
skinViewer.loadSkin("img/deadmau5.png", { ears: true });

// Use ears from other textures:
skinViewer.loadEars("img/ears.png", { textureType: "standalone" });
skinViewer.loadEars("img/deadmau5.png", { textureType: "skin" });
```

## Name Tag
Usage:
```js
// Name tag with text "hello"
skinViewer.nameTag = "hello";

// Specify the text color
skinViewer.nameTag = new skinview3d.NameTagObject("hello", { textStyle: "yellow" });

// Unset the name tag
skinViewer.nameTag = null;
```

In order to display name tags correctly, you need the `Minecraft` font from
[South-Paw/typeface-minecraft](https://github.com/South-Paw/typeface-minecraft).
This font is available at [`assets/minecraft.woff2`](assets/minecraft.woff2).

To load this font, please add the `@font-face` rule to your CSS:
```css
@font-face {
	font-family: 'Minecraft';
	src: url('/path/to/minecraft.woff2') format('woff2');
}
```

# Build
`npm run build`
