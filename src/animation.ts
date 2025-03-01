import { PlayerObject } from "./model.js";

/**
 * {@link PlayerObject}로 실행될 수 있는 애니메이션.
 *
 * 이 클래스는 추상 클래스입니다. 하위 클래스가 특정 애니메이션을 상속받습니다.
 *
 */
export abstract class PlayerAnimation {
	/**
	 * 애니메이션의 속도
	 *
	 * @기본값 `1.0`
	 */
	speed: number = 1.0;

	/**
	 * 애니메이션이 중지되었는가 하는 변수
	 *
	 * @기본값 `false`
	 */
	paused: boolean = false;

	/**
	 * 애니메이션의 현재 진행률
	 */
	progress: number = 0;

	/**
	 * 애니메이션을 재생합니다
	 *
	 * @param player - player 객체
	 * @param delta - progress difference since last call
	 */
	protected abstract animate(player: PlayerObject, delta: number): void;

	/**
	 * 진행률을 업데이트하고, 애니메이션을 재생합니다
	 *
	 * The elapsed time `deltaTime` will be scaled by {@link speed}.
	 * If {@link paused} is `true`, this method will do nothing.
	 *
	 * @param player - the player object
	 * @param deltaTime - time elapsed since last call
	 */
	update(player: PlayerObject, deltaTime: number): void {
		if (this.paused) {
			return;
		}
		const delta = deltaTime * this.speed;
		this.animate(player, delta);
		this.progress += delta;
	}
}

/**
 * A class that helps you create an animation from a function.
 *
 * @example
 * To create an animation that rotates the player:
 * ```
 * new FunctionAnimation((player, progress) => player.rotation.y = progress)
 * ```
 */
export class FunctionAnimation extends PlayerAnimation {
	fn: (player: PlayerObject, progress: number, delta: number) => void;

	constructor(fn: (player: PlayerObject, progress: number, delta: number) => void) {
		super();
		this.fn = fn;
	}

	protected animate(player: PlayerObject, delta: number): void {
		this.fn(player, this.progress, delta);
	}
}

export class IdleAnimation extends PlayerAnimation {
	protected animate(player: PlayerObject): void {
		// 애니메이션의 기본 속도를 곱합니다.
		const t = this.progress * 2;

		// 팔 스윙
		const basicArmRotationZ = Math.PI * 0.02;
		player.skin.leftArm.rotation.z = Math.cos(t) * 0.03 + basicArmRotationZ;
		player.skin.rightArm.rotation.z = Math.cos(t + Math.PI) * 0.03 - basicArmRotationZ;

		// Always add an angle for cape around the x axis
		const basicCapeRotationX = Math.PI * 0.06;
		// player.cape.rotation.x = Math.sin(t) * 0.01 + basicCapeRotationX;
	}
}

export class WalkingAnimation extends PlayerAnimation {
	/**
	 * Whether to shake head when walking.
	 *
	 * @defaultValue `true`
	 */
	headBobbing: boolean = true;

	protected animate(player: PlayerObject): void {
		// Multiply by animation's natural speed
		const t = this.progress * 8;

		// Leg swing
		player.skin.leftLeg.rotation.x = Math.sin(t) * 0.5;
		player.skin.rightLeg.rotation.x = Math.sin(t + Math.PI) * 0.5;

		// 팔 스윙
		player.skin.leftArm.rotation.x = Math.sin(t + Math.PI) * 0.5;
		player.skin.rightArm.rotation.x = Math.sin(t) * 0.5;
		const basicArmRotationZ = Math.PI * 0.02;
		player.skin.leftArm.rotation.z = Math.cos(t) * 0.03 + basicArmRotationZ;
		player.skin.rightArm.rotation.z = Math.cos(t + Math.PI) * 0.03 - basicArmRotationZ;

		if (this.headBobbing) {
			// Head shaking with different frequency & amplitude
			player.skin.head.rotation.y = Math.sin(t / 4) * 0.2;
			player.skin.head.rotation.x = Math.sin(t / 5) * 0.1;
		} else {
			player.skin.head.rotation.y = 0;
			player.skin.head.rotation.x = 0;
		}

		// Always add an angle for cape around the x axis
		const basicCapeRotationX = Math.PI * 0.06;
		// player.cape.rotation.x = Math.sin(t / 1.5) * 0.06 + basicCapeRotationX;
	}
}

export class RunningAnimation extends PlayerAnimation {
	protected animate(player: PlayerObject): void {
		// Multiply by animation's natural speed
		const t = this.progress * 15 + Math.PI * 0.5;

		// Leg swing with larger amplitude
		player.skin.leftLeg.rotation.x = Math.cos(t + Math.PI) * 1.3;
		player.skin.rightLeg.rotation.x = Math.cos(t) * 1.3;

		// Arm swing
		player.skin.leftArm.rotation.x = Math.cos(t) * 1.5;
		player.skin.rightArm.rotation.x = Math.cos(t + Math.PI) * 1.5;
		const basicArmRotationZ = Math.PI * 0.1;
		player.skin.leftArm.rotation.z = Math.cos(t) * 0.1 + basicArmRotationZ;
		player.skin.rightArm.rotation.z = Math.cos(t + Math.PI) * 0.1 - basicArmRotationZ;

		// 점프
		player.position.y = Math.cos(t * 2);
		// 뛸때 살짝 피하기
		player.position.x = Math.cos(t) * 0.15;
		// 뛸때 살짝 기울이기
		player.rotation.z = Math.cos(t + Math.PI) * 0.01;

		// Apply higher swing frequency, lower amplitude,
		// and greater basic rotation around x axis,
		// to cape when running.
		const basicCapeRotationX = Math.PI * 0.3;
		// player.cape.rotation.x = Math.sin(t * 2) * 0.1 + basicCapeRotationX;

		// What about head shaking?
		// You shouldn't glance right and left when running dude :P
	}
}

function clamp(num: number, min: number, max: number): number {
	return num <= min ? min : num >= max ? max : num;
}

export class FlyingAnimation extends PlayerAnimation {
	protected animate(player: PlayerObject): void {
		// 몸통의 회전은 0.5초안에 종료됩니다
		// 겉날개의 확장은 3.3초안에 종료됩니다

		const t = this.progress > 0 ? this.progress * 20 : 0;
		const startProgress = clamp((t * t) / 100, 0, 1);

		player.rotation.x = (startProgress * Math.PI) / 2;
		player.skin.head.rotation.x = startProgress > 0.5 ? Math.PI / 4 - player.rotation.x : 0;

		const basicArmRotationZ = Math.PI * 0.25 * startProgress;
		player.skin.leftArm.rotation.z = basicArmRotationZ;
		player.skin.rightArm.rotation.z = -basicArmRotationZ;

		const elytraRotationX = 0.34906584;
		const elytraRotationZ = Math.PI / 2;
		const interpolation = Math.pow(0.9, t);
		// player.elytra.leftWing.rotation.x = elytraRotationX + interpolation * (0.2617994 - elytraRotationX);
		// player.elytra.leftWing.rotation.z = elytraRotationZ + interpolation * (0.2617994 - elytraRotationZ);
		// player.elytra.updateRightWing();
	}
}
