skinview3d
========

[![CI Status](https://img.shields.io/github/actions/workflow/status/bs-community/skinview3d/ci.yaml?branch=master&label=CI&logo=github&style=flat-square)](https://github.com/bs-community/skinview3d/actions?query=workflow:CI)
[![NPM Package](https://img.shields.io/npm/v/skinview3d.svg?style=flat-square)](https://www.npmjs.com/package/skinview3d)
[![MIT License](https://img.shields.io/badge/license-MIT-yellowgreen.svg?style=flat-square)](https://github.com/bs-community/skinview3d/blob/master/LICENSE)
[![Gitter Chat](https://img.shields.io/gitter/room/TechnologyAdvice/Stardust.svg?style=flat-square)](https://gitter.im/skinview3d/Lobby)

Three.js로 마인크래프트 스킨을 렌더링합니다.

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

	// 애니메이션 적용
	skinViewer.animation = new skinview3d.WalkingAnimation();

	// 애니메이션의 속도 설정
	skinViewer.animation.speed = 3;

	// 애니메이션 중지하기
	skinViewer.animation.paused = true;

	// 애니메이션 삭제하기
	skinViewer.animation = null;
</script>
```

## 조명
기본적으로는, 씬에는 두가지 조명이 적용되어있습니다. 하나는 ambient 조명이고, 다른 하나는 카메라로부터 나오는 point 조명입니다.

조명의 강도를 변경하려면:
```js
skinViewer.cameraLight.intensity = 0.9;
skinViewer.globalLight.intensity = 0.1;
```

`globalLight.intensity`을 `1.0`으로 설정하고 `cameraLight.intensity`를 `0.0`으로 설정하면
완전히 그림자를 없앱니다.

## Ears
skinview3d는 두가지 유형의 귀를 지원합니다 
텍스처:
* `독립형`: 14x7 이미지가 귀를 포함한 것 ([example](https://github.com/bs-community/skinview3d/blob/master/examples/img/ears.png))
* `스킨`: 귀를 포함한 스킨 텍스쳐 (e.g. [deadmau5's skin](https://minecraft.fandom.com/wiki/Easter_eggs#Deadmau5.27s_ears))

사용:
```js
// 생성자에서 귀를 지정할 수 있습니다:
new skinview3d.SkinViewer({
	skin: "img/deadmau5.png",

	// 현재 스킨에 귀를 사용하기 (img/deadmau5.png)
	ears: "current-skin",

	// 또는 다른 텍스쳐 이미지에서 가져온 귀를 사용할 수 있습니다: {
		textureType: "standalone", // "standalone" or "skin"
		source: "img/ears.png"
	}
});

// 스킨을 로드할때 귀를 보이게 하기:
skinViewer.loadSkin("img/deadmau5.png", { ears: true });

// 다른 텍스쳐에서 가져온 귀를 사용하기:
skinViewer.loadEars("img/ears.png", { textureType: "standalone" });
skinViewer.loadEars("img/deadmau5.png", { textureType: "skin" });
```

## 이름 태그
사용:
```js
// 이름 태그를 "hello"로 설정하기
skinViewer.nameTag = "hello";

// 이름 태그의 색 지정
skinViewer.nameTag = new skinview3d.NameTagObject("hello", { textStyle: "yellow" });

// 이름 태그 해제
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
