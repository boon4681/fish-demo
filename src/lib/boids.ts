import type { SecoundOrderSystemSemiImplicitEulerSolver } from "./utils";
import { Vector2D } from "./vector";

// Boid class definition
export class Boid {
    position: Vector2D
    velocity: Vector2D
    acceleration: Vector2D
    maxForce: number
    maxSpeed: number
    solver: SecoundOrderSystemSemiImplicitEulerSolver
    solver2: SecoundOrderSystemSemiImplicitEulerSolver
    constructor(solver: SecoundOrderSystemSemiImplicitEulerSolver, solver2: SecoundOrderSystemSemiImplicitEulerSolver) {
        this.position = new Vector2D(Math.random() * 400, Math.random() * 400);
        this.velocity = new Vector2D(Math.random(), Math.random());
        this.velocity.normalize().multiply(Math.random() * 4 + 2);
        this.acceleration = new Vector2D();
        this.maxForce = 0.01;
        this.maxSpeed = 1.5;
        this.solver = solver.shallow_copy(this.position)
        this.solver2 = solver2.shallow_copy(this.position)
    }

    update() {
        this.velocity = this.velocity.add(this.acceleration).limit(this.maxSpeed);
        this.position = this.position.add(this.velocity);
        this.acceleration = this.acceleration.multiply(0);
    }

    applyForce(force: Vector2D) {
        this.acceleration = this.acceleration.add(force);
    }

    flock(boids: Boid[]) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        alignment = alignment.multiply(1.0);
        cohesion = cohesion.multiply(1.0);
        separation = separation.multiply(1.5);

        this.applyForce(alignment);
        this.applyForce(cohesion);
        this.applyForce(separation);
    }

    // Alignment behavior: steer towards the average heading of local flockmates
    align(boids: Boid[]) {
        let perceptionRadius = 50;
        let steering = new Vector2D();
        let total = 0;

        for (let other of boids) {
            let d = Math.abs(this.position.distanceTo(other.position))
            if (other !== this && d < perceptionRadius) {
                steering = steering.add(other.velocity);
                total++;
            }
        }

        if (total > 0) {
            steering = steering.divide(total);
            steering = steering.normalize().multiply(this.maxSpeed);
            steering = steering.subtract(this.velocity);
            steering = steering.limit(this.maxForce);
        }
        // console.log(steering)

        return steering;
    }

    // Cohesion behavior: steer to move toward the average position of local flockmates
    cohesion(boids: Boid[]) {
        let perceptionRadius = 50;
        let steering = new Vector2D();
        let total = 0;

        for (let other of boids) {
            let d = Math.abs(this.position.distanceTo(other.position))
            if (other !== this && d < perceptionRadius) {
                steering = steering.add(other.position);
                total++;
            }
        }

        if (total > 0) {
            steering = steering.divide(total);
            steering = steering.subtract(this.position);
            steering = steering.normalize().multiply(this.maxSpeed);
            steering = steering.subtract(this.velocity);
            steering = steering.limit(this.maxForce);
        }

        return steering;
    }

    // Separation behavior: steer to avoid crowding local flockmates
    separation(boids: Boid[]) {
        let perceptionRadius = 24;
        let steering = new Vector2D();
        let total = 0;

        for (let other of boids) {
            let d = Math.abs(this.position.distanceTo(other.position))
            if (other !== this && d < perceptionRadius) {
                let diff = this.position.clone().subtract(other.position).divide(d * d); // Weight by distance
                steering = steering.add(diff);
                total++;
            }
        }

        if (total > 0) {
            steering = steering.divide(total);
            steering = steering.normalize().multiply(this.maxSpeed);
            steering = steering.subtract(this.velocity);
            steering = steering.limit(this.maxForce);
        }

        return steering;
    }


    edges(width: number, height: number) {
        const center = new Vector2D(width, height).divide(2).subtract(this.position).normalize()
        if (this.position.x > width) this.velocity.x = center.x;
        if (this.position.x < 0) this.velocity.x = center.x;
        if (this.position.y > height) this.velocity.y = center.y;
        if (this.position.y < 0) this.velocity.y = center.y;
    }

    avoidMouse(mouseX: number, mouseY: number) {
        let mousePos = new Vector2D(mouseX, mouseY);
        let d = Math.abs(this.position.distanceTo(mousePos));

        let perceptionRadius = 50;
        if (d < perceptionRadius) {
            let strength = 5;
            let diff = this.position.clone().subtract(mousePos).normalize().divide(d).multiply(strength);
            this.applyForce(diff);
        }
    }
}

